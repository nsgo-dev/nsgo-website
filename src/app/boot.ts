// What runs before the page shows, inlined in its head: the theme the
// reader chose, the choices the header's menus mark and, while the language
// is automatic, the move to the page in the browser's language.
import { locales } from '../locales';
import { pickLanguage } from '../scripts/language';
import { langs } from '../site';

function start(base: string, langs: { code: string; tag: string }[], pick: typeof pickLanguage) {
	const root = document.documentElement;
	const theme = localStorage.getItem('site-theme');
	const choice = theme === 'light' || theme === 'dark' ? theme : 'auto';
	root.dataset.themeChoice = choice;
	root.dataset.theme = choice === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : choice;
	const language = localStorage.getItem('site-language') || 'auto';
	root.dataset.languageChoice = language;
	// The 404 page answers every missing address, in every language; moving
	// from it would only land on it again.
	if (language !== 'auto' || langs.length < 2 || root.dataset.notFound !== undefined) return;
	const want = pick(navigator.languages || [navigator.language], langs);
	const path = location.pathname.slice(base.length).replace(/^\//, '');
	const segment = path.split('/')[0];
	const have = langs.find((l, i) => i > 0 && l.code === segment)?.code ?? langs[0].code;
	if (want === have) return;
	const rest = have === langs[0].code ? path : path.slice(have.length).replace(/^\//, '');
	const prefix = want === langs[0].code ? '' : `${want}/`;
	location.replace(`${base}/${prefix}${rest}${location.search}${location.hash}`);
}

export function bootScript(): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const choices = langs.map((code) => ({ code, tag: locales[code].tag }));
	return `(${start.toString()})(${JSON.stringify(base)}, ${JSON.stringify(choices)}, ${pickLanguage.toString()});`;
}
