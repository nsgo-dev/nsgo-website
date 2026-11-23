// Gives every server-rendered Kubai icon its motion.
import { animate, bindTrigger } from 'kubai-icons/runtime';
import { icons } from 'virtual:nsgo-website/icons';

function wake(root: ParentNode = document) {
	for (const svg of root.querySelectorAll<SVGSVGElement>('svg[data-kubai]:not([data-kubai-ready])')) {
		const icon = icons[svg.dataset.kubai ?? ''];
		if (!icon) continue;
		svg.dataset.kubaiReady = '';
		const controller = animate(svg, icon);
		bindTrigger(svg.closest('[data-kubai-trigger]') ?? svg, controller, icon);
	}
}

wake();
