#!/usr/bin/env bun
// Draws the cards that previews show when a page is shared on X, Telegram
// and the like: one 1200×630 PNG per language in public/share/, from the
// home page's words, the logo and the share visual of the settings. Run it
// in the site's folder after changing them; it needs Bun and Chrome.
//
//   nsgo-website-share-cards [site.config.ts]
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Lang, SiteOptions } from '../src/config';
import { languagesOf, resolveSite } from '../src/resolve';

const configPath = resolve(process.argv[2] ?? 'site.config.ts');
const options: SiteOptions = (await import(pathToFileURL(configPath).href)).default;
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = resolve('public/share');
const work = await mkdtemp(join(tmpdir(), 'share-cards-'));

async function run(cmd: string[]) {
	const proc = Bun.spawn(cmd, { stdout: 'ignore', stderr: 'pipe' });
	if ((await proc.exited) !== 0) throw new Error(`${cmd[0]}: ${await new Response(proc.stderr).text()}`);
}

const types: Record<string, string> = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const logoFile = resolve(options.logo);
const logo = `data:${types[extname(logoFile).toLowerCase()] ?? 'image/png'};base64,${(await readFile(logoFile)).toString('base64')}`;
const tokens = await readFile(join(import.meta.dir, '../src/styles/tokens.css'), 'utf8');
const escape = (s: string) => s.replace(/[&<>"]/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[c]};`);

const html = (lang: Lang) => {
	const s = resolveSite(options, lang, '');
	const cjk = 'cjk' in s.locale;
	const headline = s.home ? s.home.headline : [s.title, ''];
	const chips = (s.home && s.home.chips) || [];
	const visual = options.share?.visual ?? `<img class="big-logo" src="${logo}" alt="">`;
	return `<!doctype html><html lang="${s.locale.tag}" data-theme="light"><meta charset="utf-8"><style>
${tokens}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: var(--bg); color: var(--text); font-family: var(--font-sans);
	display: grid; grid-template-columns: 1fr 520px; gap: 48px; align-items: center; padding: 64px 64px 64px 72px; -webkit-font-smoothing: antialiased; }
.text { display: flex; flex-direction: column; height: 100%; min-width: 0; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 650; letter-spacing: -0.01em; }
.brand img { width: 52px; height: 52px; }
h1 { margin-top: auto; font-size: ${cjk ? 56 : 58}px; line-height: 1.1; font-weight: 750; letter-spacing: ${cjk ? '-0.01em' : '-0.03em'}; }
h1 span { display: block; white-space: nowrap; }
h1 span + span { background: linear-gradient(100deg, var(--accent) 10%, #8b5cf6 90%); -webkit-background-clip: text; color: transparent; }
.chips { display: flex; gap: 10px; margin-top: 36px; }
.chips span { border: 1.5px solid var(--border-strong); border-radius: 999px; padding: 8px 18px; font-size: 22px; color: var(--muted); }
.big-logo { display: block; width: 280px; height: 280px; margin: auto; }
${options.share?.css ?? ''}
</style><body>
<div class="text">
	<div class="brand"><img src="${logo}" alt="">${escape(s.name)}</div>
	<h1>${headline.map((line) => `<span>${escape(line)}</span>`).join('')}</h1>
	<div class="chips">${chips.map((m) => `<span>${escape(m)}</span>`).join('')}</div>
</div>
<div class="visual">${visual}</div>
</body></html>`;
};

await mkdir(out, { recursive: true });
const langs = languagesOf(options);
for (const lang of langs) {
	const page = join(work, `${lang}.html`);
	await writeFile(page, html(lang));
	await run([chrome, '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
		'--window-size=1200,630', `--screenshot=${join(out, `${lang}.png`)}`, `file://${page}`]);
}
await rm(work, { recursive: true, force: true });
console.log(`share cards: ${langs.map((l) => `public/share/${l}.png`).join(', ')}`);
