// A numbered list of effects, as a demo's parts: the section's head over
// the Effect components inside, three to a row on wide screens unless
// columns says otherwise.
import { Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { SectionHead } from '../home/SectionHead';
import { container, section } from '../ui';

export function Effects(props: { id?: string; eyebrow?: string; title?: string; text?: string; columns?: number; children: JSX.Element }) {
	return (
		<section class={section} id={props.id}>
			<div class={container}>
				<Show when={props.title}>{(title) => <SectionHead eyebrow={props.eyebrow} title={title()} text={props.text} />}</Show>
				<ol
					class="effects grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-10 [counter-reset:effect] xs:grid-cols-2 lg:grid-cols-[repeat(var(--columns,3),minmax(0,1fr))] [&>li]:grid [&>li]:[counter-increment:effect]"
					 style={props.columns ? { '--columns': props.columns } : undefined}>
					{props.children}
				</ol>
			</div>
		</section>
	);
}
