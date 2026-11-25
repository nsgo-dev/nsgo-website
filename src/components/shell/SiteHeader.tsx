// The header every page shares, home and docs alike: the brand, the
// navigation, and the search, language, theme, accounts and GitHub at the
// end, which phones trade for the menu. Its menus hydrate on their own once
// the page is idle, so their code stays out of the page's first load; the
// shell builds the header again for another language.
import { Hydrate } from '@tanstack/solid-start';
import { idle } from '@tanstack/solid-start/hydration';
import { For, Show, useContext } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import { stars } from 'virtual:nsgo-website/stars';
import { Page } from '../../app/context';
import { locales } from '../../locales';
import { langs, site } from '../../site';
import { Icon } from '../Icon';
import { KIcon } from '../KIcon';
import { LanguageMenu, ThemeMenu } from './PreferenceMenus';
import { MenuPane } from './MenuPane';
import { NavMenu } from './NavMenu';
import { Search } from './Search';
import { container, iconButton, iconFilled } from '../ui';

const navLink =
	'inline-flex items-center px-2.5 py-[0.3125rem] rounded-10 text-muted text-sm transition-colors duration-150 hover:bg-surface hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:text-ink';

export function SiteHeader() {
	const page = useContext(Page);
	const s = () => site[page.lang()];
	const t = () => s().t;
	// A link marks the page at or under its path; the home page's parts and the
	// home page itself, under which every page is, mark none.
	const current = (href: string) => !href.includes('#') && href !== s().paths.home && page.pathname().startsWith(href);
	// The repository's stars in the page's language's short form, such as 1.2K.
	const starLabel = () => (stars === null ? undefined : new Intl.NumberFormat(locales[page.lang()].tag, { notation: 'compact' }).format(stars));

	return (
		<header class="site-header sticky top-0 z-50 h-(--header-height) border-b border-transparent bg-page transition-[border-color,background-color] duration-200 data-scrolled:border-line data-scrolled:bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] data-scrolled:backdrop-blur-[16px] data-scrolled:backdrop-saturate-[180%]">
			<div class={`header-row ${container} flex items-center gap-6 h-full`}>
				<a class="brand flex flex-none items-center gap-2 text-ink text-base font-650 tracking-[-0.01em]" href={s().paths.home}>
					<img class={['logo size-7', { 'theme-light': !!s().logoDark }]} src={images[s().logo]} alt="" width="28" height="28" />
					<Show when={s().logoDark}>{(dark) => <img class="logo theme-dark size-7" src={images[dark()]} alt="" width="28" height="28" />}</Show>
					<span>{s().name}</span>
				</a>
				<nav class="nav hidden docs:flex items-center gap-1" aria-label={t().nav.label}>
					<For each={s().nav}>
						{(item) => (
							<>
								{item.links ? (
									<Hydrate when={idle()}>
										<NavMenu label={item.label} links={item.links} />
									</Hydrate>
									) : s().sponsors && item.href === s().paths.sponsors ? (
									<a class={`nav-sponsors ${navLink} gap-1.5`} href={item.href} aria-current={current(item.href) ? 'page' : undefined} data-kubai-trigger>
										<KIcon name="heart" size={15} color="#ec4899" />
										{item.label}
									</a>
								) : item.external ? (
									<a class={`${navLink} gap-1`} href={item.href} target="_blank" rel="noopener noreferrer">
										{item.label}
										<Icon name="external" size="0.75rem" class="external text-faint" />
									</a>
								) : (
									<a class={`${navLink} gap-1`} href={item.href} aria-current={current(item.href) ? 'page' : undefined}>
										{item.label}
									</a>
								)}
							</>
						)}
					</For>
				</nav>
				<div class="actions flex items-center gap-1 ml-auto">
					<Show when={s().sponsors}>
						<a class={`sponsor-button ${iconButton} ${iconFilled} px-3 aria-[current=page]:bg-surface-2 docs:hidden`} href={s().paths.sponsors} aria-current={current(s().paths.sponsors) ? 'page' : undefined} data-kubai-trigger>
							<KIcon name="heart" size={15} color="#ec4899" />
							{t().nav.sponsors}
						</a>
					</Show>
					<Hydrate when={idle()}>
						<Search />
					</Hydrate>
					<Show when={langs.length > 1}>
						<Hydrate when={idle()}>
							<LanguageMenu />
						</Hydrate>
					</Show>
					<Hydrate when={idle()}>
						<ThemeMenu />
					</Hydrate>
					<Show when={s().accounts.length > 0}>
						<Hydrate when={idle()}>
							<NavMenu label="X" links={s().accounts} icon="x.com" class="max-sm:hidden!" />
						</Hydrate>
					</Show>
					<a class={`github ${iconButton} ${iconFilled} ml-1 px-3 max-sm:hidden!`} href={s().repo} target="_blank" rel="noopener noreferrer" aria-label={t().nav.github}>
						<Icon name="github" size="1.05rem" />
						<span class={['inline-flex', { 'stars tabular-nums': !!starLabel() }]}>{starLabel() ?? 'GitHub'}</span>
					</a>
					<Hydrate when={idle()}>
						<MenuPane />
					</Hydrate>
				</div>
			</div>
		</header>
	);
}
