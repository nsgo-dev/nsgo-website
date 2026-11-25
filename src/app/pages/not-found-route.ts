// The not found page's head, apart from its component.
import type { Lang } from '../../config';
import { site } from '../../site';
import { pageHead } from '../head';

export function head(lang: Lang, _ctx?: unknown) {
	const t = site[lang].t.notFound;
	return { ...pageHead(lang, { title: t.title, description: t.text, path: '404/' }), meta: [{ title: `${t.title} | ${site[lang].name}` }, { name: 'robots', content: 'noindex' }] };
}
