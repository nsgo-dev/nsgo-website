// Every page's document and frame: the head with the reader's theme set
// before the page shows, the shared header and footer around the page, and
// the links within the site sent through the router.
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter, useRouterState } from '@tanstack/solid-router';
import { createMemo, onSettled, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import 'virtual:nsgo-website/styles';
import { SiteFooter } from '../components/shell/SiteFooter';
import { SiteHeader } from '../components/shell/SiteHeader';
import { locales } from '../locales';
import { first, langOfPath, langs, options, pathIn, site, url } from '../site';
import { bootScript } from './boot';
import { Page, type PageContext } from './context';
import { interceptLinks } from './navigate';
import { NotFound } from './pages/not-found';
import { createLanguage, createTheme } from './prefs';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** The path with the base, whichever way the router gives it. */
const full = (pathname: string) => (base && !pathname.startsWith(`${base}/`) && pathname !== base ? `${base}${pathname}` : pathname);

function usePage(): PageContext {
	const router = useRouter();
	const pathname = useRouterState({ select: (s) => full(s.location.pathname) });
	const notFound = useRouterState({ select: (s) => s.matches.some((m) => m.status === 'notFound' || m.routeId === '/404/') });
	const lang = createMemo(() => langOfPath(pathname()));
	const theme = createTheme();
	const language = createLanguage();
	return {
		lang,
		pathname,
		notFound,
		theme,
		language: {
			...language,
			// Moving to the chosen language's page, or, while automatic, the browser's.
			choose(value: string) {
				language.set(value);
				const want = value === 'auto' ? pickFromBrowser() : value;
				if (want === lang()) return;
				const to = notFound() ? site[want as keyof typeof site].paths.home : pathIn(pathname(), want as never);
				void router.navigate({ to: to.slice(base.length) as never });
			},
		},
	};
}

function pickFromBrowser(): string {
	const preferred = navigator.languages || [navigator.language];
	for (const raw of preferred) {
		const tag = raw.toLowerCase();
		const hit = langs.find((l) => locales[l].tag.toLowerCase() === tag) ?? langs.find((l) => locales[l].tag.toLowerCase().split('-')[0] === tag.split('-')[0]);
		if (hit) return hit;
	}
	return first;
}

function Document(props: { children: JSX.Element }) {
	const pathname = useRouterState({ select: (s) => full(s.location.pathname) });
	const notFound = useRouterState({ select: (s) => s.matches.some((m) => m.routeId === '/404/') });
	return (
		<html lang={locales[langOfPath(pathname())].tag} data-theme="dark" data-not-found={notFound() ? '' : undefined}>
			<head>
				<meta charset="utf-8" />
				<HeadContent />
			</head>
			<body>
				{props.children}
				<Scripts />
			</body>
		</html>
	);
}

function Shell() {
	const page = usePage();
	const router = useRouter();
	const t = () => site[page.lang()].t;
	onSettled(() => {
		const stopTheme = page.theme.mount();
		page.language.mount();
		const stopLinks = interceptLinks(router);
		// The icons' motion, once the page is idle and after each move.
		const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
		const wake = () => idle(() => void import('../scripts/kubai').then((m) => m.wake()));
		wake();
		const stopWake = router.subscribe('onResolved', wake);
		// Once the page scrolls under the header, a line and a frosted ground.
		const header = document.querySelector('.site-header');
		const scrolled = () => header?.toggleAttribute('data-scrolled', scrollY > 0);
		scrolled();
		addEventListener('scroll', scrolled, { passive: true });
		return () => {
			stopTheme();
			stopLinks();
			stopWake();
			removeEventListener('scroll', scrolled);
		};
	});
	return (
		<Page value={page}>
			<a class="skip-link fixed top-2 left-2 z-100 px-3.5 py-2 rounded-site-sm bg-accent text-on-accent text-sm font-600 -translate-y-[200%] focus:translate-y-0" href="#main">
				{t().docs.skip}
			</a>
			<div class="shell flex flex-col min-h-screen [&>main]:flex-1 [&>.docs-frame]:flex-1">
				<Show when={page.lang()} keyed>
					{(_lang) => <SiteHeader />}
				</Show>
				<Outlet />
				<SiteFooter lang={page.lang()} />
			</div>
		</Page>
	);
}

export const Route = createRootRoute({
	head: () => ({
		meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, { name: 'color-scheme', content: 'dark light' }],
		links: [
			{ rel: 'icon', href: url(options.favicon ?? '/favicon.svg') },
			...(options.appleTouchIcon ? [{ rel: 'apple-touch-icon', href: url(options.appleTouchIcon) }] : []),
		],
		scripts: [{ children: bootScript() }],
	}),
	shellComponent: Document,
	component: Shell,
	notFoundComponent: () => <NotFound />,
	errorComponent: (props) => {
		console.error(props.error);
		return (
			<main id="main" class="not-found grid place-content-center min-h-[60vh] p-5 text-center">
				<h1 id="_top" class="text-22 font-700">{String((props.error as Error)?.message ?? props.error)}</h1>
			</main>
		);
	},
});
