// One effect of Effects: its number, the project's own picture or a demo
// drawn live, a title and a few words. With an address the whole effect is
// a link; the pointer over it steers its demo.
import { Dynamic } from '@solidjs/web';
import { Show } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { DemoName } from '../../scripts/demos';
import { Demo } from './Demo';

export function Effect(props: { icon?: string; demo?: DemoName; title: string; text?: string; href?: string; children?: JSX.Element }) {
	const external = () => props.href !== undefined && /^[a-z][a-z0-9+.-]*:/i.test(props.href);
	return (
		<li>
			<Dynamic
				component={props.href ? 'a' : 'div'}
				class={[
					"effect group/effect relative grid content-start gap-x-4 text-ink outline-none transition-[background-color] duration-[120ms] ease-[steps(2)] before:col-start-1 before:justify-self-start before:mb-3 before:text-accent before:font-mono before:text-xs before:font-700 before:tracking-[0.08em] before:content-[counter(effect,decimal-leading-zero)_'_/']",
					props.demo ? 'has-demo grid-cols-[minmax(0,1fr)]' : 'grid-cols-[minmax(0,1fr)_auto]',
				]}
				href={props.href}
				data-demo-steer
				{...(external() ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
			>
				{props.demo ? (
					<Demo effect={props.demo} width={120} height={90} class="effect-demo col-start-1 w-full h-auto aspect-[4/3] mb-4" />
				) : (
					<Show when={props.icon}>{(icon) => <img
								class="effect-icon col-start-2 row-[1/span_3] size-22 transition-[translate] duration-[240ms] ease-[steps(3)] motion-safe:group-hover/effect:-translate-y-1 motion-safe:group-focus-visible/effect:-translate-y-1"
								src={icon()} alt="" width="88" height="88" />}</Show>
				)}
				<h3 class="col-start-1 mb-2 font-mono text-base font-800 tracking-[0.02em] uppercase group-hover/effect:text-accent group-focus-visible/effect:text-accent">{props.title}</h3>
				<Show when={props.text}>
					<p class="col-start-1 text-muted text-sm leading-[1.6]">{props.text}</p>
				</Show>
				{props.children}
			</Dynamic>
		</li>
	);
}
