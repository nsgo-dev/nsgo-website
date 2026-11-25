// The page every missing address shows, as 404.html, in the language its
// address is in.
import { useContext } from 'solid-js';
import type { Lang } from '../../config';
import { site } from '../../site';
import { button, buttonSize, cjkTracking, container, ctaCenter, lead, primary } from '../../components/ui';
import { Page as PageContext } from '../context';

export function NotFound() {
	const page = useContext(PageContext);
	const t = () => site[page.lang()].t.notFound;
	return (
		<main id="main" class={`not-found ${container} grid justify-items-center content-center gap-3 min-h-[60vh] py-16 text-center`}>
			<p class="not-found-code text-accent font-mono text-sm font-600 tracking-[0.2em]" aria-hidden="true">
				404
			</p>
			<h1 id="_top" class={`text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-700 tracking-[-0.025em] leading-[1.2] ${cjkTracking}`}>
				{t().title}
			</h1>
			<p class={`${lead} max-w-[32rem]`}>{t().text}</p>
			<div class={ctaCenter}>
				<a class={`${button} ${buttonSize} ${primary}`} href={site[page.lang()].paths.home}>
					{t().home}
				</a>
			</div>
		</main>
	);
}

export function Page(_: { lang: Lang }) {
	return <NotFound />;
}
