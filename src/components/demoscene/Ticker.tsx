// A band of words running across the page, as a demo's scroller. It runs
// twice over, so it loops without a seam, and holds still for readers who
// ask for less motion.
import { For } from 'solid-js';

export function Ticker(props: { items: string[] }) {
	return (
		<div class="ticker group/ticker overflow-hidden text-accent font-mono text-13 tracking-[0.08em] uppercase whitespace-nowrap">
			<div class="ticker-track flex w-max animate-[ticker_40s_linear_infinite] group-hover/ticker:[animation-play-state:paused] motion-reduce:animate-none">
				<For each={[0, 1]}>
					{(copy) => (
						<ul class="flex py-3" aria-hidden={copy === 1 ? 'true' : undefined}>
							<For each={props.items}>{(item) => <li class="after:mx-6 after:text-faint after:content-['//']">{item}</li>}</For>
						</ul>
					)}
				</For>
			</div>
		</div>
	);
}
