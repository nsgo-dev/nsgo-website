// A docs page's table of contents on narrower screens: a menu in the bar
// above the content, naming the section the reader is in.
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@ui-sdk/solid/menu';
import { For } from 'solid-js';
import type { Heading } from '../../build/markdown';
import { Icon } from '../Icon';
import { caret, popupItem, popupList } from '../ui';

export function TocMenu(props: { title: string; overview: string; headings: Heading[]; current: string }) {
	const items = () => [{ depth: 2, id: '_top', text: props.overview }, ...props.headings];
	const currentText = () => items().find((h) => h.id === props.current)?.text ?? props.overview;
	return (
		<Menu>
			<MenuTrigger class="bar-trigger toc-trigger flex items-center gap-1 min-w-0 ms-auto py-1.5 pl-3 pr-2 rounded-10 bg-surface text-ink text-13 font-500 hover:bg-surface-2 data-open:bg-surface-2">
				<span class="bar-label">{props.title}</span>
				<span class="bar-current hidden docs:block overflow-hidden text-muted text-ellipsis whitespace-nowrap">{currentText()}</span>
				<Icon name="down-caret" size="1rem" class={`${caret} flex-none text-muted`} />
			</MenuTrigger>
			<MenuContent class={`${popupList} bar-list max-w-[min(18rem,calc(100vw-2.5rem))] max-h-[min(65vh,var(--available-height,28rem))]`} align="end" sideOffset={8} aria-label={props.title}>
				<For each={items()}>
					{(h) => (
						<MenuItem
							style={{ '--depth': h.depth - 2 }}
							render={(p) => (
								<a {...p} class={`${popupItem} py-[0.4375rem] pl-[calc(0.625rem+var(--depth,0)*0.75rem)] pr-2.5 text-muted leading-[1.35] data-highlighted:text-ink [&[aria-current]]:text-accent [&[aria-current]]:font-550`} href={`#${h.id}`} aria-current={props.current === h.id ? 'true' : undefined}>
									{h.text}
								</a>
							)}
						/>
					)}
				</For>
			</MenuContent>
		</Menu>
	);
}
