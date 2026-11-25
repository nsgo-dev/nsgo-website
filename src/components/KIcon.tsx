// A Kubai icon, drawn on the server; its drawing code reaches the browser
// only once the page is idle, or with a page that shows it later, and
// scripts/kubai.ts gives it its motion. A project's own components name the
// icons they use in its icons setting, so only those are bundled.
import { Hydrate } from '@tanstack/solid-start';
import { idle } from '@tanstack/solid-start/hydration';
import { toSvg } from 'kubai-icons';
import { icons } from 'virtual:nsgo-website/icons';

export function KIcon(props: { name: string; size?: number; color?: string; title?: string; class?: string }) {
	return (
		<Hydrate when={idle()}>
			<span
				class="kicon"
				innerHTML={(() => {
					const icon = icons[props.name];
					if (!icon) throw new Error(`nsgo-website: add "${props.name}" to the icons setting to use it in KIcon`);
					return toSvg(icon, { size: props.size ?? 24, color: props.color, title: props.title, className: props.class, attrs: { 'data-kubai': props.name } });
				})()}
			/>
		</Hydrate>
	);
}
