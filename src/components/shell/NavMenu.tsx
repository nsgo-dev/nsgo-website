// A link of the header's navigation that opens a menu of further links, as
// for the community's places, or an icon button of the header's actions that
// does the same, as for the X accounts.
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@ui-sdk/solid/menu';
import { For, Show } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import type { IconName } from '../../icons';
import type { ResolvedLink } from '../../resolve';
import { Icon } from '../Icon';
import { caret, menuTrigger, popupHeight, popupItem, popupList } from '../ui';

export function NavMenu(props: { label: string; links: ResolvedLink[]; icon?: IconName; class?: string }) {
	return (
		<Menu>
			<MenuTrigger
				class={[
					props.icon
						? menuTrigger
						: 'nav-trigger inline-flex items-center gap-0.5 py-[0.3125rem] pl-2.5 pr-1.5 rounded-10 text-muted text-sm transition-colors duration-150 hover:bg-surface hover:text-ink data-open:bg-surface data-open:text-ink',
					props.class,
				]}
				 aria-label={props.icon ? props.label : undefined} title={props.icon ? props.label : undefined}>
				{props.icon ? (
					<Icon name={props.icon} size="1rem" />
				) : (
					<>
						{props.label}
						<Icon name="down-caret" size="1rem" class={caret} />
					</>
				)}
			</MenuTrigger>
			<MenuContent class={[popupList, popupHeight, 'link-list', props.icon ? 'min-w-52' : 'min-w-68']} align={props.icon ? 'end' : 'start'} sideOffset={6} aria-label={props.label}>
				<For each={props.links}>
					{(link) => (
						<MenuItem
							render={(p) => (
								<a {...p} class={`${popupItem} gap-2.5 px-2 py-[0.4375rem] text-ink leading-[1.3]`} href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
									<Show when={link.avatar || link.icon}>
										<span class={['nav-icon grid flex-none place-items-center size-7 bg-surface text-ink', link.avatar ? 'avatar overflow-hidden rounded-full' : 'rounded-8']}>
											{link.avatar ? <img class="size-full object-cover" src={images[link.avatar]} alt="" width="28" height="28" /> : <Icon name={link.icon!} size="1.05rem" />}
										</span>
									</Show>
									<span class="nav-text grid flex-1 gap-px">
										<span>{link.label}</span>
										<Show when={link.note}>
											<span class="nav-note text-muted text-xs">{link.note}</span>
										</Show>
									</span>
									<Show when={link.external}>
										<Icon name="external" size="0.8rem" class="external text-faint" />
									</Show>
								</a>
							)}
						/>
					)}
				</For>
			</MenuContent>
		</Menu>
	);
}
