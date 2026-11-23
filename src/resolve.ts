// The settings for one language, with every default filled in: what the
// pages render. Pure, so the integration, the pages and the share-cards
// command share it.
import type { Action, BuiltinNav, HomeContent, Item, Lang, Link, Localized, Maintainer, NavItem, Section, SidebarItem, SiteOptions, Sponsor, SponsorTier, Strings } from './config';
import { isLang, locales, nsgoCommunity, type UI } from './locales';

/** The site's languages, its first served at the root; English and Chinese unless set. */
export function languagesOf(options: Pick<SiteOptions, 'languages'>): Lang[] {
	const langs = options.languages ?? ['en', 'zh'];
	if (!langs.length) throw new Error('nsgo-website: languages needs at least one language');
	for (const l of langs) if (!isLang(l)) throw new Error(`nsgo-website: no language "${l}"; use one of ${Object.keys(locales).join(', ')}`);
	return [...new Set(langs)];
}

/** Whether a value is one value per language: an object whose keys are all language codes. */
function isPerLanguage(value: unknown): value is Partial<Record<Lang, unknown>> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const keys = Object.keys(value);
	return keys.length > 0 && keys.every(isLang);
}

type Unlocalized<T> = T extends readonly unknown[]
	? { [K in keyof T]: Unlocalized<T[K]> }
	: T extends object
		? keyof T extends Lang
			? Unlocalized<NonNullable<T[keyof T]>>
			: { [K in keyof T]: Unlocalized<T[K]> }
		: T;

/**
 * The value in one language, at every depth; where a value has none for the
 * language, the fallback's, else the first it has.
 */
export function localize<T>(value: T, lang: Lang, fallback: Lang = lang): Unlocalized<T> {
	if (isPerLanguage(value)) {
		const v = lang in value ? value[lang] : fallback in value ? value[fallback] : Object.values(value)[0];
		return localize(v, lang, fallback) as Unlocalized<T>;
	}
	if (Array.isArray(value)) return value.map((v) => localize(v, lang, fallback)) as Unlocalized<T>;
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, lang, fallback)])) as Unlocalized<T>;
	}
	return value as Unlocalized<T>;
}

/** The site's path of a page in a language: the first language's at the root, each other's under its code. */
export function pagePath(path: string, lang: Lang, first: Lang): string {
	const p = path.replace(/^\//, '');
	return lang === first ? p : `${lang}/${p}`;
}

export const isExternal = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);

/** An address as a page of the site under base gives it, with whether it leaves the site. */
export function resolveHref(href: string, lang: Lang, first: Lang, base: string): { href: string; external: boolean } {
	const root = base.replace(/\/$/, '');
	if (isExternal(href)) return { href, external: true };
	if (href.startsWith('#')) return { href: `${root}/${pagePath('', lang, first)}${href}`, external: false };
	return { href: `${root}/${pagePath(href, lang, first)}`, external: false };
}

export interface ResolvedLink {
	label: string;
	href: string;
	external: boolean;
	note?: string;
	icon?: Link['icon'];
	/** The image's path in the settings; the assets module has its file. */
	avatar?: string;
}

export type ResolvedNav = (ResolvedLink & { links?: undefined }) | { label: string; links: ResolvedLink[] };

/** A button in one language; the components resolve its address. */
export type ResolvedAction = Unlocalized<Action>;
export type ResolvedItem = Unlocalized<Item>;
export type ResolvedSection = Unlocalized<Section>;

export interface ResolvedHome extends Omit<Unlocalized<HomeContent>, 'actions' | 'sections'> {
	actions: ResolvedAction[];
	sections: ResolvedSection[];
}

export interface ResolvedRoadmap {
	owner: string;
	name: string;
	tracking: number;
	url: string;
	ref: string;
	description: string;
}

export type ResolvedSponsor = Unlocalized<Sponsor>;

export interface ResolvedSponsors {
	/** Where readers sponsor the project, without maintainers. */
	href: string;
	maintainers: (Unlocalized<Maintainer> & { href: string })[];
	/** Where invitations to empty places lead: the maintainers' cards, or href. */
	invite: string;
	description: string;
	/** Only those with sponsors or empty places. */
	tiers: ResolvedTier[];
	/** Those the home page shows. */
	home: ResolvedTier[];
}

export interface ResolvedTier {
	title: string;
	layout: SponsorTier['layout'];
	sponsors: ResolvedSponsor[];
	/** Its empty places. */
	left: number;
}

/** The owner and name of a GitHub repository's address. */
export function repoOf(url: string): { owner: string; name: string } {
	const m = url.match(/github\.com\/([^/]+)\/([^/#?]+)/);
	if (!m) throw new Error(`nsgo-website: repo must be a GitHub repository's address, not ${url}`);
	return { owner: m[1], name: m[2].replace(/\.git$/, '') };
}

function merge<T>(base: T, over: unknown): T {
	if (!over || typeof over !== 'object') return base;
	const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const [k, v] of Object.entries(over)) {
		const b = out[k];
		out[k] = b && typeof b === 'object' && !Array.isArray(b) && typeof b !== 'function' ? merge(b, v) : v;
	}
	return out as T;
}

export type Resolved = ReturnType<typeof resolveSite>;

/** Everything the pages of one language show. */
export function resolveSite(options: SiteOptions, lang: Lang, base: string) {
	const langs = languagesOf(options);
	const first = langs[0];
	const locale: (typeof locales)[Lang] = locales[lang];
	const loc = <T>(value: T) => localize(value, lang, first);
	const t: UI = merge(locale.ui, loc(options.strings as Localized<Strings> | undefined));
	const branch = options.branch ?? 'main';
	const repo = options.repo.replace(/\/$/, '');
	const feedback = options.feedback === false ? undefined : (options.feedback ?? `${repo}/issues`);
	const changelog = options.changelog === false ? undefined : (options.changelog ?? `${repo}/blob/${branch}/CHANGELOG.md`);

	const link = (l: Link): ResolvedLink => {
		const v = loc(l);
		return { label: v.label, note: v.note, icon: v.icon, avatar: v.avatar, ...resolveHref(v.href, lang, first, base) };
	};

	const home: ResolvedHome | false = (() => {
		if (!options.home) return false;
		const h = loc(options.home) as Unlocalized<HomeContent>;
		const actions: ResolvedAction[] = h.actions ?? [
			{ label: t.start, href: 'docs/' },
			{ label: 'GitHub', href: repo, icon: 'github' },
		];
		return { ...h, actions, sections: (h.sections ?? []) as ResolvedSection[] };
	})();

	const roadmap: ResolvedRoadmap | false = (() => {
		if (!options.roadmap) return false;
		const r = options.roadmap;
		const own = repoOf(repo);
		const owner = r.owner ?? own.owner;
		const name = r.name ?? own.name;
		return {
			owner,
			name,
			tracking: r.tracking,
			url: `https://github.com/${owner}/${name}/issues/${r.tracking}`,
			ref: `${name}#${r.tracking}`,
			description: r.description ? loc(r.description) : t.roadmap.description(options.name),
		};
	})();

	const sponsors: ResolvedSponsors | false = (() => {
		if (!options.sponsors) return false;
		const o = options.sponsors;
		const list = (l: Sponsor[]) => l.map((x) => loc(x) as ResolvedSponsor);
		const left = (tier: SponsorTier) => Math.max(0, (tier.places ?? 0) - tier.sponsors.length);
		const shown = o.tiers.filter((tier) => tier.sponsors.length || left(tier));
		const tiers: ResolvedTier[] = shown.map((tier) => ({ title: loc(tier.title), layout: tier.layout, sponsors: list(tier.sponsors), left: left(tier) }));
		const href = o.href ?? `https://github.com/sponsors/${repoOf(repo).owner}`;
		const maintainers = (o.maintainers ?? []).map((m) => ({ ...(loc(m) as Unlocalized<Maintainer>), href: m.href ?? `https://github.com/sponsors/${m.login}` }));
		return {
			href,
			maintainers,
			invite: maintainers.length ? resolveHref('sponsors/#become', lang, first, base).href : href,
			description: o.description ? loc(o.description) : t.sponsors.description(options.name),
			tiers,
			home: tiers.filter((_, i) => shown[i].home),
		};
	})();

	const community = (options.community === false ? [] : (options.community ?? nsgoCommunity(t))).map(link);
	const accounts = (options.accounts ?? []).map(link);

	const hasFeatures = home && home.sections.some((s) => 'id' in s && s.id === 'features');
	// The package's own links by name; each is left out where the site has no such part.
	const builtin: Record<BuiltinNav, ResolvedNav[]> = {
		features: hasFeatures ? [link({ label: t.nav.features, href: '#features' })] : [],
		docs: [link({ label: t.nav.docs, href: 'docs/' })],
		roadmap: roadmap ? [link({ label: t.nav.roadmap, href: 'roadmap/' })] : [],
		community: community.length ? [{ label: t.nav.community, links: community }] : [],
		feedback: feedback ? [link({ label: t.nav.feedback, href: feedback })] : [],
		sponsors: sponsors ? [link({ label: t.nav.sponsors, href: 'sponsors/' })] : [],
	};
	const nav: ResolvedNav[] = (options.nav ?? (Object.keys(builtin) as BuiltinNav[])).flatMap((n: NavItem): ResolvedNav[] =>
		typeof n === 'string' ? builtin[n] : 'links' in n ? [{ label: loc(n.label), links: n.links.map(link) }] : [link({ label: n.label, href: n.href })],
	);

	const f = options.footer ?? {};
	const footer = {
		copyright: f.copyright ? loc(f.copyright) : `© ${new Date().getFullYear()} ${options.name}`,
		license:
			f.license === false
				? undefined
				: f.license
					? { label: loc(f.license.label), href: f.license.href }
					: { label: t.license, href: `${repo}/blob/${branch}/LICENSE` },
		links: (
			f.links ?? [
				{ label: t.nav.docs, href: 'docs/' },
				...(roadmap ? [{ label: t.nav.roadmap, href: 'roadmap/' }] : []),
				...(feedback ? [{ label: t.nav.feedback, href: feedback }] : []),
				...(changelog ? [{ label: t.nav.changelog, href: changelog }] : []),
				{ label: 'GitHub', href: repo },
			]
		).map(link),
		/** At the end of the row, after the links, whatever they are. */
		sponsors: sponsors ? link({ label: t.nav.sponsors, href: 'sponsors/' }) : undefined,
	};

	const root = base.replace(/\/$/, '');
	return {
		lang,
		/** The site's languages, its first at the root. */
		langs,
		locale,
		t,
		name: options.name,
		title: loc(options.title),
		description: loc(options.description),
		logo: options.logo,
		repo,
		branch,
		path: options.path ?? 'website',
		editLink: options.editLink ?? true,
		feedback,
		changelog,
		nav,
		community,
		accounts,
		home,
		roadmap,
		sponsors,
		footer,
		share: { cards: options.share?.cards ?? true },
		paths: {
			home: `${root}/${pagePath('', lang, first)}`,
			docs: `${root}/${pagePath('docs/', lang, first)}`,
			roadmap: `${root}/${pagePath('roadmap/', lang, first)}`,
			sponsors: `${root}/${pagePath('sponsors/', lang, first)}`,
		},
	};
}

/** A Starlight sidebar, its labels in the first language with the others' as translations. */
export function starlightSidebar(items: SidebarItem[], langs: Lang[]): unknown[] {
	const first = langs[0];
	return items.map((item) => {
		if (typeof item === 'string') return item;
		const label = localize(item.label, first);
		const out: Record<string, unknown> = { ...item, label };
		const translations: Record<string, string> = {};
		for (const l of langs.slice(1)) {
			const text = localize(item.label, l, first);
			if (text !== label) translations[locales[l].tag] = text;
		}
		if (Object.keys(translations).length) out.translations = translations;
		if ('items' in item) out.items = starlightSidebar(item.items, langs);
		return out;
	});
}

/** Every file the settings name, by kind: components to render, images to import and Kubai icons to bundle. */
export function assetsOf(options: SiteOptions): { components: string[]; images: string[]; icons: string[] } {
	const components = new Set<string>();
	const images = new Set<string>([options.logo]);
	const icons = new Set<string>(['languages', 'globe', 'sun', 'moon', 'monitor', ...(options.icons ?? [])]);
	const links: Link[] = [...(options.accounts ?? []), ...(options.community || [])];
	for (const n of options.nav ?? []) if (typeof n !== 'string' && 'links' in n) links.push(...n.links);
	for (const l of links) if (l.avatar) images.add(l.avatar);
	if (options.sponsors) {
		icons.add('heart');
		const shown = [...(options.sponsors.maintainers ?? []).map((m) => ({ image: m.avatar })), ...options.sponsors.tiers.flatMap((tier) => (tier.layout === 'name' ? [] : tier.sponsors))];
		for (const s of shown as { image?: string; imageDark?: string }[]) for (const m of [s.image, s.imageDark]) if (m) images.add(m);
	}
	for (const lang of languagesOf(options)) {
		if (!options.home) break;
		const h = localize(options.home, lang, languagesOf(options)[0]) as Unlocalized<HomeContent>;
		if (h.visual) components.add(h.visual);
		for (const s of (h.sections ?? []) as Unlocalized<Section>[]) {
			if ((s.type === 'component' || s.type === 'split') && s.component) components.add(s.component);
			if (s.type === 'end' && s.logo && s.logo !== 'nsgo') images.add(s.logo);
			if ('items' in s) for (const i of s.items ?? []) if (i.icon) icons.add(i.icon);
		}
	}
	return { components: [...components], images: [...images], icons: [...icons] };
}
