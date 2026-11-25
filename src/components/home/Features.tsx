// Highlights in a grid, each icon above its title, three to a row on wide
// screens unless columns says otherwise.
import { For, Show } from 'solid-js';
import type { ResolvedItem } from '../../resolve';
import { KIcon } from '../KIcon';
import { SectionHead } from './SectionHead';
import { container, itemText, section } from '../ui';

// Each highlight's icon in a color of its own.
const colors = ['#3b82f6', '#8b5cf6', '#22a45d', '#f59e0b', '#0ea5e9', '#ec4899'];

export function Features(props: { id?: string; eyebrow?: string; title: string; text?: string; items: ResolvedItem[]; columns?: number }) {
	return (
		<section class={section} id={props.id}>
			<div class={container}>
				<SectionHead eyebrow={props.eyebrow} title={props.title} text={props.text} />
				<ul
					class="features grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden border border-line rounded-site-lg bg-line xs:grid-cols-2 lg:grid-cols-[repeat(var(--columns,3),minmax(0,1fr))]"
					 style={props.columns ? { '--columns': props.columns } : undefined}>
					<For each={props.items}>
						{(f, i) => (
							<li class="feature py-7 px-6 bg-page transition-colors duration-200 hover:bg-surface max-xs:grid max-xs:grid-cols-[auto_minmax(0,1fr)] max-xs:gap-x-4 max-xs:p-5" data-kubai-trigger>
								<Show when={f.icon}>
									{(icon) => (
										<span class="feature-icon inline-grid place-items-center size-9 mb-4 text-accent max-xs:row-span-2 max-xs:mb-0">
											<KIcon name={icon()} size={28} color={f.color ?? colors[i() % colors.length]} />
										</span>
									)}
								</Show>
								<h3 class="mb-1.5 text-base font-650 tracking-[-0.01em]">{f.title}</h3>
								<p class={itemText}>{f.text}</p>
							</li>
						)}
					</For>
				</ul>
			</div>
		</section>
	);
}
