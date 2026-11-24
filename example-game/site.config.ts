// A template for a game engine's site in the demoscene look; the engine its
// pages describe is made up. The settings hold only the frame: the home
// page is the project's own, in src/components/Home.astro, so it may say
// and show whatever the engine needs.
import { defineSite } from 'nsgo-website/config';

const repo = 'https://github.com/nsgo-dev/nsgo-website';

export default defineSite({
	languages: ['en', 'zh'],
	name: 'Sample Engine',
	title: { en: 'Sample Engine: a game engine built with NSGo', zh: '示例引擎：用 NSGo 构建的游戏引擎' },
	description: {
		en: 'A made-up game engine that shows the demoscene look of an NSGo project’s website.',
		zh: '一个虚构的游戏引擎，用来展示 NSGo 项目网站的 Demoscene 外观。',
	},
	logo: './src/assets/logo.png',
	favicon: '/favicon.png',
	appleTouchIcon: '/apple-touch-icon.png',
	look: 'demoscene',
	repo,
	editLink: false,
	nav: [{ label: { en: 'Features', zh: '功能' }, href: '#features' }, 'docs', 'community', 'feedback'],
	docs: {
		dir: './docs',
		sidebar: [{ label: { en: 'Start', zh: '开始' }, items: ['docs', 'docs/quick-start'] }],
	},
	footer: { license: { label: { en: 'All rights reserved', zh: '保留所有权利' }, href: `${repo}/blob/main/LICENSE` } },
	home: false,
});
