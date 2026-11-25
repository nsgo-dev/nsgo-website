// Cards in one strip, each icon beside its title, four to a row on wide
// screens unless columns says otherwise; as the platforms a project runs on.
import { For, Show } from 'solid-js';
import type { ResolvedItem } from '../../resolve';
import { KIcon } from '../KIcon';
import { SectionHead } from './SectionHead';
import { container, itemText, itemTitle, section } from '../ui';

const colors = ['#3b82f6', '#0ea5e9', '#d97706', '#8b5cf6'];

export function Cards(props: { id?: string; eyebrow?: string; title: string; text?: string; items: ResolvedItem[]; columns?: number }) {
	return (
		<section class={section} id={props.id}>
			<div class={container}>
				<SectionHead eyebrow={props.eyebrow} title={props.title} text={props.text} />
				<ul
					class="platforms grid gap-px overflow-hidden border border-line rounded-site-lg bg-line xs:grid-cols-2 lg:grid-cols-[repeat(var(--columns,4),minmax(0,1fr))]"
					 style={props.columns ? { '--columns': props.columns } : undefined}>
					<For each={props.items}>
						{(p, i) => (
							<li class="platform grid content-start gap-3 py-7 px-6 bg-page transition-colors duration-200 hover:bg-surface" data-kubai-trigger>
								<Show when={p.icon}>
									{(icon) => (
										<span class="platform-icon grid place-items-center size-9">
											<KIcon name={icon()} size={30} color={p.color ?? colors[i() % colors.length]} />
										</span>
									)}
								</Show>
								<div>
									<h3 class={itemTitle}>{p.title}</h3>
									<p class={itemText}>{p.text}</p>
								</div>
							</li>
						)}
					</For>
				</ul>
			</div>
		</section>
	);
}
