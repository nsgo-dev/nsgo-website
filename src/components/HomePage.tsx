// The home page from the home setting: the hero with the project's visual,
// then its sections in order, with the sponsors' home tiers before the
// closing card. A project's own home page may render this with other
// content, or compose the sections itself.
import { For, Match, Show, Switch } from 'solid-js';
import { Dynamic } from '@solidjs/web';
import { components } from 'virtual:nsgo-website/components';
import type { Lang } from '../config';
import type { ResolvedHome, ResolvedSection } from '../resolve';
import { site } from '../site';
import { Cards } from './home/Cards';
import { End } from './home/End';
import { Features } from './home/Features';
import { Hero } from './home/Hero';
import { Split } from './home/Split';
import { Tier } from './sponsors/Tier';

export function HomePage(props: { lang: Lang; home?: ResolvedHome }) {
	const s = () => site[props.lang];
	const home = () => {
		const h = props.home ?? s().home;
		if (!h) throw new Error('nsgo-website: HomePage needs the home setting or a home prop');
		return h;
	};
	const tiers = () => (s().sponsors ? (s().sponsors as Exclude<ReturnType<typeof s>['sponsors'], false>).home : []);
	const Tiers = () => <For each={tiers()}>{(tier, n) => <Tier lang={props.lang} tier={tier} text={n() === 0 ? s().t.sponsors.homeText(s().name) : undefined} />}</For>;
	const own = (path: string) => {
		const c = components[path];
		if (!c) throw new Error(`nsgo-website: no component ${path}`);
		return c;
	};
	const Section = (p: { section: ResolvedSection }) => (
		<Switch>
			<Match when={p.section.type === 'features' && p.section}>{(x) => <Features {...x()} />}</Match>
			<Match when={p.section.type === 'cards' && p.section}>{(x) => <Cards {...x()} />}</Match>
			<Match when={p.section.type === 'split' && p.section}>
				{(x) => (
					<Split lang={props.lang} {...x()}>
						<Show when={x().component}>{(c) => <Dynamic component={own(c())} lang={props.lang} />}</Show>
					</Split>
				)}
			</Match>
			<Match when={p.section.type === 'end' && p.section}>
				{(x) => (
					<>
						<Tiers />
						<End lang={props.lang} {...x()} />
					</>
				)}
			</Match>
			<Match when={p.section.type === 'component' && p.section}>{(x) => <Dynamic component={own(x().component)} lang={props.lang} />}</Match>
		</Switch>
	);
	return (
		<main id="main" class="home text-base leading-[1.6]">
			<Hero
				lang={props.lang}
				status={home().status}
				headline={home().headline}
				lead={home().lead}
				actions={home().actions}
				chips={home().chips}
				visual={home().visual ? <Dynamic component={own(home().visual!)} lang={props.lang} /> : undefined}
			/>
			<For each={home().sections}>{(section) => <Section section={section} />}</For>
			<Show when={!home().sections.some((x) => x.type === 'end')}>
				<Tiers />
			</Show>
		</main>
	);
}
