// The roadmap: each stage as a block, its title on the left and a ring of
// its tasks closed on the right; then its areas as columns of cards, each
// holding its tasks as a tree with their subtasks, pull requests and what
// they wait for. A stage of one area spans the row instead, its tasks as
// lanes laid out like a waterfall. Its content is the GitHub issues the
// build read; their words are GitHub's, in English in every language.
import { For, onSettled, Show } from 'solid-js';
import { roadmap as data } from 'virtual:nsgo-website/roadmap';
import type { Lang } from '../config';
import type { Progress, Roadmap } from '../roadmap';
import { site } from '../site';
import { Icon } from './Icon';
import { container } from './ui';

const ref = 'rm-ref text-faint font-mono text-xs font-500 whitespace-nowrap';
// Each status's color, as --status, and its icon: started work half filled, blocked work dashed.
const statusColor: Record<string, string> = {
	done: '[--status:var(--done)]',
	blocked: '[--status:var(--blocked)]',
	review: '[--status:var(--review)]',
	progress: '[--status:var(--progress)]',
	planned: '[--status:var(--border-strong)]',
};
const statusIcon: Record<string, string> = {
	done: 'bg-(--done)',
	blocked: 'border-dashed',
	review: 'bg-[linear-gradient(90deg,var(--status)_50%,transparent_50%)]',
	progress: 'bg-[linear-gradient(90deg,var(--status)_50%,transparent_50%)]',
	planned: '',
};
const pullColor: Record<string, string> = { open: '[--pr:var(--review)]', draft: '[--pr:var(--faint)]', merged: '[--pr:var(--merged)]', closed: '[--pr:var(--closed-pr)]' };

const ext = { target: '_blank', rel: 'noopener noreferrer' };
const percent = (p: Progress) => (p.total ? Math.round((p.done / p.total) * 100) : 0);

export function RoadmapPage(props: { lang: Lang }) {
	const s = () => site[props.lang];
	const info = () => {
		const r = s().roadmap;
		if (!r) throw new Error('nsgo-website: RoadmapPage needs the roadmap setting');
		return r;
	};
	const r = () => s().t.roadmap;
	const roadmap = (data ?? { status: 'unavailable', reason: 'no data' }) as Roadmap;
	const date = () => (roadmap.status === 'ok' ? new Date(roadmap.fetchedAt).toLocaleDateString(s().locale.tag, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '');
	let root: HTMLDivElement | undefined;

	// Packs the lanes of a one-area stage like a waterfall: each lane spans
	// as many of the grid's small rows as it is tall, so the next fills the
	// shortest gap. Without the script they sit in plain rows.
	onSettled(() => {
		const observers: ResizeObserver[] = [];
		for (const tree of root?.querySelectorAll<HTMLElement>('.rm-tree[data-lanes]') ?? []) {
			const lanes = [...tree.children] as HTMLElement[];
			const pack = () => {
				tree.dataset.packed = '';
				const style = getComputedStyle(tree);
				const row = parseFloat(style.gridAutoRows);
				const gap = parseFloat(style.columnGap) || 0;
				for (const lane of lanes) lane.style.gridRowEnd = `span ${Math.ceil((lane.getBoundingClientRect().height + gap) / row)}`;
			};
			const observer = new ResizeObserver(pack);
			for (const lane of lanes) observer.observe(lane);
			observers.push(observer);
		}
		return () => observers.forEach((o) => o.disconnect());
	});

	return (
		<main
			id="main"
			class={`roadmap ${container} pt-8 pb-16 text-sm leading-[1.45] [--done:#22a45d] [--blocked:#f59e0b] [--review:#22a45d] [--progress:var(--accent)] [--merged:#8b5cf6] [--closed-pr:#e5484d] [--line:var(--border-strong)] [&_a:focus-visible]:rounded-4`}
			ref={(el) => (root = el as HTMLDivElement)}>
			<h1 id="_top" class="sr-only">
				{r().title}
			</h1>
			<Show
				when={roadmap.status === 'ok' && roadmap}
				fallback={
					<p class="rm-notice mt-4 text-muted [&_a]:text-accent" role="status">
						{r().unavailable[0]}
						{'reason' in roadmap ? roadmap.reason : ''}
						{r().unavailable[1]}
						<a href={info().url} {...ext}>
							{info().ref}
						</a>
						{r().unavailable[2]}
					</p>
				}
			>
				{(ok) => (
					<>
						<For each={ok().stages}>
							{(stage, i) => (
								<section class="rm-stage [.rm-stage+&]:mt-9" aria-labelledby={`stage-${i() + 1}`}>
									<header class="rm-stage-head flex items-center gap-4 mb-4">
										<h2
											id={`stage-${i() + 1}`}
											class="flex flex-1 flex-wrap items-center gap-x-2.5 gap-y-1.5 min-w-0 text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] font-700 tracking-[-0.02em] leading-[1.25]"
										>
											<span class="rm-eyebrow inline-flex items-center h-[1.375rem] px-2 rounded-6 bg-accent-soft text-accent text-xs font-650 tracking-normal whitespace-nowrap">{r().stage(i() + 1)}</span>
											<span lang="en">{stage.title}</span>
											<a class="rm-ref font-mono text-13 font-500 tracking-normal whitespace-nowrap hover:text-accent" href={stage.url} {...ext}>
												{stage.ref}
											</a>
										</h2>
										<p
											class="rm-ring grid flex-none place-items-center size-13 rounded-full [background:radial-gradient(closest-side,var(--bg)_calc(100%_-_0.3125rem),transparent_calc(100%_-_0.3125rem_+_0.5px)),conic-gradient(var(--color)_calc(var(--p)*1%),var(--surface-2)_0)] text-ink font-mono text-xs font-650 tabular-nums [--color:var(--progress)] data-full:[--color:var(--done)] data-full:text-(--done)"
											style={{ '--p': percent(stage.progress) }}
											 data-full={percent(stage.progress) === 100 ? '' : undefined}>
											<span class="sr-only">{r().progress(stage.progress.done, stage.progress.total)}</span>
											<span aria-hidden="true">{percent(stage.progress)}%</span>
										</p>
									</header>
									<div class="rm-areas columns-[3_18rem] gap-x-3 data-single:columns-auto" data-single={stage.areas.length === 1 ? '' : undefined}>
										<For each={stage.areas}>
											{(area) => (
												<section
													class="rm-area break-inside-avoid mb-3 [[data-single]>&]:mb-0 overflow-hidden border border-line rounded-site bg-page transition-colors duration-150 has-[a:hover]:border-line-strong has-[a:focus-visible]:border-line-strong"
													aria-label={area.name || s().t.other}>
													<h3 class="flex items-baseline gap-2 px-3.5 py-2 border-b border-line bg-surface text-sm font-650">
														<span lang={area.name ? 'en' : undefined}>{area.name || s().t.other}</span>
														<span class="rm-area-count ml-auto text-faint font-mono text-xs tabular-nums">
															<span class="sr-only">{r().progress(area.progress.done, area.progress.total)}</span>
															<span aria-hidden="true">
																{area.progress.done}/{area.progress.total}
															</span>
														</span>
													</h3>
													<ul
														class="rm-tree px-3.5 pt-1.5 pb-2 data-lanes:grid data-lanes:grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] data-lanes:gap-3 data-lanes:items-start data-lanes:p-3 data-lanes:data-packed:auto-rows-[4px] data-lanes:data-packed:gap-y-0"
														data-lanes={stage.areas.length === 1 && area.tasks.length > 1 ? '' : undefined}>
														<For each={area.tasks}>
															{(task) => {
																const subDone = task.subtasks.filter((x) => x.state === 'closed').length;
																const lanes = () => stage.areas.length === 1 && area.tasks.length > 1;
																return (
																	<li
																		class={[
																			'rm-task',
																			statusColor[task.status],
																			lanes()
																				? 'px-3 pt-2.5 pb-2 border border-line border-t-2 border-t-(--status) rounded-site-sm bg-surface transition-colors duration-150 has-[a:hover]:border-line-strong has-[a:hover]:border-t-(--status) has-[a:focus-visible]:border-line-strong has-[a:focus-visible]:border-t-(--status)'
																				: 'py-1',
																		]}
																		data-status={task.status}
																	>
																		<div class="rm-row flex items-start gap-2">
																			<span
																				class={`rm-icon grid flex-none place-items-center size-3.5 mt-[0.1875rem] border-[1.5px] border-(--status) rounded-full text-white ${statusIcon[task.status]}`}
																				role="img"
																				aria-label={r().status[task.status]}
																			>
																				<Show when={task.status === 'done'}>
																					<Icon name="approve-check" size="0.625rem" />
																				</Show>
																			</span>
																			<a
																				class={[
																					'rm-title flex-1 min-w-0 transition-colors duration-150 hover:text-accent',
																					{ 'text-muted': task.status === 'done', 'font-600': lanes() && task.status !== 'done', 'font-500': lanes() && task.status === 'done' },
																				]}
																				href={task.url}
																				{...ext}
																				lang="en"
																			>
																				<span class={ref}>{task.ref}</span> {task.name}
																			</a>
																			<Show when={task.subtasks.length > 0 || task.pulls.length > 0 || task.status === 'review' || task.status === 'progress'}>
																				<span class="rm-tags flex flex-none flex-wrap justify-end items-center gap-1 max-w-1/2 mt-px">
																					<Show when={task.subtasks.length > 0}>
																						<span class="rm-sub-count text-muted font-mono text-[0.6875rem]">
																							<span class="sr-only">{r().subtasks(subDone, task.subtasks.length)}</span>
																							<span aria-hidden="true">
																								{subDone}/{task.subtasks.length}
																							</span>
																						</span>
																					</Show>
																					<For each={task.pulls}>
																						{(p) => (
																							<a
																								class={`rm-pull inline-flex items-center gap-[0.1875rem] text-(--pr) font-mono text-xs font-600 whitespace-nowrap transition-opacity duration-150 hover:opacity-75 ${pullColor[p.state]}`}
																								data-state={p.state} href={p.url} {...ext} title={r().pull[p.state]} aria-label={`#${p.number} ${r().pull[p.state]}`}>
																								<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
																									<circle cx="4" cy="3.5" r="1.75" />
																									<circle cx="4" cy="12.5" r="1.75" />
																									<circle cx="12" cy="12.5" r="1.75" />
																									<path d="M4 5.25v5.5M12 10.75V6.5a2 2 0 0 0-2-2H7.5m1.5-1.75L7.25 4.5 9 6.25" />
																								</svg>
																								#{p.number}
																							</a>
																						)}
																					</For>
																					<Show when={task.status === 'review' || task.status === 'progress'}>
																						<span class="rm-status inline-flex items-center h-[1.125rem] px-1.5 rounded-full bg-[color-mix(in_srgb,var(--status)_14%,transparent)] text-(--status) text-[0.6875rem] font-600 whitespace-nowrap">{r().status[task.status]}</span>
																					</Show>
																				</span>
																			</Show>
																		</div>
																		<Show when={task.waitsFor.length > 0}>
																			<ul class="rm-waits mt-0.5 ml-[1.375rem] text-muted text-xs" aria-label={r().waitsFor}>
																				<For each={task.waitsFor}>
																					{(w) => (
																						<li class="flex items-center gap-1.5 min-w-0">
																							<span
																								class={`rm-dot flex-none size-[0.4375rem] rounded-full bg-(--dot) shadow-[0_0_0_2px_color-mix(in_srgb,var(--dot)_22%,transparent)] ${w.state === 'closed' ? '[--dot:var(--done)]' : '[--dot:var(--blocked)]'}`}
																								data-state={w.state} role="img" aria-label={`${r().waitsFor}: ${w.state === 'closed' ? r().closed : r().open}`} />
																							<a class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap hover:text-accent" href={w.url} {...ext} lang="en" title={w.title}>
																								<span class="rm-ref text-faint font-mono text-[0.6875rem] font-500 whitespace-nowrap">{w.ref}</span> {w.title}
																							</a>
																						</li>
																					)}
																				</For>
																			</ul>
																		</Show>
																		<Show when={task.subtasks.length > 0}>
																			<ul class={['rm-subtasks ml-1.5 text-13', lanes() ? 'mt-1.5' : 'mt-0.5']}>
																				<For each={task.subtasks}>
																					{(x) => (
																						<li
																								class="relative flex items-baseline gap-1.5 py-0.5 pl-4 before:absolute before:top-0 before:left-0 before:w-2.5 before:h-[0.8125rem] before:border-b before:border-l before:border-(--line) before:rounded-bl-[0.3125rem] not-last:after:absolute not-last:after:inset-y-0 not-last:after:left-0 not-last:after:border-l not-last:after:border-(--line)"
																								data-state={x.state}
																							>
																							<span
																									class={`rm-sub-icon grid flex-none place-items-center size-[0.6875rem] border-[1.5px] rounded-[0.1875rem] text-white translate-y-px ${x.state === 'closed' ? 'border-(--done) bg-(--done)' : 'border-line-strong'}`}
																									role="img" aria-label={x.state === 'closed' ? r().closed : r().open}>
																								<Show when={x.state === 'closed'}>
																									<Icon name="approve-check" size="0.5rem" />
																								</Show>
																							</span>
																							<a class={['hover:text-accent', { 'text-muted': x.state === 'closed' }]} href={x.url} {...ext} lang="en">
																								<span class={ref}>{x.ref}</span> {x.title}
																							</a>
																						</li>
																					)}
																				</For>
																			</ul>
																		</Show>
																	</li>
																);
															}}
														</For>
													</ul>
												</section>
											)}
										</For>
									</div>
								</section>
							)}
						</For>
						<p class="rm-source flex items-center gap-1.5 mt-4 text-faint text-xs">
							{r().asOf}
							<time datetime={ok().fetchedAt}>{date()}</time>
							<span aria-hidden="true">·</span>
							<a class="inline-flex items-center gap-[0.1875rem] text-accent font-mono hover:underline" href={info().url} {...ext}>
								{info().ref}
								<Icon name="external" size="0.7rem" class="external text-faint" />
							</a>
						</p>
					</>
				)}
			</Show>
		</main>
	);
}
