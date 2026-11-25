// A soft icon button in the header that opens a small menu of choices, as
// for the theme and the language, the chosen one checked.
import { Menu, MenuContent, MenuItemIndicator, MenuRadioGroup, MenuRadioItem, MenuTrigger } from '@ui-sdk/solid/menu';
import { For } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Icon } from '../Icon';
import { ChoiceIcon } from './ChoiceIcon';
import type { Choice } from './choices';
import { menuTrigger, popupHeight, popupItem, popupList } from '../ui';

export function HeaderMenu(props: { label: string; items: Choice[]; value: string; onChange: (value: string) => void; icon: JSX.Element; class?: string }) {
	return (
		<Menu>
			<MenuTrigger class={[menuTrigger, props.class]} aria-label={props.label} title={props.label} data-kubai-trigger>
				{props.icon}
			</MenuTrigger>
			<MenuContent class={`${popupList} ${popupHeight} choice-list min-w-36`} align="end" sideOffset={6} aria-label={props.label}>
				<MenuRadioGroup value={props.value} onValueChange={(value) => props.onChange(value)}>
					<For each={props.items}>
						{(item) => (
							<MenuRadioItem class={`${popupItem} gap-2 px-2 py-[0.3125rem] text-ink leading-5 whitespace-nowrap`} value={item.value} closeOnSelect data-kubai-trigger>
								<ChoiceIcon choice={item} />
								<span class="flex-1">{item.label}</span>
								<MenuItemIndicator class="check grid text-ink">
									<Icon name="approve-check" size="0.95rem" />
								</MenuItemIndicator>
							</MenuRadioItem>
						)}
					</For>
				</MenuRadioGroup>
			</MenuContent>
		</Menu>
	);
}
