// The closing card: a logo, a title, a few words and buttons over a faint
// field of characters.
import { For, Show } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import nsgoLogo from '../../assets/nsgo.svg?url';
import type { Lang } from '../../config';
import type { ResolvedAction } from '../../resolve';
import { AsciiField } from '../AsciiField';
import { ActionButton } from './ActionButton';
import { container, ctaCenter, eyebrow, sectionTitle } from '../ui';

export function End(props: { lang: Lang; id?: string; eyebrow?: string; title: string; text?: string; logo?: string; actions?: ResolvedAction[] }) {
	const src = () => (props.logo === 'nsgo' ? nsgoLogo : props.logo ? images[props.logo] : undefined);
	return (
		<section class="section end pt-8 pb-20 lg:pt-12 lg:pb-28" id={props.id}>
			<div class={container}>
				<div class="end-card relative overflow-hidden py-[clamp(3.5rem,8vw,6.5rem)] px-6 border border-line rounded-[calc(var(--radius-lg)*1.4)] [background:radial-gradient(60%_120%_at_50%_0%,var(--accent-soft),transparent_70%),var(--end-bg,var(--surface))] text-center light:[--end-bg:#ffffff] light:shadow-site [&>:not(.ascii-field)]:relative [&>:not(.ascii-field)]:z-1">
					<AsciiField />
					<Show when={src()}>{(s) => <img class="end-logo block size-16 mx-auto mb-5" src={s()} alt="" width="64" height="64" />}</Show>
					<Show when={props.eyebrow}>
						<p class={eyebrow}>{props.eyebrow}</p>
					</Show>
					<h2 class={sectionTitle}>
						<For each={props.title.split(/(?<=[，、])/)}>{(p) => <span class="phrase inline-block">{p}</span>}</For>
					</h2>
					<Show when={props.text}>
						<p class="max-w-[32rem] mx-auto mt-4 mb-8 text-muted text-pretty">{props.text}</p>
					</Show>
					<Show when={props.actions?.length}>
						<div class={ctaCenter}>
							<For each={props.actions}>{(action, i) => <ActionButton lang={props.lang} action={action} index={i()} />}</For>
						</div>
					</Show>
				</div>
			</div>
		</section>
	);
}
