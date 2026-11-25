// What a page puts in its head: its title and description, the card it
// shows when shared on X, Telegram and the like, and its address in each
// of the site's languages for search engines.
import type { Lang } from '../config';
import { pagePath } from '../resolve';
import { absolute, first, langs, site, url } from '../site';

export interface PageInfo {
	title: string;
	description?: string;
	/** The page's path as the first language has it, as docs/quick-start/. */
	path: string;
	/** The home page is the site itself; it names itself in its title. */
	home?: boolean;
}

export function pageHead(lang: Lang, page: PageInfo) {
	const s = site[lang];
	const title = page.home ? page.title : `${page.title} | ${s.name}`;
	const description = page.description ?? s.description;
	const here = absolute(url(pagePath(page.path, lang, first)));
	const meta: Record<string, string>[] = [
		{ title },
		{ name: 'description', content: description },
		{ property: 'og:title', content: page.home ? page.title : title },
		{ property: 'og:description', content: description },
		{ property: 'og:type', content: page.home ? 'website' : 'article' },
		{ property: 'og:url', content: here },
		{ property: 'og:site_name', content: s.name },
		{ property: 'og:locale', content: s.locale.og },
		{ name: 'twitter:card', content: s.share.cards ? 'summary_large_image' : 'summary' },
	];
	if (s.share.cards) {
		const headline = s.home ? s.home.headline : [s.title];
		const alt = 'cjk' in s.locale ? `${s.name}：${headline.join('')}` : `${s.name}: ${headline.join(' ')}`;
		const image = absolute(url(`share/${lang}.png`));
		meta.push(
			{ property: 'og:image', content: image },
			{ property: 'og:image:type', content: 'image/png' },
			{ property: 'og:image:width', content: '1200' },
			{ property: 'og:image:height', content: '630' },
			{ property: 'og:image:alt', content: alt },
			{ name: 'twitter:image', content: image },
			{ name: 'twitter:image:alt', content: alt },
		);
	}
	const links = [
		{ rel: 'canonical', href: here },
		...(langs.length > 1 ? langs.map((l) => ({ rel: 'alternate', hrefLang: site[l].locale.tag, href: absolute(url(pagePath(page.path, l, first))) })) : []),
	];
	return { meta, links };
}
