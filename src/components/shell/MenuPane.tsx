// The menu of narrow screens: a drawer with the site's links and the
// language and theme choices the header has no room for.
import { Drawer, DrawerBackdrop, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@ui-sdk/solid/drawer';
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from '@ui-sdk/solid/segmented-control';
import { useRouterState } from '@tanstack/solid-router';
import { createEffect, createSignal, For, Show, useContext } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import { Page } from '../../app/context';
import type { ResolvedLink } from '../../resolve';
import { langs, site } from '../../site';
import { Icon } from '../Icon';
import { ChoiceIcon } from './ChoiceIcon';
import { languageChoices, themeChoices, type Choice } from './choices';
import { iconButton, iconFilled, iconSoft } from '../ui';

const menuLink = 'flex items-center gap-1.5 px-2.5 py-2 rounded-8 text-ink text-15 font-500 hover:bg-surface';

function Choices(props: { label: string; items: Choice[]; value: string; onChange: (value: string) => void }) {
	return (
		<div class="choice-group grid gap-2">
			<p class="choice-label px-2.5 text-faint text-xs font-650">{props.label}</p>
			<SegmentedControl
				class="choice-items relative grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-1 p-1 rounded-12 bg-surface"
				 aria-label={props.label} value={props.value} onValueChange={(v) => props.onChange(v as string)}>
				<SegmentedControlIndicator class="choice-indicator absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) w-(--segmented-control-indicator-width) h-(--segmented-control-indicator-height) rounded-8 bg-page shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--border)] transition-[left,top,width] duration-250 ease-site motion-reduce:transition-none" />
				<For each={props.items}>
					{(item) => (
						<SegmentedControlItem
							class="relative inline-flex items-center justify-center gap-1.5 min-w-0 h-9 px-2 rounded-8 text-muted text-sm font-500 whitespace-nowrap transition-colors duration-150 hover:text-ink data-checked:text-ink"
							value={item.value}
							data-kubai-trigger
						>
							<ChoiceIcon choice={item} />
							<span class="overflow-hidden text-ellipsis">{item.label}</span>
						</SegmentedControlItem>
					)}
				</For>
			</SegmentedControl>
		</div>
	);
}

export function MenuPane() {
	const page = useContext(Page);
	const s = () => site[page.lang()];
	const t = () => s().t;
	const [open, setOpen] = createSignal(false);
	// Moving to another page closes the menu.
	const location = useRouterState({ select: (state) => state.location.href });
	createEffect(location, () => {
		setOpen(false);
	}, { defer: true });
	// The header's own links, then GitHub, then each of its menus as a group.
	const links = (): ResolvedLink[] => [...s().nav.flatMap((n) => (n.links ? [] : [n])), { label: 'GitHub', href: s().repo, external: true }];
	const groups = () => [...(s().accounts.length ? [{ label: 'X', links: s().accounts }] : []), ...s().nav.flatMap((n) => (n.links ? [n] : []))];
	const ext = (link: ResolvedLink) => (link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {});

	return (
		<Drawer side="end" open={open()} onOpenChange={(next) => setOpen(next)}>
			<DrawerTrigger class={`menu-button ${iconButton} ${iconFilled} px-2 docs:hidden`} aria-label={t().nav.menu}>
				<Icon name="bars" size="1.15rem" />
			</DrawerTrigger>
			<DrawerBackdrop class="menu-backdrop fixed inset-0 z-70 bg-[rgb(0_0_0/0.4)]" />
			<DrawerContent class="menu-pane z-71 flex flex-col w-[min(22rem,88vw)] h-full ms-auto border-s border-line bg-page text-ink shadow-[0_0_48px_-12px_rgb(0_0_0/0.4)] outline-none">
				<div class="menu-head flex flex-none items-center justify-between h-(--header-height) pl-5 pr-3 border-b border-line">
					<DrawerTitle class="menu-title text-15 font-650">{t().nav.menu}</DrawerTitle>
					<DrawerClose class={`menu-close ${iconButton} ${iconSoft} px-2`} aria-label={t().search.close}>
						<Icon name="close" size="1.15rem" />
					</DrawerClose>
				</div>
				<div class="menu-content flex flex-col gap-4 p-4 pb-8 overflow-y-auto overscroll-contain">
					<nav class="menu-links grid gap-0.5 pb-4 border-b border-line" aria-label={t().nav.label}>
						<For each={links()}>
							{(link) => (
								<a class={menuLink} href={link.href} {...ext(link)}>
									{link.label}
									<Show when={link.external}>
										<Icon name="external" size="0.8rem" class="external text-faint" />
									</Show>
								</a>
							)}
						</For>
						<For each={groups()}>
							{(group) => (
								<>
									<p class="menu-group mt-3 mb-1 px-2.5 text-faint text-xs font-650">{group.label}</p>
									<For each={group.links}>
										{(link) => (
											<a class={menuLink} href={link.href} {...ext(link)}>
												<Show when={link.avatar}>{(avatar) => <img class="menu-avatar size-5 mr-0.5 rounded-full object-cover" src={images[avatar()]} alt="" width="20" height="20" />}</Show>
												{link.label}
												<Show when={link.note && group.label === 'X'}>
													<span class="menu-note text-muted text-13">{link.note}</span>
												</Show>
												<Show when={link.external}>
													<Icon name="external" size="0.8rem" class="external text-faint" />
												</Show>
											</a>
										)}
									</For>
								</>
							)}
						</For>
					</nav>
					<div class="menu-choices grid gap-4 sm:hidden">
						<Show when={langs.length > 1}>
							<Choices label={t().language.name} items={languageChoices(page.lang())} value={page.language.choice()} onChange={(v) => page.language.choose(v)} />
						</Show>
						<Choices label={t().theme.name} items={themeChoices(page.lang())} value={page.theme.choice()} onChange={(v) => page.theme.set(v as never)} />
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
