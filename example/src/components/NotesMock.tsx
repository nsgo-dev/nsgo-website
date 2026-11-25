// The hero's picture of the sample app: a list of notes beside the open one,
// drawn in CSS.
import { For } from 'solid-js';
import './NotesMock.css';

const words = {
	en: {
		label: 'A notes window with a list of notes beside the open one',
		notes: ['Trip to the coast', 'Reading list', 'Groceries'],
		title: 'Trip to the coast',
		lines: ['Leave on Friday morning', 'Book a room near the harbour', 'Pack the camera'],
	},
	zh: {
		label: '一个笔记窗口，笔记列表在打开的笔记旁边',
		notes: ['海边旅行', '书单', '采购清单'],
		title: '海边旅行',
		lines: ['周五上午出发', '订一间靠近港口的房间', '带上相机'],
	},
};

export default function NotesMock(props: { lang: string }) {
	const t = () => words[props.lang as keyof typeof words] ?? words.en;
	return (
		<figure class="mock" role="img" aria-label={t().label}>
			<div class="mock-window" aria-hidden="true">
				<div class="mock-bar">
					<span />
					<span />
					<span />
				</div>
				<div class="mock-body">
					<ul class="list">
						<For each={t().notes}>{(note, i) => <li class={i() === 0 ? 'on' : undefined}>{note}</li>}</For>
					</ul>
					<div class="note">
						<p class="title">{t().title}</p>
						<ul>
							<For each={t().lines}>{(line, i) => <li class={i() === 0 ? 'done' : undefined}>{line}</li>}</For>
						</ul>
					</div>
				</div>
			</div>
		</figure>
	);
}
