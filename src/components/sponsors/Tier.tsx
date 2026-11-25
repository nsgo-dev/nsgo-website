// One tier of sponsors, under its title, laid out as the tier says, with an
// invitation to its empty places after them. The sponsors page shows every
// tier, the home page those marked for it.
import { Dynamic } from '@solidjs/web';
import type { JSX } from '@solidjs/web';
import { For, Match, Show, Switch } from 'solid-js';
import type { Lang } from '../../config';
import type { ResolvedSponsor, ResolvedTier } from '../../resolve';
import { site } from '../../site';
import { SectionHead } from '../home/SectionHead';
import { KIcon } from '../KIcon';
import { container } from '../ui';
import { SponsorImage } from './SponsorImage';

type Layout = ResolvedTier['layout'];

const lists: Record<Layout, string> = {
	featured: 'featured-wall grid gap-4 md:grid-cols-3 md:gap-5 [&>li]:grid',
	large: 'logo-wall large grid grid-cols-2 gap-3 md:grid-cols-4 [&>li]:grid',
	small: 'logo-wall small grid grid-cols-2 gap-3 xs:grid-cols-3 md:grid-cols-6 [&>li]:grid',
	service: 'service-wall flex flex-wrap justify-center gap-3 [&>li]:grid [&>li]:flex-[1_1_15rem] [&>li]:max-w-[22rem]',
	avatar: 'avatar-wall flex flex-wrap justify-center gap-x-2 gap-y-5',
	name: 'name-wall flex flex-wrap justify-center gap-2 max-w-[48rem] mx-auto',
};
const heights: Record<Layout, number> = { featured: 48, large: 40, small: 24, service: 32, avatar: 56, name: 0 };
const images: Record<Layout, string> = {
	featured: 'w-auto max-w-[13rem] h-12 object-contain',
	large: 'w-auto max-w-full h-10 object-contain',
	small: 'w-auto max-w-full h-6 object-contain',
	service: 'w-auto max-w-full h-8 object-contain',
	avatar: 'size-full object-cover',
	name: '',
};
const ext = { target: '_blank', rel: 'noopener noreferrer' };

// Each layout's box, a sponsor's or an invitation's: an invitation is dashed,
// warming to pink on hover.
const featured = 'featured-sponsor min-h-36 md:min-h-48 py-7 px-6 border rounded-site-lg text-center';
const featuredGrid = 'grid content-center justify-items-center gap-2';
const tile = 'logo-tile border rounded-site';
const tileSize = (layout: Layout) => (layout === 'small' ? 'h-17 p-3' : 'h-26 p-4');
const service = 'service-tile py-6 px-5 border rounded-site text-center';
const solid = 'border-line text-ink transition-[translate,border-color,box-shadow,background-color] duration-150';
const invite =
	'invite-card border-dashed border-line-strong bg-transparent text-muted transition-colors duration-150 hover:border-[rgb(236_72_153/0.6)] hover:bg-[rgb(236_72_153/0.05)] hover:text-ink';
const inviteFlex = 'flex flex-wrap content-center justify-center gap-x-2 gap-y-1.5 text-center';

/** The sponsor's own link around its content, or a box without one. */
function Box(props: { sponsor: ResolvedSponsor; class: string; title?: string; children: JSX.Element }) {
	return (
		<Dynamic component={props.sponsor.href ? 'a' : 'div'} class={props.class} title={props.title} {...(props.sponsor.href ? { href: props.sponsor.href, ...ext } : {})}>
			{props.children}
		</Dynamic>
	);
}

export function Tier(props: { lang: Lang; tier: ResolvedTier; text?: string }) {
	const s = () => site[props.lang];
	const sponsors = () => {
		const x = s().sponsors;
		if (!x) throw new Error('nsgo-website: SponsorTier needs the sponsors setting');
		return x;
	};
	const t = () => s().t.sponsors;
	// The maintainers' cards are on the site; any other address leaves it.
	const inviteLink = () => ({ href: sponsors().invite, ...(sponsors().maintainers.length ? {} : ext), 'data-kubai-trigger': '' });
	const layout = () => props.tier.layout;
	const linked = (sponsor: ResolvedSponsor, hover: string) => (sponsor.href ? hover : '');
	const image = (sponsor: ResolvedSponsor) =>
		sponsor.image ? <SponsorImage sponsor={sponsor} height={heights[layout()]} decorative={layout() === 'avatar'} class={images[layout()]} /> : undefined;
	const name = (sponsor: ResolvedSponsor) => (
		<span class={['logo-name overflow-hidden max-w-full text-ellipsis whitespace-nowrap', layout() === 'featured' ? 'text-22 font-700 tracking-[-0.01em]' : layout() === 'small' ? 'text-sm font-650' : 'font-650']}>
			{sponsor.name}
		</span>
	);
	const label = (size: string) => <span class={`invite-label font-600 ${size}`}>{t().become}</span>;
	const left = (basis: string) => <span class={`invite-left text-faint text-13 ${basis}`}>{t().left(props.tier.left)}</span>;
	return (
		<section class="section sponsors-section py-16 lg:py-28 [.sponsors_&]:py-12 [.sponsors_&]:lg:py-18 [.sponsors_.sponsors-section+&]:pt-0">
			<div class={container}>
				<SectionHead title={props.tier.title} text={props.text} space="mb-9" />
				<ul class={lists[layout()]}>
					<For each={props.tier.sponsors}>
						{(sponsor) => (
							<Switch>
								<Match when={layout() === 'featured'}>
									<li>
										<Box sponsor={sponsor} class={`${featured} ${featuredGrid} ${solid} bg-surface ${linked(sponsor, 'hover:border-line-strong hover:shadow-site hover:-translate-y-0.5')}`}>
											<span class="featured-logo grid place-items-center h-14 mb-2">{image(sponsor) ?? name(sponsor)}</span>
											<Show when={sponsor.text}>
												<span class="featured-text max-w-[18rem] text-muted text-15 leading-[1.5] text-pretty">{sponsor.text}</span>
											</Show>
										</Box>
									</li>
								</Match>
								<Match when={layout() === 'large' || layout() === 'small'}>
									<li>
										<Box sponsor={sponsor} class={`${tile} grid place-items-center ${tileSize(layout())} ${solid} bg-page ${linked(sponsor, 'hover:border-line-strong hover:bg-surface')}`} title={sponsor.name}>
											{image(sponsor) ?? name(sponsor)}
										</Box>
									</li>
								</Match>
								<Match when={layout() === 'service'}>
									<li>
										<Box sponsor={sponsor} class={`${service} grid justify-items-center content-center gap-3 ${solid} bg-page ${linked(sponsor, 'hover:border-line-strong hover:bg-surface')}`}>
											<span class="service-logo grid place-items-center h-9">{image(sponsor) ?? name(sponsor)}</span>
											<Show when={sponsor.text}>
												<span class="service-text text-muted text-sm leading-[1.5]">{sponsor.text}</span>
											</Show>
										</Box>
									</li>
								</Match>
								<Match when={layout() === 'avatar'}>
									<li>
										<Box sponsor={sponsor} class={`avatar-tile grid justify-items-center gap-2 w-22 ${sponsor.href ? 'group/avatar text-ink' : 'text-muted'}`}>
											<span class="avatar grid place-items-center overflow-hidden size-14 border border-line rounded-full bg-surface-2 text-ink font-650 transition-[translate,border-color] duration-300 ease-site group-hover/avatar:border-line-strong group-hover/avatar:-translate-y-0.5">
												{image(sponsor) ?? sponsor.name.slice(0, 1)}
											</span>
											<span class="avatar-name overflow-hidden max-w-full text-13 text-ellipsis whitespace-nowrap">{sponsor.name}</span>
										</Box>
									</li>
								</Match>
								<Match when={layout() === 'name'}>
									<li class="px-3 py-1 border border-line rounded-full text-muted text-sm">
										{sponsor.href ? (
											<a class="transition-colors duration-150 hover:text-ink" href={sponsor.href} {...ext}>
												{sponsor.name}
											</a>
										) : (
											sponsor.name
										)}
									</li>
								</Match>
							</Switch>
						)}
					</For>
					<Show when={props.tier.left > 0}>
						<li class="invite">
							<Switch>
								<Match when={layout() === 'featured'}>
									<a class={`${featured} ${invite} flex flex-col flex-wrap items-center content-center justify-center gap-x-2 gap-y-1.5`} {...inviteLink()}>
										<KIcon name="heart" size={28} color="#ec4899" />
										{label('mt-2 text-15')}
										{left('basis-auto')}
									</a>
								</Match>
								<Match when={layout() === 'avatar'}>
									<a class="avatar-tile group/avatar grid justify-items-center gap-2 w-22 text-muted hover:text-ink" {...inviteLink()} title={t().left(props.tier.left)}>
										<span class={`avatar grid place-items-center size-14 border rounded-full ${invite} group-hover/avatar:border-[rgb(236_72_153/0.6)] group-hover/avatar:bg-[rgb(236_72_153/0.05)]`}>
											<KIcon name="heart" size={22} color="#ec4899" />
										</span>
										<span class="avatar-name overflow-hidden max-w-full text-13 text-ellipsis whitespace-nowrap">{t().become}</span>
									</a>
								</Match>
								<Match when={layout() === 'name'}>
									<a class={`name-invite inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-sm ${invite}`} {...inviteLink()} title={t().left(props.tier.left)}>
										<KIcon name="heart" size={14} color="#ec4899" />
										{label('text-sm')}
									</a>
								</Match>
								<Match when={layout() === 'service'}>
									<a class={`${service} ${invite} ${inviteFlex}`} {...inviteLink()} title={t().left(props.tier.left)}>
										<KIcon name="heart" size={18} color="#ec4899" />
										{label('text-sm')}
										{left('basis-full')}
									</a>
								</Match>
								<Match when={true}>
									<a class={`${tile} ${tileSize(layout())} ${invite} ${inviteFlex}`} {...inviteLink()} title={t().left(props.tier.left)}>
										<KIcon name="heart" size={18} color="#ec4899" />
										{label(layout() === 'small' ? 'text-13' : 'text-sm')}
										<Show when={layout() !== 'small'}>{left('basis-full')}</Show>
									</a>
								</Match>
							</Switch>
						</li>
					</Show>
				</ul>
			</div>
		</section>
	);
}
