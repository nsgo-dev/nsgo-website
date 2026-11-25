// A demoscene effect drawn in real time, in the site's accent, dithered a
// pixel at a time: knot, plasma, tunnel, rotozoom, bounce, scope, trail,
// terrain or stars. width and height are its pixels, before it is scaled
// up to its box. With drag the reader turns it by dragging (the knot);
// the trail follows the pointer inside the closest [data-demo-steer].
import { onSettled } from 'solid-js';
import type { DemoName } from '../../scripts/demos';

export function Demo(props: { effect: DemoName; width?: number; height?: number; drag?: boolean; class?: string }) {
	// The effects load with the first demo on a page, not with every page.
	onSettled(() => void import('../../scripts/demos').then((m) => m.startDemos()));
	return <canvas
			class={['demo block [image-rendering:pixelated] data-drag:cursor-grab data-drag:touch-pan-y data-drag:active:cursor-grabbing', props.class]}
			 data-demo={props.effect} data-drag={props.drag ? '' : undefined} width={props.width ?? 96} height={props.height ?? 96} aria-hidden="true" />;
}
