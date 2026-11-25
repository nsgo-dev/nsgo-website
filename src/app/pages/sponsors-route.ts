// The sponsors page's head, apart from its component.
import type { Lang } from '../../config';
import { site } from '../../site';
import { pageHead } from '../head';

export function head(lang: Lang, _ctx?: unknown) {
	const s = site[lang];
	return pageHead(lang, { title: s.t.sponsors.title, description: s.sponsors ? s.sponsors.description : undefined, path: 'sponsors/' });
}
