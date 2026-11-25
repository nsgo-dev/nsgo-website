// The home page's opening: the status, the headline, the lead, the buttons
// and the chips on one side, and the project's own picture, the visual, on
// the other.
import { children, For, Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { Lang } from '../../config';
import type { ResolvedAction } from '../../resolve';
import { ActionButton } from './ActionButton';
import { cjkTracking, container, lead, rise } from '../ui';

export function Hero(props: { lang: Lang; status?: string; headline: [string, string]; lead: string; actions?: ResolvedAction[]; chips?: string[]; visual?: JSX.Element }) {
	// Resolved once, so the visual renders once.
	const visual = children(() => props.visual);
	return (
		<section class={['hero flex items-center', visual() ? 'min-h-[min(calc(100svh-3.75rem),56rem)] pt-12 pb-16' : 'pt-20']}>
			<div class={[`hero-row ${container} grid items-center`, visual() ? 'gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-18' : 'single gap-12']}>
				<div class={['hero-copy min-w-0', visual() ? 'max-w-[34rem]' : 'max-w-[48rem]']}>
					<Show when={props.status}>
						<p class={`status-pill ${rise} inline-flex items-center gap-2 mb-6 py-1 pr-3 pl-2.5 border border-line rounded-full bg-surface text-muted text-13 font-550`} style={{ '--i': 0 }}>
							<span class="dot size-2 rounded-full bg-amber shadow-[0_0_0_3px_rgb(245_158_11/0.18)]" aria-hidden="true" />
							{props.status}
						</p>
					</Show>
					<h1
						id="_top"
						class={`headline ${rise} flex flex-col mb-5 text-[clamp(2.5rem,1.6rem+3.6vw,4.25rem)] font-700 tracking-[-0.035em] leading-[1.05] text-balance ${cjkTracking} [:is(:lang(zh),:lang(ja))_&]:leading-[1.15] [:is(:lang(zh),:lang(ja))_&]:break-keep`}
						style={{ '--i': 0 }}
					>
						<span>{props.headline[0]}</span>
						<span class="accent bg-[linear-gradient(100deg,var(--accent)_10%,#8b5cf6_90%)] bg-clip-text text-transparent">{props.headline[1]}</span>
					</h1>
					<p class={`${lead} ${rise} max-w-[34rem]`} style={{ '--i': 1 }}>
						{props.lead}
					</p>
					<Show when={props.actions?.length}>
						<div class={`cta ${rise} flex flex-wrap gap-3 mt-9 mb-6`} style={{ '--i': 2 }}>
							<For each={props.actions}>{(action, i) => <ActionButton lang={props.lang} action={action} index={i()} large />}</For>
						</div>
					</Show>
					<Show when={props.chips?.length}>
						<ul class={`hero-meta ${rise} flex flex-wrap gap-2`} style={{ '--i': 3 }}>
							<For each={props.chips}>{(m) => <li class="px-3 py-1 border border-line rounded-full text-muted text-13">{m}</li>}</For>
						</ul>
					</Show>
				</div>
				<Show when={visual()}>
					<div class={`hero-stage ${rise} min-w-0`} style={{ '--i': 1 }}>
						{visual()}
					</div>
				</Show>
			</div>
		</section>
	);
}
