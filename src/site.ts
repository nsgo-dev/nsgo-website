/// <reference path="./virtual.d.ts" />
// The settings each language's pages render, and the site's paths.
import options from 'virtual:nsgo-website/options';
import type { Lang } from './config';
import { languagesOf, resolveHref, resolveSite, type Resolved } from './resolve';
import { locales } from './locales';

export { options };

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** The site's languages; the first is served at the root. */
export const langs = languagesOf(options);
export const first = langs[0];

/** Each of the site's languages' content; only those in langs are there. */
export const site = Object.fromEntries(langs.map((l) => [l, resolveSite(options, l, base)])) as Record<Lang, Resolved>;

/** A path of the site under its base, which is a subpath on GitHub Pages. */
export function url(path: string): string {
	return `${base}/${path.replace(/^\//, '')}`;
}

/** An address of the settings as a page in a language has it. */
export function hrefIn(href: string, lang: Lang) {
	return resolveHref(href, lang, first, base);
}

/** The site's language of a Starlight route's BCP-47 tag. */
export function langOf(tag: string): Lang {
	return langs.find((l) => locales[l].tag.toLowerCase() === tag.toLowerCase()) ?? first;
}

/** The language a path of the site is in, by its first segment. */
export function langOfPath(pathname: string): Lang {
	const segment = pathname.slice(base.length).replace(/^\//, '').split('/')[0];
	return langs.find((l) => l !== first && l === segment) ?? first;
}

/** The same page's path in another language. */
export function pathIn(pathname: string, lang: Lang): string {
	const from = langOfPath(pathname);
	let path = pathname.slice(base.length).replace(/^\//, '');
	if (from !== first) path = path.slice(from.length).replace(/^\//, '');
	return `${base}/${lang === first ? '' : `${lang}/`}${path}`;
}
