// A section's eyebrow, title and words. A Chinese or Japanese title breaks
// only after its full-width commas, so each phrase wraps as a whole.
import { For, Show } from 'solid-js';
import { eyebrow, sectionTitle } from '../ui';

export function SectionHead(props: { eyebrow?: string; title: string; text?: string; left?: boolean; /** Its space below, mb-12 unless set. */ space?: string }) {
	return (
		<header class={['section-head', props.left ? 'left max-w-[32rem] m-0 text-left' : `max-w-[40rem] mx-auto text-center ${props.space ?? 'mb-12'}`]}>
			<Show when={props.eyebrow}>
				<p class={eyebrow}>{props.eyebrow}</p>
			</Show>
			<h2 class={sectionTitle}>
				<For each={props.title.split(/(?<=[，、])/)}>{(p) => <span class="phrase inline-block">{p}</span>}</For>
			</h2>
			<Show when={props.text}>
				<p class="mt-4 text-muted text-17 text-pretty">{props.text}</p>
			</Show>
		</header>
	);
}
