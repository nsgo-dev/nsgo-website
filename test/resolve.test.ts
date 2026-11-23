import { describe, expect, test } from 'bun:test';
import type { SiteOptions } from '../src/config';
import { locales } from '../src/locales';
import { assetsOf, languagesOf, localize, repoOf, resolveHref, resolveSite, starlightSidebar } from '../src/resolve';
import { pickLanguage } from '../src/scripts/language';

const options: SiteOptions = {
	name: 'Demo',
	title: { en: 'Demo: a thing', zh: 'Demo：一个东西' },
	description: 'Both languages',
	logo: './logo.png',
	repo: 'https://github.com/owner/demo',
	home: {
		headline: { en: ['One', 'Two'], zh: ['一', '二'] },
		lead: { en: 'Lead', zh: '引言' },
		sections: [
			{ type: 'features', id: 'features', title: { en: 'Features', zh: '功能' }, items: [{ icon: 'film', title: 'A', text: 'B' }] },
			{ type: 'component', component: './Own.astro' },
			{ type: 'end', logo: './end.svg', title: 'End', actions: [{ label: 'Go', href: 'docs/' }] },
		],
	},
	roadmap: { tracking: 2 },
};

describe('localize', () => {
	test('picks the language at every depth', () => {
		expect(localize({ a: { en: 'x', zh: 'y' }, b: [{ en: 1, zh: 2 }], c: 'same' }, 'zh')).toEqual({ a: 'y', b: [2], c: 'same' });
	});
	test('keeps objects with other keys', () => {
		expect(localize({ en: 'x', zh: 'y', other: 1 }, 'zh')).toEqual({ en: 'x', zh: 'y', other: 1 });
	});
	test('falls back where a language has no value', () => {
		expect(localize({ en: 'x', zh: 'y' }, 'ja', 'en')).toBe('x');
		expect(localize({ zh: 'y' }, 'ja', 'en')).toBe('y');
	});
});

describe('resolveHref', () => {
	test('keeps addresses that leave the site', () => {
		expect(resolveHref('https://x.com/a', 'zh', 'en', '/base/')).toEqual({ href: 'https://x.com/a', external: true });
	});
	test('puts Chinese pages under zh/', () => {
		expect(resolveHref('docs/', 'en', 'en', '/base/').href).toBe('/base/docs/');
		expect(resolveHref('/docs/', 'zh', 'en', '/base').href).toBe('/base/zh/docs/');
		expect(resolveHref('docs/', 'zh', 'zh', '/').href).toBe('/docs/');
		expect(resolveHref('docs/', 'en', 'zh', '/').href).toBe('/en/docs/');
	});
	test('takes anchors to the home page', () => {
		expect(resolveHref('#features', 'zh', 'en', '/').href).toBe('/zh/#features');
	});
});

describe('resolveSite', () => {
	test('fills in the defaults', () => {
		const s = resolveSite(options, 'zh', '/demo/');
		expect(s.title).toBe('Demo：一个东西');
		expect(s.feedback).toBe('https://github.com/owner/demo/issues');
		expect(s.nav.map((n) => n.label)).toEqual(['功能', '文档', '路线图', '社区', '反馈']);
		expect(s.nav[0]).toMatchObject({ href: '/demo/zh/#features', external: false });
		expect(s.footer.license).toEqual({ label: 'MIT', href: 'https://github.com/owner/demo/blob/main/LICENSE' });
		expect(s.footer.links.map((l) => l.href)).toContain('/demo/zh/roadmap/');
		expect(s.roadmap).toMatchObject({ owner: 'owner', name: 'demo', ref: 'demo#2', url: 'https://github.com/owner/demo/issues/2' });
		expect(s.home && s.home.headline).toEqual(['一', '二']);
		expect(s.home && s.home.actions).toEqual([
			{ label: '入门指南', href: 'docs/' },
			{ label: 'GitHub', href: 'https://github.com/owner/demo', icon: 'github' },
		]);
		expect(s.paths).toEqual({ home: '/demo/zh/', docs: '/demo/zh/docs/', roadmap: '/demo/zh/roadmap/', sponsors: '/demo/zh/sponsors/' });
		expect(s.sponsors).toBe(false);
	});
	test('leaves out what is turned off', () => {
		const s = resolveSite({ ...options, home: false, roadmap: false, feedback: false, community: false, footer: { license: false } }, 'en', '/');
		expect(s.nav.map((n) => n.label)).toEqual(['Docs']);
		expect(s.footer.license).toBeUndefined();
		expect(s.footer.links.map((l) => l.label)).toEqual(['Docs', 'Changelog', 'GitHub']);
	});
	test('overrides the frame’s words', () => {
		const s = resolveSite({ ...options, strings: { en: { nav: { docs: 'Guide' } }, zh: {} } }, 'en', '/');
		expect(s.t.nav.docs).toBe('Guide');
		expect(s.t.nav.roadmap).toBe('Roadmap');
	});
});

test('starlightSidebar gives the other languages’ labels as translations', () => {
	expect(starlightSidebar([{ label: { en: 'Start', zh: '开始', ja: '始める' }, items: ['docs', { label: 'Same', link: 'x/' }] }], ['en', 'zh', 'ja', 'fr'])).toEqual([
		{ label: 'Start', translations: { 'zh-CN': '开始', ja: '始める' }, items: ['docs', { label: 'Same', link: 'x/' }] },
	]);
});

describe('languages', () => {
	test('serve the first at the root and give each its words', () => {
		const ja = resolveSite({ ...options, languages: ['ja', 'en', 'zh-tw'] }, 'ja', '/');
		expect(ja.paths.docs).toBe('/docs/');
		expect(ja.t.nav.docs).toBe('ドキュメント');
		expect(ja.title).toBe('Demo: a thing');
		const tw = resolveSite({ ...options, languages: ['ja', 'en', 'zh-tw'] }, 'zh-tw', '/');
		expect(tw.paths.roadmap).toBe('/zh-tw/roadmap/');
		expect(tw.locale.tag).toBe('zh-TW');
	});
	test('reject unknown codes', () => {
		expect(() => languagesOf({ languages: ['xx' as never] })).toThrow();
		expect(() => languagesOf({ languages: [] })).toThrow();
	});
	test('every language has every word', () => {
		const keys = (o: object): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v).map((x) => `${k}.${x}`) : [k])).sort();
		for (const l of Object.keys(locales) as (keyof typeof locales)[]) expect(keys(locales[l].ui)).toEqual(keys(locales.en.ui));
	});
});

test('assetsOf lists the files and icons the settings name', () => {
	const a = assetsOf(options);
	expect(a.components).toEqual(['./Own.astro']);
	expect(a.images).toEqual(['./logo.png', './end.svg']);
	expect(a.icons).toContain('film');
	expect(a.icons).toContain('sun');
});

test('sponsors keep the tiers with sponsors or places, and every sponsor past the places', () => {
	const sponsors = {
		tiers: [
			{ title: { en: 'Gold', zh: '金牌' }, layout: 'featured' as const, home: true, places: 2, sponsors: [1, 2, 3].map((n) => ({ name: `G${n}`, text: { en: 'Line', zh: '一句' } })) },
			{ title: 'Silver', layout: 'small' as const, places: 4, sponsors: [{ name: 'S', image: './s.svg', imageDark: './s-dark.svg' }] },
			{ title: 'Open', layout: 'large' as const, places: 3, sponsors: [] },
			{ title: 'Empty', layout: 'large' as const, sponsors: [] },
			{ title: 'Names', layout: 'name' as const, sponsors: [{ name: 'N', image: './unused.svg' }] },
		],
	};
	const s = resolveSite({ ...options, sponsors }, 'zh', '/demo/');
	if (!s.sponsors) throw new Error('no sponsors');
	expect(s.sponsors.href).toBe('https://github.com/sponsors/owner');
	expect(s.sponsors.invite).toBe('https://github.com/sponsors/owner');
	const withPeople = resolveSite({ ...options, sponsors: { ...sponsors, maintainers: [{ name: 'A', login: 'a', avatar: './a.png', text: { en: 'Lead', zh: '负责人' } }] } }, 'zh', '/demo/');
	expect(withPeople.sponsors && withPeople.sponsors.maintainers).toEqual([{ name: 'A', login: 'a', avatar: './a.png', text: '负责人', href: 'https://github.com/sponsors/a' }]);
	expect(withPeople.sponsors && withPeople.sponsors.invite).toBe('/demo/zh/sponsors/#become');
	expect(assetsOf({ ...options, sponsors: { ...sponsors, maintainers: [{ name: 'A', login: 'a', avatar: './a.png' }] } }).images).toContain('./a.png');
	expect(s.sponsors.tiers.map((t) => [t.title, t.sponsors.length, t.left])).toEqual([
		['金牌', 3, 0],
		['Silver', 1, 3],
		['Open', 0, 3],
		['Names', 1, 0],
	]);
	expect(s.sponsors.tiers[0].sponsors[0].text).toBe('一句');
	expect(s.sponsors.home.map((t) => t.title)).toEqual(['金牌']);
	expect(s.nav.map((n) => n.label).at(-1)).toBe('赞助');
	expect(s.footer.sponsors).toMatchObject({ label: '赞助', href: '/demo/zh/sponsors/' });
	const a = assetsOf({ ...options, sponsors });
	expect(a.images).toContain('./s-dark.svg');
	expect(a.images).not.toContain('./unused.svg');
	expect(a.icons).toContain('heart');
});

test('repoOf reads a GitHub address', () => {
	expect(repoOf('https://github.com/a/b.git')).toEqual({ owner: 'a', name: 'b' });
	expect(() => repoOf('https://example.com')).toThrow();
});

test('nav mixes the package’s links with the project’s', () => {
	const s = resolveSite({ ...options, nav: ['docs', { label: { en: 'Apps', zh: '应用' }, href: 'apps/' }, 'roadmap', 'feedback'] }, 'zh', '/');
	expect(s.nav.map((n) => [n.label, n.links ? undefined : n.href])).toEqual([
		['文档', '/zh/docs/'],
		['应用', '/zh/apps/'],
		['路线图', '/zh/roadmap/'],
		['反馈', 'https://github.com/owner/demo/issues'],
	]);
});

describe('pickLanguage', () => {
	const langs = [
		{ code: 'en', tag: 'en' },
		{ code: 'zh', tag: 'zh-CN' },
		{ code: 'zh-tw', tag: 'zh-TW' },
		{ code: 'pt', tag: 'pt-BR' },
	];
	test('matches tags, Chinese scripts and other regions', () => {
		expect(pickLanguage(['zh-CN'], langs)).toBe('zh');
		expect(pickLanguage(['zh-HK'], langs)).toBe('zh-tw');
		expect(pickLanguage(['zh'], langs)).toBe('zh');
		expect(pickLanguage(['pt-PT'], langs)).toBe('pt');
		expect(pickLanguage(['de-DE', 'en-GB'], langs)).toBe('en');
	});
	test('falls back to the first language', () => {
		expect(pickLanguage(['ja'], langs)).toBe('en');
		expect(pickLanguage(['zh-TW'], [{ code: 'ja', tag: 'ja' }, { code: 'zh', tag: 'zh-CN' }])).toBe('zh');
	});
});
