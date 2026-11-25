// A docs page: the sidebar, the page's Markdown under its title and lead,
// its table of contents, and its neighbours and edit link at its end. A
// page a language lacks shows the first language's, without an edit link.
import { useLoaderData } from '@tanstack/solid-router';
import { Hydrate } from '@tanstack/solid-start';
import { idle } from '@tanstack/solid-start/hydration';
import { createMemo, onSettled, Show } from 'solid-js';
import { DocsPicker, DocsSidebar, DocsTocMenu } from '../../components/docs/Islands';
import { sidebarOf } from '../sidebar';
import { Toc, useCurrentHeading } from '../../components/docs/Toc';
import { Icon } from '../../components/Icon';
import type { Lang } from '../../config';
import { pagesOf } from '../../docs';
import { site } from '../../site';
import { cjkTracking, container } from '../../components/ui';
import type { DocData } from './docs-route';

const pageLink = 'grid gap-0.5 px-4 py-3.5 rounded-site bg-surface text-muted text-13 transition-colors duration-150 hover:bg-surface-2 [&>strong]:text-ink [&>strong]:text-15 [&>strong]:font-600';

export function Page(props: { lang: Lang }) {
	const data = useLoaderData({ strict: false }) as () => DocData;
	const s = () => site[props.lang];
	const t = () => s().t;
	const sidebar = createMemo(() => sidebarOf(props.lang));
	const list = createMemo(() => pagesOf(sidebar()));
	const at = () => list().findIndex((p) => p.slug === data().slug);
	const prev = () => (at() > 0 ? list()[at() - 1] : undefined);
	const next = () => (at() >= 0 && at() < list().length - 1 ? list()[at() + 1] : undefined);
	const current = useCurrentHeading(() => data().doc.headings);
	let content: HTMLDivElement | undefined;

	// A code block's button copies its code.
	onSettled(() => {
		const copy = (event: MouseEvent) => {
			const button = (event.target as Element).closest<HTMLButtonElement>('.code-copy');
			const code = button?.parentElement?.querySelector('pre')?.textContent;
			if (!button || code == null) return;
			void navigator.clipboard.writeText(code).then(() => {
				button.dataset.done = '';
				setTimeout(() => delete button.dataset.done, 1500);
			});
		};
		content?.addEventListener('click', copy);
		return () => content?.removeEventListener('click', copy);
	});

	return (
		<div class={`docs-frame ${container} block docs:grid docs:grid-cols-[var(--docs-sidebar-width)_minmax(0,1fr)] docs:gap-8`}>
			<nav
				class="docs-sidebar hidden docs:block docs:sticky docs:top-(--header-height) docs:h-[calc(100vh-var(--header-height))] docs:pt-8 docs:pr-2 docs:pb-12 docs:overflow-y-auto docs:[scrollbar-width:thin] docs:[scrollbar-color:var(--border)_transparent]"
				 aria-label={t().docs.pages}>
				<Hydrate when={idle()}>
					<DocsSidebar lang={props.lang} />
				</Hydrate>
			</nav>
			<main id="main" class="docs-main min-w-0 pb-16">
				<div class="docs-bar sticky top-(--header-height) z-2 flex items-center gap-3 h-(--bar-height) -mx-5 px-5 border-b border-line bg-page docs:mx-0 docs:px-0 docs:not-has-[.toc-trigger]:hidden wide:hidden">
					<Hydrate when={idle()}>
						<DocsPicker lang={props.lang} />
					</Hydrate>
					<Show when={data().doc.headings.length > 0}>
						<Hydrate when={idle()}>
							<DocsTocMenu lang={props.lang} />
						</Hydrate>
					</Show>
				</div>
				<div class="docs-columns wide:grid wide:grid-cols-[minmax(0,1fr)_var(--docs-toc-width)] wide:gap-10">
					<article class="docs-content max-w-[52rem] pt-8" data-pagefind-body>
						<h1 id="_top" class={`text-ink text-[clamp(1.875rem,1.6rem+1vw,2.25rem)] font-700 tracking-[-0.025em] leading-[1.3] ${cjkTracking}`}>
							{data().doc.title}
						</h1>
						<Show when={data().doc.description}>
							<p class="lead mt-2.5 text-muted text-17 leading-[1.6]">{data().doc.description}</p>
						</Show>
						<div class="markdown mt-6" ref={(el) => (content = el)} innerHTML={data().doc.html} />
						<footer class="docs-footer grid gap-6 mt-12" data-pagefind-ignore>
							<Show when={s().editLink && !data().fallback}>
								<a class="edit-link inline-flex items-center gap-2 justify-self-start text-muted text-13 hover:text-ink" href={data().doc.edit} target="_blank" rel="noopener noreferrer">
									<Icon name="pencil" size="1rem" />
									{t().docs.edit}
								</a>
							</Show>
							<Show when={prev() || next()}>
								<div class="pagination grid grid-cols-2 gap-3">
									<Show when={prev()}>
										{(p) => (
											<a class={`prev ${pageLink}`} href={p().href} rel="prev">
												<span>{t().docs.previous}</span>
												<strong>{p().label}</strong>
											</a>
										)}
									</Show>
									<Show when={next()}>
										{(p) => (
											<a class={`next ${pageLink} col-start-2 text-end`} href={p().href} rel="next">
												<span>{t().docs.next}</span>
												<strong>{p().label}</strong>
											</a>
										)}
									</Show>
								</div>
							</Show>
						</footer>
					</article>
					<aside class="docs-toc hidden wide:block wide:sticky wide:top-(--header-height) wide:h-[calc(100vh-var(--header-height))] wide:py-8 wide:overflow-y-auto wide:[scrollbar-width:none]">
						<Toc title={t().docs.toc} overview={t().docs.overview} headings={data().doc.headings} current={current()} />
					</aside>
				</div>
			</main>
		</div>
	);
}
