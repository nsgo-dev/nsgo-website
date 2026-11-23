// The settings a project gives its site. Every string a reader sees may be
// one string for every language or one per language, as { en, zh }; so may
// any larger part, such as a whole section or the whole home page, when the
// languages differ in more than their words. A language a value leaves out
// takes the site's first language's value.
import type { StarlightUserConfig } from '@astrojs/starlight/types';
import type { StarlightIcon } from '@astrojs/starlight/types';
import type { Lang } from './locales';

export type { Lang };

/** A value for every language, or one per language by its code. */
export type Localized<T> = T | { [L in Lang]?: T };
export type Text = Localized<string>;

/**
 * A link. An address with a scheme (https:, mailto:) leaves the site; one
 * starting with # is a part of the home page; any other is a path of the
 * site as its first language has it, which other languages take under their
 * code (docs/ becomes zh/docs/).
 */
export interface Link {
	label: Text;
	href: Text;
	/** A line under the label in menus. */
	note?: Text;
	/** A Starlight icon, or 'nsgo' for NSGo's logo. */
	icon?: StarlightIcon | 'nsgo';
	/** An image file, from the project's root, shown round in place of the icon. */
	avatar?: string;
}

/** The header's own links: the home page's #features, the docs, the roadmap, the community menu, feedback and the sponsors page. */
export type BuiltinNav = 'features' | 'docs' | 'roadmap' | 'community' | 'feedback' | 'sponsors';

/** A link of the header's navigation, a menu of links when it has links, or one of the package's own by name. */
export type NavItem = BuiltinNav | { label: Text; href: Text } | { label: Text; links: Link[] };

/** A button of the hero or of the end card. */
export interface Action {
	label: Text;
	href: Text;
	/** primary is filled, secondary outlined; the first is primary unless set. */
	variant?: 'primary' | 'secondary';
	/** A Starlight icon before the label. */
	icon?: StarlightIcon;
}

/** One highlight of a section: a Kubai icon, a title and a sentence or two. */
export interface Item {
	/** A Kubai Icons name, such as 'film' or 'app-window'. */
	icon?: string;
	/** The icon's color; sections give each item one of theirs otherwise. */
	color?: string;
	title: Text;
	text: Text;
}

interface SectionHead {
	/** The section's anchor, as in #features. */
	id?: string;
	eyebrow?: Text;
	/** Chinese and Japanese headings break only after a full-width comma. */
	title: Text;
	text?: Text;
}

/** Cards in a grid with their icons above, three to a row on wide screens. */
export interface FeaturesSection extends SectionHead {
	type: 'features';
	items: Localized<Item[]>;
	columns?: number;
}

/** Cards in one strip with their icons beside, four to a row on wide screens. */
export interface CardsSection extends SectionHead {
	type: 'cards';
	items: Localized<Item[]>;
	columns?: number;
}

/** Words and points on one side, code or a component on the other. */
export interface SplitSection extends SectionHead {
	type: 'split';
	items?: Localized<Item[]>;
	code?: { code: string; lang: string };
	/** An .astro component, from the project's root, given { lang }. */
	component?: string;
}

/** A closing card over a field of characters, with a logo and buttons. */
export interface EndSection extends SectionHead {
	type: 'end';
	/** An image file from the project's root, or 'nsgo' for NSGo's logo. */
	logo?: string;
	actions?: Action[];
}

/** A project's own .astro component, from the project's root, given { lang }. */
export interface ComponentSection {
	type: 'component';
	component: string;
}

export type Section = FeaturesSection | CardsSection | SplitSection | EndSection | ComponentSection;

export interface HomeContent {
	/** The small pill above the headline, as 'In development'. */
	status?: Text;
	/** Two lines; the second takes the accent. */
	headline: Localized<[string, string]>;
	lead: Text;
	/** Defaults to the docs and the repository. */
	actions?: Action[];
	/** Short tags under the buttons, as the platforms. */
	chips?: Localized<string[]>;
	/** The .astro component beside the words, from the project's root, given { lang }. */
	visual?: string;
	sections?: Localized<Section[]>;
}

/** A Starlight sidebar group or entry, its labels in each language. */
export type SidebarItem =
	| string
	| { label: Text; slug: string }
	| { label: Text; link: string }
	| { label: Text; items: SidebarItem[]; collapsed?: boolean }
	| { label: Text; autogenerate: { directory: string; collapsed?: boolean }; collapsed?: boolean };

export interface DocsOptions {
	/**
	 * The folder of the docs, from the site's root, with one folder per
	 * language named by its code: with English first, en/quick-start.md is
	 * served as docs/quick-start/ and zh/quick-start.md as
	 * zh/docs/quick-start/. Defaults to ../docs/public.
	 */
	dir?: string;
	/** Every docs page by its first language's slug, as 'docs/quick-start'. */
	sidebar?: SidebarItem[];
}

export interface RoadmapOptions {
	/** The repository whose issues make the roadmap; defaults to the project's. */
	owner?: string;
	name?: string;
	/** The tracking issue, whose sub-issues are the stages. */
	tracking: number;
	description?: Text;
}

export interface FooterOptions {
	/** Defaults to © the year and the project's name. */
	copyright?: Text;
	/** Defaults to MIT, linking the repository's LICENSE; false shows none. */
	license?: { label: Text; href: string } | false;
	/** Defaults to the docs, the roadmap, feedback, the changelog and GitHub. */
	links?: Link[];
}

export interface ShareOptions {
	/**
	 * Whether pages name public/share/en.png and zh.png as the image of their
	 * cards; the share-cards command draws them. Defaults to true.
	 */
	cards?: boolean;
	/** The cards' right side, as HTML, 520 pixels wide; the logo otherwise. */
	visual?: string;
	/** CSS for the visual. */
	css?: string;
}

/** A sponsor of the project, as its tier shows it. */
export interface Sponsor {
	name: string;
	/** Where the sponsor's logo, avatar or name links to. */
	href?: string;
	/** An image file from the site's root: a logo, or a person's avatar; the name tier shows none. */
	image?: string;
	/** The logo on the dark theme, for one that would not show on a dark background. */
	imageDark?: string;
	/** A line under a featured sponsor's logo, or what a service sponsor gives. */
	text?: Text;
}

/**
 * A tier of the sponsors page: its title, as the project's own tiers name
 * it, and how its sponsors show. featured is a card of a logo and a line,
 * large and small are logos, service a logo with what the sponsor gives
 * instead of money, avatar a person's picture over their name and name the
 * name alone.
 */
export interface SponsorTier {
	title: Text;
	layout: 'featured' | 'large' | 'small' | 'service' | 'avatar' | 'name';
	/** Whether the home page shows the tier too, before its closing card. */
	home?: boolean;
	/**
	 * The places the tier offers. Its empty places show as one invitation;
	 * sponsors beyond them still show, and the build warns, as a tier's
	 * places are kept by the sponsors already in it.
	 */
	places?: number;
	sponsors: Sponsor[];
}

/** A person readers sponsor, as GitHub Sponsors shows them. */
export interface Maintainer {
	name: string;
	/** Their GitHub login, shown under the name. */
	login: string;
	/** An image file from the site's root. */
	avatar: string;
	/** What they do for the project. */
	text?: Text;
	/** Where they are sponsored; defaults to their GitHub Sponsors. */
	href?: string;
}

/**
 * The sponsors page, its links in the header's navigation and the
 * footer's corner, and its home tiers on the home page. A tier shows when it has sponsors or empty
 * places.
 */
export interface SponsorsOptions {
	/**
	 * Where readers sponsor the project; defaults to the repository owner's
	 * GitHub Sponsors. Unused with maintainers.
	 */
	href?: string;
	/**
	 * The people readers sponsor, as cards atop the page in place of its
	 * button; invitations to empty places then lead to them.
	 */
	maintainers?: Maintainer[];
	/** The words under the page's title. */
	description?: Text;
	/** In the order the page shows them. */
	tiers: SponsorTier[];
}

/** Words of the site's frame, to change from the package's own. */
export interface Strings {
	nav?: Partial<Record<'label' | 'menu' | 'docs' | 'roadmap' | 'features' | 'github' | 'community' | 'feedback' | 'changelog' | 'sponsors', string>>;
	theme?: Partial<Record<'name' | 'light' | 'dark' | 'auto', string>>;
	language?: Partial<Record<'name' | 'auto', string>>;
	start?: string;
	license?: string;
	other?: string;
}

export interface SiteOptions {
	/**
	 * The languages the site is in, by code, of those in locales.ts: en, zh,
	 * zh-tw, ja, ko, es, fr, de, pt, ru, it, vi, id and tr. The first is
	 * served at the root and each other under its code. Defaults to en and zh.
	 */
	languages?: Lang[];
	/** The project's name, beside the logo and in titles. */
	name: string;
	/** The home page's title. */
	title: Text;
	description: Text;
	/** The logo, an image file from the site's root, such as ./src/assets/logo.png. */
	logo: string;
	/** In public/; defaults to /favicon.svg. */
	favicon?: string;
	/** In public/, such as /apple-touch-icon.png. */
	appleTouchIcon?: string;
	/** The project's GitHub repository, as https://github.com/owner/name. */
	repo: string;
	/** Defaults to main. */
	branch?: string;
	/** The site's folder in the repository, for docs' edit links; defaults to website. */
	path?: string;
	/** Whether docs pages link to their source on GitHub; defaults to true. */
	editLink?: boolean;
	/** Where readers report problems; defaults to the repository's issues, false shows none. */
	feedback?: string | false;
	/** Defaults to the repository's CHANGELOG.md; false shows none. */
	changelog?: string | false;
	/**
	 * The header's navigation; defaults to the package's own links, in the
	 * order of BuiltinNav, each where the site has its part.
	 */
	nav?: NavItem[];
	/** The community menu; defaults to NSGo's places, false shows none. */
	community?: Link[] | false;
	/** X accounts, in a menu of the header. */
	accounts?: Link[];
	docs?: DocsOptions;
	/** The home page from these settings, or false for a project's own src/pages/index.astro and <code>/index.astro. */
	home: Localized<HomeContent> | false;
	/** The roadmap page from the tracking issue's sub-issues; none without, or when GitHub cannot find the issue. */
	roadmap?: RoadmapOptions | false;
	/** The sponsors page and its tiers on the home page; none without. */
	sponsors?: SponsorsOptions | false;
	footer?: FooterOptions;
	share?: ShareOptions;
	strings?: Localized<Strings>;
	/** Kubai icons the project's own components animate with KIcon, beyond those named here. */
	icons?: string[];
	/** The project's own CSS after the package's, as to change the colors in tokens.css. */
	customCss?: string[];
	/** Starlight settings over the package's own. */
	starlight?: Partial<StarlightUserConfig>;
}

/** The settings, typed; for a site.config.ts that astro.config.mjs and the share-cards command import. */
export function defineSite(options: SiteOptions): SiteOptions {
	return options;
}
