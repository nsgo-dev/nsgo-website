// A docs page's table of contents beside the content on wide screens: a
// rail of its headings, marked where the reader is.
import { createSignal, For, onSettled } from 'solid-js';
import type { Heading } from '../../build/markdown';

export function useCurrentHeading(headings: () => Heading[]) {
	const [current, setCurrent] = createSignal('_top', { ownedWrite: true });
	onSettled(() => {
		// The heading last scrolled past the top of the content is the reader's.
		const update = () => {
			const offset = 120;
			let at = '_top';
			for (const h of headings()) {
				const el = document.getElementById(h.id);
				if (el && el.getBoundingClientRect().top <= offset) at = h.id;
			}
			setCurrent(at);
		};
		update();
		addEventListener('scroll', update, { passive: true });
		return () => removeEventListener('scroll', update);
	});
	return current;
}

export function Toc(props: { title: string; overview: string; headings: Heading[]; current: string }) {
	const items = () => [{ depth: 2, id: '_top', text: props.overview }, ...props.headings];
	return (
		<nav class="toc-rail" aria-labelledby="toc-title">
			<h2 id="toc-title" class="mb-2 text-ink text-13 font-650">{props.title}</h2>
			<ul class="border-s border-line">
				<For each={items()}>
					{(h) => (
						<li style={{ '--depth': h.depth - 2 }}>
							<a
								class="relative block py-[0.1875rem] pl-[calc(0.875rem+var(--depth,0)*0.75rem)] text-muted text-xs leading-[1.45] transition-colors duration-150 hover:text-ink aria-[current=true]:text-accent before:absolute before:inset-y-0 before:-start-px before:w-0.5 before:rounded-[1px] before:transition-colors before:duration-150 aria-[current=true]:before:bg-accent"
								href={`#${h.id}`}
								aria-current={props.current === h.id ? 'true' : undefined}
							>
								{h.text}
							</a>
						</li>
					)}
				</For>
			</ul>
		</nav>
	);
}
