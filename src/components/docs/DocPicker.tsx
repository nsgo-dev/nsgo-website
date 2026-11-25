// On phones, where the docs' sidebar has no room, the current page's title
// at the left of the bar above the content, opening a menu of the docs'
// pages to move to another.
import { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuTrigger } from '@ui-sdk/solid/menu';
import { For } from 'solid-js';
import type { SidebarEntry } from '../../docs';
import { Icon } from '../Icon';
import { caret, popupItem, popupList } from '../ui';

function Items(props: { entries: SidebarEntry[]; here: string; depth: number }) {
	return (
		<For each={props.entries}>
			{(entry) =>
				entry.type === 'link' ? (
					<MenuItem
						style={{ '--depth': props.depth }}
						render={(p) => (
							<a {...p} class={`${popupItem} py-[0.4375rem] pl-[calc(0.625rem+var(--depth,0)*0.75rem)] pr-2.5 text-muted leading-[1.35] data-highlighted:text-ink [&[aria-current]]:text-accent [&[aria-current]]:font-550`} href={entry.href} aria-current={entry.href === props.here ? 'page' : undefined}>
								{entry.label}
							</a>
						)}
					/>
				) : (
					<MenuGroup class="grid">
						<MenuGroupLabel class="doc-group mt-2 mb-0.5 px-2.5 text-faint text-xs font-650 [[role=group]:first-child>&]:mt-1">{entry.label}</MenuGroupLabel>
						<Items entries={entry.entries} here={props.here} depth={props.depth + 1} />
					</MenuGroup>
				)
			}
		</For>
	);
}

export function DocPicker(props: { title: string; label: string; entries: SidebarEntry[]; here: string }) {
	return (
		<Menu>
			<MenuTrigger
				class="bar-trigger doc-trigger flex items-center gap-1 min-w-0 py-1.5 pr-2 rounded-10 text-ink text-sm font-600 docs:hidden in-[.docs-bar:not(:has(.toc-trigger))]:me-auto"
				 aria-label={props.label}>
				<span class="doc-title overflow-hidden text-ellipsis whitespace-nowrap">{props.title}</span>
				<Icon name="down-caret" size="1rem" class={`${caret} flex-none text-muted`} />
			</MenuTrigger>
			<MenuContent class={`${popupList} bar-list max-w-[min(18rem,calc(100vw-2.5rem))] max-h-[min(65vh,var(--available-height,28rem))]`} align="start" sideOffset={8} aria-label={props.label}>
				<Items entries={props.entries} here={props.here} depth={0} />
			</MenuContent>
		</Menu>
	);
}
