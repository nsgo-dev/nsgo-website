// The router of every page: under the site's base, each address ending in a
// slash as GitHub Pages serves it, and a page's code and data loaded while
// the pointer rests on a link to it.
import { createRouter, type AnyRoute, type AnyRouter } from '@tanstack/solid-router';

export function makeRouter(routeTree: AnyRoute): AnyRouter {
	return createRouter<AnyRoute, 'always'>({
		routeTree,
		basepath: import.meta.env.BASE_URL,
		trailingSlash: 'always',
		defaultPreload: 'intent',
		scrollRestoration: true,
	});
}
