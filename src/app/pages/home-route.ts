// The home page's head, apart from its component.
import type { Lang } from '../../config';
import { site } from '../../site';
import { pageHead } from '../head';

export const head = (lang: Lang, _ctx?: unknown) => pageHead(lang, { title: site[lang].title, path: '', home: true });
