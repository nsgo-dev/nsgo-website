// The theme's and the language's choices, shared by the header's menus and
// the phone menu's choice groups so both show the same icons and colors.
import { locales, type Lang } from '../../locales';
import { langs, site } from '../../site';

/** Each choice's icon color. */
export const colors = { languages: '#8b5cf6', globe: '#14b8a6', sun: '#f59e0b', moon: '#6366f1', monitor: '#0ea5e9' };

/** Each language's mark color, in the order of the site's languages. */
const tagColors = ['#3b82f6', '#ef4444', '#f59e0b', '#22a45d', '#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6'];

export interface Choice {
	label: string;
	value: string;
	/** A Kubai icon in its color, or else a language's mark in its color. */
	icon?: string;
	mark?: string;
	color: string;
}

export const themeChoices = (lang: Lang): Choice[] => {
	const t = site[lang].t;
	return [
		{ label: t.theme.auto, value: 'auto', icon: 'monitor', color: colors.monitor },
		{ label: t.theme.light, value: 'light', icon: 'sun', color: colors.sun },
		{ label: t.theme.dark, value: 'dark', icon: 'moon', color: colors.moon },
	];
};

export const languageChoices = (lang: Lang): Choice[] => [
	{ label: site[lang].t.language.auto, value: 'auto', icon: 'globe', color: colors.globe },
	...langs.map((l, i) => ({ label: locales[l].label, value: l, mark: locales[l].mark, color: tagColors[i % tagColors.length] })),
];
