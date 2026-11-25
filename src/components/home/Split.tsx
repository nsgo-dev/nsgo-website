// Words and points on one side; code, or the project's own component, on
// the other. Code comes highlighted: the settings' at build, or a project's
// own as html, from importing its file with ?highlight.
import { For, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { code as highlighted } from 'virtual:nsgo-website/code';
import type { Lang } from '../../config';
import type { ResolvedItem } from '../../resolve';
import { KIcon } from '../KIcon';
import { SectionHead } from './SectionHead';
import { container, itemText, section } from '../ui';

const colors = ['#6366f1', '#14b8a6', '#d97706', '#ec4899'];

export function Split(props: { lang: Lang; id?: string; eyebrow?: string; title: string; text?: string; items?: ResolvedItem[]; code?: { code: string; lang: string }; html?: string; children?: JSX.Element }) {
	const html = () => props.html ?? (props.code && highlighted[`${props.lang}\0${props.code.lang}\0${props.code.code}`]);
	return (
		<section class={section} id={props.id}>
			<div class={`usage-row ${container} grid gap-10 items-center lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-18`}>
				<div class="usage-copy">
					<SectionHead eyebrow={props.eyebrow} title={props.title} text={props.text} left />
					<Show when={props.items?.length}>
						<ul class="points grid gap-5 mt-8">
							<For each={props.items}>
								{(f, i) => (
									<li class="point grid grid-cols-[auto_minmax(0,1fr)] gap-3.5" data-kubai-trigger>
										<Show when={f.icon}>
											{(icon) => (
												<span class="point-icon grid place-items-center size-10 border border-line rounded-site bg-surface">
													<KIcon name={icon()} size={22} color={f.color ?? colors[i() % colors.length]} />
												</span>
											)}
										</Show>
										<div>
											<h3 class="mb-1 text-base font-650">{f.title}</h3>
											<p class={itemText}>{f.text}</p>
										</div>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
				<div class="usage-code min-w-0 [&_.code]:shadow-site [&_.code]:rounded-10 [&_.code_pre]:text-sm max-[30rem]:[&_.code_pre]:text-xs">
					<Show when={html()}>{(h) => <div class="markdown" innerHTML={h()} />}</Show>
					{props.children}
				</div>
			</div>
		</section>
	);
}
