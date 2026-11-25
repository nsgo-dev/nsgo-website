// The site of an NSGo project as Vite plugins: TanStack Start with Solid,
// a route for each page in each language, the settings and the docs handed
// to the pages through virtual modules, every page rendered to HTML at
// build and the docs indexed for search.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import solid from '@solidjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import type { Plugin, PluginOption } from 'vite';
import { codeBlock, frontmatter, renderMarkdown } from './build/markdown';
import type { Lang, SiteOptions } from './config';
import type { DocMeta, DocsIndex } from './docs';
import { loadRoadmap, type Roadmap } from './roadmap';
import { assetsOf, languagesOf, localize, pagePath, resolveSite } from './resolve';
import { loadStars } from './stars';

export type * from './config';
export { defineSite } from './config';

export interface BuildOptions {
	/** The address the site is served from, as https://owner.github.io, for the share cards' and search engines' links. */
	site: string;
	/** The project's folder; Vite's working folder otherwise. */
	root?: string;
}

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = (path: string) => join(pkg, 'src', path);
const require = createRequire(import.meta.url);
const prefix = 'virtual:nsgo-website/';

/** The docs' Markdown files of each language, by slug: en/guides/a.md is docs/guides/a. */
function scanDocs(dir: string, langs: Lang[]): Partial<Record<Lang, Record<string, string>>> {
	const out: Partial<Record<Lang, Record<string, string>>> = {};
	for (const lang of langs) {
		const base = join(dir, lang);
		if (!existsSync(base)) continue;
		const files: Record<string, string> = {};
		const walk = (folder: string) => {
			for (const entry of readdirSync(folder, { withFileTypes: true })) {
				if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
				const path = join(folder, entry.name);
				if (entry.isDirectory()) walk(path);
				else if (/\.mdx?$/.test(entry.name)) {
					const page = relative(base, path).replace(/\\/g, '/').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
					files[['docs', page].filter(Boolean).join('/')] = path;
				}
			}
		};
		walk(base);
		out[lang] = files;
	}
	return out;
}

/** locales.ts with only the languages given: each other's words and entry are left out. */
function trimLocales(code: string, keep: Lang[]): string {
	const table = code.slice(code.indexOf('export const locales = {'));
	const drop = [...table.matchAll(/^\t'?([a-z-]+)'?: \{.*\bui: (\w+) \},$/gm)].filter((m) => !keep.includes(m[1] as Lang));
	for (const [line, , name] of drop) {
		code = code.replace(`${line}\n`, '');
		code = code.replace(new RegExp(`\\nconst ${name}: UI = \\{\\n[\\s\\S]*?\\n\\};\\n`), '\n');
	}
	return code;
}

/** The site of an NSGo project, from its settings. */
export default function nsgoWebsite(given: SiteOptions, build: BuildOptions): PluginOption[] {
	const root = resolve(build.root ?? process.cwd());
	const langs = languagesOf(given);
	const first = langs[0];
	const gen = join(root, 'node_modules/.nsgo-website');
	const routesDir = join(gen, 'routes');
	const docsDir = resolve(root, given.docs?.dir ?? '../docs/public');
	let options = given;
	let files = scanDocs(docsDir, langs);
	let data: { roadmap?: Roadmap; stars?: number } = {};

	// The pages to render at build; the crawl finds a project's own from their links.
	const pages: { path: string; prerender?: { enabled?: boolean; outputPath?: string } }[] = [];
	let base = '';
	const plan = () => {
		pages.length = 0;
		// Under the base, as the crawl finds them, so that each is rendered once.
		const add = (path: string) => pages.push({ path: `${base}/${path}` });
		for (const lang of langs) {
			if (options.home) add(pagePath('', lang, first));
			for (const slug of Object.keys(files[first] ?? {})) add(pagePath(`${slug}/`, lang, first));
			if (options.roadmap) add(pagePath('roadmap/', lang, first));
			if (options.sponsors) add(pagePath('sponsors/', lang, first));
		}
		pages.push({ path: `${base}/404/`, prerender: { outputPath: '/404.html' } });
	};
	plan();

	/** Writes the router and one small route file per page and language, which TanStack Router builds its tree of. */
	const writeRoutes = () => {
		rmSync(routesDir, { recursive: true, force: true });
		mkdirSync(routesDir, { recursive: true });
		const write = (file: string, text: string) => {
			mkdirSync(dirname(join(gen, file)), { recursive: true });
			writeFileSync(join(gen, file), text);
		};
		const imp = (path: string) => JSON.stringify(src(path));
		write('router.tsx', `import { makeRouter } from ${imp('app/router.tsx')};\nimport { routeTree } from './routeTree.gen';\nexport const getRouter = () => makeRouter(routeTree);\n`);
		write('routes/__root.tsx', `export { Route } from ${imp('app/root.tsx')};\n`);
		const virtual: string[] = [];
		// The head and data come from the page's route module, the component
		// from its own, which the router loads only with the page.
		const route = (path: string, file: string, page: string, lang: Lang, extra = '') => {
			write(
				`routes/${file}`,
				`import { createFileRoute } from '@tanstack/solid-router';\n` +
					`import * as route from ${imp(`app/pages/${page}-route.ts`)};\n` +
					`import { Page } from ${imp(`app/pages/${page}.tsx`)};\n` +
					`export const Route = createFileRoute(${JSON.stringify(path)})({\n` +
					`\thead: (ctx) => route.head(${JSON.stringify(lang)}, ctx),\n${extra}` +
					`\tcomponent: () => <Page lang=${JSON.stringify(lang)} />,\n});\n`,
			);
			virtual.push(`route(${JSON.stringify(path)}, ${JSON.stringify(file)})`);
		};
		const hasDocs = Object.keys(files[first] ?? {}).length > 0;
		for (const lang of langs) {
			const p = lang === first ? '' : `/${lang}`;
			const f = lang === first ? '' : `${lang}/`;
			if (options.home) route(`${p}/`, `${f}index.tsx`, 'home', lang);
			if (hasDocs) route(`${p}/docs/$`, `${f}docs.tsx`, 'docs', lang, `\tloader: ({ params }) => route.load(${JSON.stringify(lang)}, params._splat),\n`);
			if (options.roadmap) route(`${p}/roadmap/`, `${f}roadmap.tsx`, 'roadmap', lang);
			if (options.sponsors) route(`${p}/sponsors/`, `${f}sponsors.tsx`, 'sponsors', lang);
		}
		route('/404/', '404.tsx', 'not-found', first);
		// A project's own pages, under its src/routes, join the same tree.
		const own = join(root, 'src/routes');
		const physical = existsSync(own) ? [`physical('', ${JSON.stringify(relative(routesDir, own))})`] : [];
		write(
			'routes.ts',
			`import { physical, rootRoute, route } from '@tanstack/virtual-file-routes';\n` +
				`export const routes = rootRoute('__root.tsx', [\n\t${[...virtual, ...physical].join(',\n\t')},\n]);\n`,
		);
	};
	writeRoutes();

	// One module of each docs page, rendered when the page asks for it.
	const docIndex = async (): Promise<DocsIndex> => {
		const index: DocsIndex = {};
		for (const lang of langs) {
			index[lang] = {};
			for (const [slug, file] of Object.entries(files[lang] ?? {})) {
				const { data } = frontmatter(readFileSync(file, 'utf8'));
				const sidebar = (data.sidebar ?? {}) as { order?: number; label?: string };
				const meta: DocMeta = { slug, title: String(data.title ?? slug.split('/').pop()), description: data.description as string | undefined, order: sidebar.order, label: sidebar.label };
				index[lang]![slug] = meta;
			}
		}
		return index;
	};

	const file = (path: string) => JSON.stringify(isAbsolute(path) ? path : resolve(root, path));
	const modules: Record<string, (id: string) => string | Promise<string>> = {
		options: () => `export default ${JSON.stringify(options)};\nexport const site = ${JSON.stringify(build.site.replace(/\/$/, ''))};`,
		assets: () => {
			const { images } = assetsOf(options);
			return [...images.map((m, i) => `import m${i} from ${file(m)};`), `export const images = {${images.map((m, i) => `${JSON.stringify(m)}: m${i}`).join(', ')}};`].join('\n');
		},
		components: () => {
			const { components } = assetsOf(options);
			return [...components.map((c, i) => `import c${i} from ${file(c)};`), `export const components = {${components.map((c, i) => `${JSON.stringify(c)}: c${i}`).join(', ')}};`].join('\n');
		},
		icons: () => {
			const { icons } = assetsOf(options);
			return [
				...icons.map((name, i) => {
					let path: string;
					try {
						path = require.resolve(`kubai-icons/icons/${name}`);
					} catch {
						throw new Error(`nsgo-website: Kubai Icons has no icon named "${name}"`);
					}
					return `import k${i} from ${JSON.stringify(path)};`;
				}),
				`export const icons = {${icons.map((name, i) => `${JSON.stringify(name)}: k${i}`).join(', ')}};`,
			].join('\n');
		},
		// The site's stylesheet, which Tailwind builds from the package's classes
		// and the project's own, then the look's and the project's CSS over them.
		styles: () => {
			const css = [
				`@import ${JSON.stringify(src('styles/app.css'))};`,
				...(options.look && options.look !== 'default' ? [`@import ${JSON.stringify(src(`styles/${options.look}.css`))};`] : []),
				...(options.customCss ?? []).map((c) => `@import ${JSON.stringify(resolve(root, c))};`),
				`@source ${JSON.stringify(relative(gen, join(root, 'src')).replace(/\\/g, '/'))};`,
			].join('\n');
			writeFileSync(join(gen, 'styles.css'), `${css}\n`);
			return `import ${JSON.stringify(join(gen, 'styles.css'))};`;
		},
		// The home pages' code, highlighted at build as the docs' is.
		code: async () => {
			const out: Record<string, string> = {};
			for (const lang of langs) {
				const s = resolveSite(options, lang, '');
				for (const section of s.home ? s.home.sections : []) {
					if (section.type === 'split' && section.code) out[`${lang}\0${section.code.lang}\0${section.code.code}`] = await codeBlock(section.code.code, section.code.lang, undefined, s.t);
				}
			}
			return `export const code = ${JSON.stringify(out)};`;
		},
		// Apart, so the header's stars never bring the roadmap with them.
		roadmap: () => `export const roadmap = ${JSON.stringify(data.roadmap ?? null)};`,
		stars: () => `export const stars = ${JSON.stringify(data.stars ?? null)};`,
		docs: async () => {
			const loads = langs.flatMap((lang) => Object.keys(files[lang] ?? {}).map((slug) => `${JSON.stringify(`${lang}:${slug}`)}: () => import(${JSON.stringify(`${prefix}doc/${lang}/${slug}`)})`));
			return `export const index = ${JSON.stringify(await docIndex())};\nexport const pages = {${loads.join(',\n')}};`;
		},
		doc: async (id) => {
			const [lang, ...rest] = id.slice('doc/'.length).split('/') as [Lang, ...string[]];
			const slug = rest.join('/');
			const path = files[lang]?.[slug];
			if (!path) throw new Error(`nsgo-website: no docs page ${lang}/${slug}`);
			const s = resolveSite(options, lang, '');
			const { data, html, headings } = await renderMarkdown(readFileSync(path, 'utf8'), s.t);
			// The source's path in the repository, whose site folder is the path setting.
			const edit = `${s.repo}/edit/${s.branch}/${posix.normalize(`${s.path}/${relative(root, path).replace(/\\/g, '/')}`)}`;
			return `export default ${JSON.stringify({ title: data.title ?? slug, description: data.description, html, headings, edit })};`;
		},
	};

	const settings: Plugin = {
		name: 'nsgo-website',
		enforce: 'pre',
		async config(config, env) {
			base = (config.base ?? '/').replace(/\/$/, '');
			plan();
			// A roadmap whose tracking issue does not exist is left out, with
			// its page and links, as if the setting were not there.
			const roadmap = resolveSite(options, first, base).roadmap;
			if (roadmap) {
				data.roadmap = await loadRoadmap(roadmap);
				if (data.roadmap.status === 'missing') {
					console.warn(`[roadmap] left out: ${roadmap.owner}/${roadmap.name}#${roadmap.tracking} not found`);
					options = { ...options, roadmap: false };
					data.roadmap = undefined;
					plan();
					writeRoutes();
				}
			}
			data.stars = await loadStars(options.repo);
			// A tier's places are kept by the sponsors in it, so a full tier shows them all and only warns.
			for (const tier of options.sponsors ? options.sponsors.tiers : []) {
				if (tier.places !== undefined && tier.sponsors.length > tier.places) {
					console.warn(`[sponsors] ${localize(tier.title, first)} has ${tier.sponsors.length} sponsors for ${tier.places} places`);
				}
			}
			return {
				// ui-sdk's components and the core they load must share one copy.
				optimizeDeps: { exclude: ['@ui-sdk/core', 'nsgo-website'] },
				ssr: { noExternal: ['nsgo-website', /^@ui-sdk\//] },
				resolve: { dedupe: ['solid-js', '@solidjs/web', '@ui-sdk/core', '@ui-sdk/solid', '@tanstack/solid-router'] },
				// The site is what dist holds; the renderer it was made with stays out of it.
				environments: {
					client: { build: { outDir: 'dist' } },
					ssr: { build: { outDir: join(gen, 'server') } },
				},
				server: env.command === 'serve' ? { watch: { ignored: [`${gen}/**`] } } : undefined,
			};
		},
		configureServer(dev) {
			// A docs page edited, added or removed shows at once.
			dev.watcher.add(docsDir);
			const changed = (path: string) => {
				if (!path.startsWith(docsDir)) return;
				files = scanDocs(docsDir, langs);
				for (const env of Object.values(dev.environments)) {
					for (const mod of [...env.moduleGraph.idToModuleMap.values()]) if (mod.id?.startsWith(`\0${prefix}doc`)) env.moduleGraph.invalidateModule(mod);
				}
				dev.ws.send({ type: 'full-reload' });
			};
			dev.watcher.on('change', changed);
			dev.watcher.on('add', changed);
			dev.watcher.on('unlink', changed);
		},
		resolveId(id) {
			if (id.startsWith(prefix)) return `\0${id}`;
		},
		// The words of the site's own languages only, not of every language the package has.
		transform: {
			filter: { id: /[\\/]src[\\/]locales\.ts$/ },
			handler(code, id) {
				if (resolve(id) !== src('locales.ts')) return;
				return trimLocales(code, langs);
			},
		},
		load(id) {
			// A project's own code, as file.go?highlight, highlighted as the docs' is.
			const [path, query] = id.split('?');
			if (query === 'highlight') {
				this.addWatchFile(path);
				const ext = path.split('.').pop() ?? '';
				return codeBlock(readFileSync(path, 'utf8').replace(/\n$/, ''), ext, undefined, resolveSite(options, first, '').t).then((html) => `export default ${JSON.stringify(html)};`);
			}
			if (!id.startsWith(`\0${prefix}`)) return;
			const name = id.slice(prefix.length + 1);
			const make = name.startsWith('doc/') ? modules.doc : modules[name];
			if (!make) throw new Error(`nsgo-website: no module ${id.slice(1)}`);
			return make(name);
		},
	};

	// The docs indexed for search once every page is HTML.
	const search: Plugin = {
		name: 'nsgo-website:search',
		enforce: 'post',
		apply: 'build',
		buildApp: {
			order: 'post',
			async handler(builder) {
				const out = resolve(root, builder.environments.client?.config.build.outDir ?? 'dist');
				const pagefind = await import('pagefind');
				const { index } = await pagefind.createIndex({});
				if (!index) throw new Error('nsgo-website: Pagefind could not start');
				const { page_count } = await index.addDirectory({ path: out });
				await index.writeFiles({ outputPath: join(out, 'pagefind') });
				await pagefind.close();
				console.log(`[search] indexed ${page_count} pages`);
			},
		},
	};

	return [
		settings,
		tanstackStart({
			srcDirectory: relative(root, gen),
			router: {
				routesDirectory: routesDir,
				generatedRouteTree: join(gen, 'routeTree.gen.ts'),
				virtualRouteConfig: relative(root, join(gen, 'routes.ts')),
				// The generator's scratch files stay with the rest it writes, out of the project.
				tmpDir: join(gen, 'tmp'),
			},
			prerender: {
				enabled: true,
				crawlLinks: true,
				autoSubfolderIndex: true,
				failOnError: true,
				// A part of a page is the page itself, and the 404 page is only 404.html.
				filter: (page: { path: string; prerender?: { outputPath?: string } }) => !page.path.includes('#') && (!page.path.endsWith('/404/') || !!page.prerender?.outputPath),
			},
			pages,
		}),
		solid({ ssr: true }),
		tailwindcss(),
		search,
	];
}
