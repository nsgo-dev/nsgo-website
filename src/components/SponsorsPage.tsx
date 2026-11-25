// The sponsors page: an invitation to sponsor, as the maintainers' cards
// when there are any and a button otherwise, then the project's own tiers in
// order.
import { For, Show } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import type { Lang } from '../config';
import { site } from '../site';
import { ActionButton } from './home/ActionButton';
import { KIcon } from './KIcon';
import { Tier } from './sponsors/Tier';
import { button, buttonSize, container, ctaCenter, lead, rise, secondary } from './ui';

export function SponsorsPage(props: { lang: Lang }) {
	const s = () => site[props.lang];
	const sp = () => {
		const x = s().sponsors;
		if (!x) throw new Error('nsgo-website: SponsorsPage needs the sponsors setting');
		return x;
	};
	const t = () => s().t.sponsors;
	return (
		<main id="main" class="home sponsors text-base leading-[1.6]">
			<header class={`sponsors-hero ${container} grid justify-items-center pt-20 pb-4 text-center`} data-kubai-trigger>
				<span class={`sponsors-mark ${rise} grid place-items-center size-16 mb-6 rounded-full bg-[rgb(236_72_153/0.12)]`} style={{ '--i': 0 }}>
					<KIcon name="heart" size={32} color="#ec4899" />
				</span>
				<h1 id="_top" class={`${rise} mb-4 text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)] font-700 tracking-[-0.03em] leading-[1.1]`} style={{ '--i': 0 }}>
					{t().title}
				</h1>
				<p class={`${lead} ${rise} max-w-[34rem] mx-auto`} style={{ '--i': 1 }}>
					{sp().description}
				</p>
				<Show
					when={sp().maintainers.length > 0}
					fallback={
						<div class={`${ctaCenter} ${rise} mt-8`} style={{ '--i': 2 }}>
							<ActionButton lang={props.lang} action={{ label: t().become, href: sp().href }} index={0} />
						</div>
					}
				>
					<ul
						id="become"
						class={`maintainers ${rise} grid gap-4 w-full max-w-[44rem] mt-10 text-left scroll-mt-[calc(var(--header-height)+2rem)] sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]`}
						style={{ '--i': 2 }}>
						<For each={sp().maintainers}>
							{(m) => (
								<li class="maintainer flex flex-col gap-4 p-5 border border-line rounded-site-lg bg-surface">
									<div class="maintainer-who flex items-center gap-4 min-w-0">
										<img class="maintainer-avatar flex-none size-14 border border-line rounded-full object-cover" src={images[m.avatar]} alt="" width="56" height="56" />
										<div class="min-w-0">
											<p class="maintainer-name overflow-hidden text-ellipsis whitespace-nowrap text-lg font-700 leading-[1.3]">{m.name}</p>
											<p class="maintainer-login overflow-hidden text-ellipsis whitespace-nowrap text-muted text-15">{m.login}</p>
										</div>
									</div>
									<Show when={m.text}>
										<p class="maintainer-text text-muted text-15 leading-[1.5] text-pretty">{m.text}</p>
									</Show>
									<a class={`maintainer-button ${button} ${buttonSize} ${secondary} w-full mt-auto hover:border-[rgb(236_72_153/0.5)]!`} href={m.href} target="_blank" rel="noopener noreferrer" data-kubai-trigger>
										<KIcon name="heart" size={18} color="#ec4899" />
										{t().sponsor}
									</a>
								</li>
							)}
						</For>
					</ul>
				</Show>
			</header>
			<For each={sp().tiers}>{(tier) => <Tier lang={props.lang} tier={tier} />}</For>
		</main>
	);
}
