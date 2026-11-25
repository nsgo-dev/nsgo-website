// The docs' pages as a tree: groups that fold, and the page being read
// marked by a gray ground.
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '@ui-sdk/solid/collapsible';
import { For } from 'solid-js';
import type { SidebarEntry } from '../../docs';
import { Icon } from '../Icon';
import { caret } from '../ui';

const holds = (entry: SidebarEntry, here: string): boolean => (entry.type === 'link' ? entry.href === here : entry.entries.some((e) => holds(e, here)));

function Entries(props: { entries: SidebarEntry[]; here: string; top?: boolean }) {
	return (
		<ul class={['sidebar-list grid text-sm', props.top ? 'top' : 'gap-0.5']}>
			<For each={props.entries}>
				{(entry) => (
					<li>
						{entry.type === 'link' ? (
							<a
								class="block px-2.5 py-[0.3125rem] rounded-8 text-muted leading-[1.45] transition-colors duration-150 hover:bg-surface hover:text-ink aria-[current=page]:bg-surface-2 aria-[current=page]:text-ink"
								href={entry.href}
								aria-current={entry.href === props.here ? 'page' : undefined} {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
								{entry.label}
							</a>
						) : (
							<Collapsible class="sidebar-group [.top>li+li>&]:mt-5" defaultOpen={!entry.collapsed || holds(entry, props.here)}>
								<CollapsibleTrigger class="sidebar-group-label flex items-center justify-between w-full px-2.5 py-1 rounded-8 text-ink text-13 font-650 text-start">
									<span>{entry.label}</span>
									<Icon name="down-caret" size="0.875rem" class={`${caret} text-faint in-data-closed:-rotate-90`} />
								</CollapsibleTrigger>
								<CollapsiblePanel class="sidebar-panel h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-site data-starting-style:h-0 data-ending-style:h-0 [&>ul]:pt-0.5">
									<Entries entries={entry.entries} here={props.here} />
								</CollapsiblePanel>
							</Collapsible>
						)}
					</li>
				)}
			</For>
		</ul>
	);
}

export function Sidebar(props: { entries: SidebarEntry[]; here: string }) {
	return <Entries entries={props.entries} here={props.here} top />;
}
