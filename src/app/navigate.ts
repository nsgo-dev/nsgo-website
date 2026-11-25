// Moving to a page of the site without reloading it: every link within the
// site goes through the router, whether a component or a docs page's
// Markdown made it.
import type { AnyRouter } from '@tanstack/solid-router';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** The path a link within the site names, without the base; none for links that leave it or load a file. */
export function routeOf(href: string): string | undefined {
	const target = new URL(href, location.href);
	if (target.origin !== location.origin || !target.pathname.startsWith(`${base}/`)) return;
	if (/\.[a-z0-9]+$/i.test(target.pathname)) return;
	return target.pathname.slice(base.length) + target.search + target.hash;
}

export function go(router: AnyRouter, href: string) {
	const to = routeOf(href);
	if (to === undefined) location.href = href;
	else void router.navigate({ to: to as never });
}

/** Sends clicks on the site's own links to the router, and preloads their pages while the pointer rests on them. */
export function interceptLinks(router: AnyRouter): () => void {
	const linkOf = (event: Event) => {
		const a = (event.target as Element | null)?.closest?.('a');
		if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return;
		return a;
	};
	const click = (event: MouseEvent) => {
		if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		const a = linkOf(event);
		if (!a) return;
		const to = routeOf(a.href);
		if (to === undefined) return;
		const target = new URL(a.href);
		// A part of the same page is the browser's to scroll to.
		if (target.pathname === location.pathname && target.search === location.search && target.hash) return;
		event.preventDefault();
		void router.navigate({ to: to as never });
	};
	const hover = (event: Event) => {
		const a = linkOf(event);
		const to = a && routeOf(a.href);
		if (to) void router.preloadRoute({ to: to.replace(/[#?].*$/, '') as never }).catch(() => {});
	};
	document.addEventListener('click', click);
	document.addEventListener('pointerover', hover, { passive: true });
	document.addEventListener('focusin', hover);
	return () => {
		document.removeEventListener('click', click);
		document.removeEventListener('pointerover', hover);
		document.removeEventListener('focusin', hover);
	};
}
