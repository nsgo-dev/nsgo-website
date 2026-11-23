// The card a page shows when shared on X, Telegram and the like: Starlight
// gives each page its title, description and URL, and this adds the image
// the share-cards command draws for the page's language, names the site in
// docs titles and marks the home pages as the site itself.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { langOf, site, url } from './site';

type Head = App.Locals['starlightRoute']['head'];

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const lang = langOf(route.lang);
	const s = site[lang];
	const home = route.entry.data.title === s.title;

	const set = (key: 'property' | 'name', name: string, content: string) => {
		const meta = route.head.find((h) => h.tag === 'meta' && h.attrs?.[key] === name);
		if (meta) meta.attrs = { ...meta.attrs, content };
		else route.head.push({ tag: 'meta', attrs: { [key]: name, content } } as Head[number]);
	};
	if (!home) set('property', 'og:title', `${route.entry.data.title} | ${s.name}`);
	set('property', 'og:type', home ? 'website' : 'article');
	set('property', 'og:locale', s.locale.og);
	if (!s.share.cards) return;
	const headline = s.home ? s.home.headline : [s.title];
	const alt = 'cjk' in s.locale ? `${s.name}：${headline.join('')}` : `${s.name}: ${headline.join(' ')}`;
	const image = new URL(url(`share/${lang}.png`), context.site).href;
	set('property', 'og:image', image);
	set('property', 'og:image:type', 'image/png');
	set('property', 'og:image:width', '1200');
	set('property', 'og:image:height', '630');
	set('property', 'og:image:alt', alt);
	set('name', 'twitter:card', 'summary_large_image');
	set('name', 'twitter:image', image);
	set('name', 'twitter:image:alt', alt);
});
