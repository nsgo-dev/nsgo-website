// Gives every Kubai icon on the page its motion: it moves when the closest
// [data-kubai-trigger] around it, or else the icon itself, is hovered,
// focused or tapped. Loaded once the page is idle, and run again after
// each move to another page.
import { animate, bindTrigger } from 'kubai-icons/runtime';
import { icons } from 'virtual:nsgo-website/icons';

export function wake(root: ParentNode = document) {
	for (const svg of root.querySelectorAll<SVGSVGElement>('svg[data-kubai]:not([data-kubai-ready])')) {
		const icon = icons[svg.dataset.kubai ?? ''];
		if (!icon) continue;
		svg.dataset.kubaiReady = '';
		const controller = animate(svg, icon);
		bindTrigger((svg.closest('[data-kubai-trigger]') as HTMLElement | null) ?? svg, controller, icon);
	}
}
