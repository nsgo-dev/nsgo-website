// Content that drifts at its own speed as the page scrolls, for depth:
// speed is the share of the scroll it moves by, below 0 against it. It
// holds still for readers who ask for less motion.
import { onSettled } from 'solid-js';
import type { JSX } from '@solidjs/web';

export function Parallax(props: { speed?: number; class?: string; children: JSX.Element }) {
	let inner: HTMLDivElement | undefined;
	onSettled(() => {
		let stop: (() => void) | undefined;
		void import('../../scripts/demos').then((m) => inner && (stop = m.startParallax(inner)));
		return () => stop?.();
	});
	return (
		<div class={['parallax', props.class]}>
			<div data-parallax={props.speed ?? 0.15} ref={(el) => (inner = el)}>
				{props.children}
			</div>
		</div>
	);
}
