// The docs' sidebar in a language, apart from the parts that draw it so
// that a page can read it without loading them.
import { index } from 'virtual:nsgo-website/docs';
import type { Lang } from '../config';
import { resolveSidebar } from '../docs';
import { first, options } from '../site';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const sidebarOf = (lang: Lang) => resolveSidebar(options.docs?.sidebar, index, lang, first, base);
