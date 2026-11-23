// This repository's own site, as an example of every part of the settings;
// the app its pages describe and its docs are made up. astro.config.mjs and
// the share-cards command both read this file.
import { defineSite } from 'nsgo-website/config';

const repo = 'https://github.com/nsgo-dev/nsgo-website';

export default defineSite({
	// The site's languages, the first at the root; any of en, zh, zh-tw, ja,
	// ko, es, fr, de, pt, ru, it, vi, id and tr may be added.
	languages: ['en', 'zh'],
	name: 'NSGO',
	title: { en: 'Sample Notes: a notes app built with NSGo', zh: '示例笔记：用 NSGo 构建的笔记应用' },
	description: {
		en: 'A made-up notes app that shows every part of an NSGo project’s website: notes in plain text, kept on the device and found as you type.',
		zh: '一个虚构的笔记应用，用来展示 NSGo 项目网站的各个部分：纯文本笔记，保存在设备上，边输入边查找。',
	},
	logo: './src/assets/logo.png',
	appleTouchIcon: '/apple-touch-icon.png',
	repo,
	// The docs here are samples, not the repository's.
	editLink: false,
	// The package's links, with the project's own demo page among them.
	nav: ['features', 'docs', { label: { en: 'Demo', zh: '演示' }, href: 'demo/' }, 'roadmap', 'community', 'feedback', 'sponsors'],
	accounts: [{ label: 'Sample Notes', note: '@sample_notes', href: 'https://x.com/sample_notes', icon: 'x.com' }],
	community: [
		{ label: 'NSGo', note: { en: 'The UI engine Sample Notes is built on', zh: '示例笔记所用的 UI 引擎' }, href: 'https://nsgo.dev', icon: 'nsgo' },
		{ label: { en: 'NSGo Telegram', zh: 'NSGo Telegram 群组' }, note: '@nsgo_dev', href: 'https://t.me/nsgo_dev', icon: 'telegram' },
		{ label: 'Awesome NSGo', note: { en: 'Apps, libraries and resources', zh: '应用、库和资源' }, href: 'https://awesomensgo.dev/', icon: 'star' },
	],
	docs: {
		dir: './docs',
		sidebar: [
			{ label: { en: 'Start', zh: '开始' }, items: ['docs', 'docs/quick-start'] },
			{ label: { en: 'Guides', zh: '指南' }, items: ['docs/guides/editing'] },
		],
	},
	roadmap: { tracking: 1 },
	// Made-up sponsors in every layout; their links go to example.com.
	sponsors: {
		// NSGo's own people, whom readers sponsor through GitHub Sponsors.
		maintainers: [
			{ name: 'ONEO', login: 'oneo-me', avatar: './src/assets/sponsors/oneo-me.jpg', text: { en: 'Founder, building NSGo since its first line of code', zh: '创始人，从第一行代码开始打造 NSGo' } },
			{ name: '小莫', login: 'houko', avatar: './src/assets/sponsors/houko.png', text: { en: 'Core driver, taking NSGo into its fastest growth', zh: '核心推动者，带 NSGo 进入高速发展' } },
		],
		// The project's own tiers, in order, each with its own title; gold
		// also shows on the home page, with ten places.
		tiers: [
			{
				title: { en: 'Gold sponsors', zh: '金牌赞助商' },
				layout: 'featured',
				home: true,
				places: 10,
				sponsors: [
					{
						name: 'Northwind',
						href: 'https://example.com',
						image: './src/assets/sponsors/northwind.svg',
						imageDark: './src/assets/sponsors/northwind-dark.svg',
						text: { en: 'Cloud folders for teams', zh: '团队云文件夹' },
					},
					{ name: 'Lumen Labs', href: 'https://example.com', image: './src/assets/sponsors/lumen.svg', text: { en: 'Fonts for small screens', zh: '为小屏幕设计的字体' } },
				],
			},
			{
				title: { en: 'Silver sponsors', zh: '银牌赞助商' },
				layout: 'large',
				sponsors: [
					{ name: 'Orbit', href: 'https://example.com', image: './src/assets/sponsors/orbit.svg' },
					{ name: 'Kestrel', href: 'https://example.com', image: './src/assets/sponsors/kestrel.svg' },
					{ name: 'Fernway', href: 'https://example.com', image: './src/assets/sponsors/fernway.svg' },
					{ name: 'Quarry', href: 'https://example.com', image: './src/assets/sponsors/quarry.svg' },
				],
			},
			{
				title: { en: 'Bronze sponsors', zh: '铜牌赞助商' },
				layout: 'small',
				sponsors: [
					{ name: 'Tidewater', href: 'https://example.com', image: './src/assets/sponsors/tidewater.svg' },
					{ name: 'Brightloop', href: 'https://example.com', image: './src/assets/sponsors/brightloop.svg' },
					{ name: 'Cobalt', href: 'https://example.com', image: './src/assets/sponsors/cobalt.svg' },
					{ name: 'Mapleforge', href: 'https://example.com', image: './src/assets/sponsors/mapleforge.svg' },
					{ name: 'Sundial', href: 'https://example.com', image: './src/assets/sponsors/sundial.svg' },
					{ name: 'Pillar', image: './src/assets/sponsors/pillar.svg' },
				],
			},
			{
				title: { en: 'In-kind sponsors', zh: '服务赞助商' },
				layout: 'service',
				sponsors: [
					{ name: 'Relay CI', href: 'https://example.com', image: './src/assets/sponsors/relay.svg', text: { en: 'Build machines for CI', zh: '为 CI 提供构建机器' } },
					{ name: 'Harbor', href: 'https://example.com', image: './src/assets/sponsors/harbor.svg', text: { en: 'Hosting for downloads', zh: '托管下载文件' } },
				],
			},
			{
				title: { en: 'Backers', zh: '个人赞助者' },
				layout: 'avatar',
				sponsors: [
					{ name: 'Alex Chen', href: 'https://example.com', image: './src/assets/sponsors/avatar-alex.svg' },
					{ name: 'Mira Patel', href: 'https://example.com', image: './src/assets/sponsors/avatar-mira.svg' },
					{ name: 'Jonas Berg', href: 'https://example.com', image: './src/assets/sponsors/avatar-jonas.svg' },
					{ name: 'Sofia Rossi', image: './src/assets/sponsors/avatar-sofia.svg' },
					{ name: 'Kenji Sato', href: 'https://example.com', image: './src/assets/sponsors/avatar-kenji.svg' },
					{ name: 'Lena Novak', image: './src/assets/sponsors/avatar-lena.svg' },
					{ name: 'Diego Ruiz', href: 'https://example.com', image: './src/assets/sponsors/avatar-diego.svg' },
					{ name: 'Ava Kim', image: './src/assets/sponsors/avatar-ava.svg' },
				],
			},
			{
				title: { en: 'Supporters', zh: '支持者' },
				layout: 'name',
				sponsors: [
					{ name: 'Priya Nair', href: 'https://example.com' },
					{ name: 'Tom Walsh' },
					{ name: 'Yuki Mori' },
					{ name: 'Omar Haddad', href: 'https://example.com' },
					{ name: 'Clara Weiss' },
					{ name: 'Lucas Martin' },
					{ name: 'Hana Park' },
				],
			},
		],
	},
	// This repository's own license, which is not the default MIT.
	footer: { license: { label: { en: 'All rights reserved', zh: '保留所有权利' }, href: `${repo}/blob/main/LICENSE` } },
	share: {
		visual: `<div class="window"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div class="list"><b class="on"></b><b></b><b></b></div><div class="note"><b class="title"></b><b></b><b></b><b class="short"></b></div></div></div>`,
		css: `.window { border: 1.5px solid var(--border); border-radius: 28px; overflow: hidden; background: var(--surface); box-shadow: 0 40px 80px -40px rgb(16 24 40 / 0.45); }
.bar { display: flex; gap: 9px; padding: 16px 18px; border-bottom: 1.5px solid var(--border); }
.bar i { width: 14px; height: 14px; border-radius: 50%; background: var(--border-strong); }
.body { display: grid; grid-template-columns: 2fr 3fr; aspect-ratio: 16 / 9; }
.list, .note { display: grid; align-content: start; gap: 16px; padding: 24px; }
.list { border-right: 1.5px solid var(--border); }
.list b { height: 36px; border-radius: 10px; background: var(--border); }
.list b.on { background: #4da3ff; }
.note b { height: 14px; border-radius: 7px; background: var(--border-strong); }
.note b.title { width: 60%; height: 22px; background: var(--text); }
.note b.short { width: 55%; }`,
	},
	home: {
		status: { en: 'Sample project · not a real app', zh: '示例项目 · 并非真实应用' },
		headline: { en: ['Notes that stay', 'out of your way.'], zh: ['安静的笔记，', '随手就能记。'] },
		lead: {
			en: 'Sample Notes keeps plain-text notes on your device, finds them as you type and syncs them through a folder you choose. It is made up, to fill this example.',
			zh: '示例笔记把纯文本笔记保存在设备上，边输入边查找，并通过你选的文件夹同步。它是虚构的，只为填充这个示例。',
		},
		chips: ['macOS', 'Windows', 'Linux', 'iOS'],
		visual: './src/components/NotesMock.astro',
		sections: {
			en: [
				{
					type: 'features',
					id: 'features',
					eyebrow: 'The app',
					title: 'Everything a note needs',
					items: [
						{ icon: 'file-text', title: 'Plain text', text: 'Every note is a Markdown file you can open in any editor.' },
						{ icon: 'search', title: 'Instant search', text: 'Notes are found by title and text as you type.' },
						{ icon: 'list-checks', title: 'Checklists', text: 'Tick items off without leaving the keyboard.' },
						{ icon: 'folder-sync', title: 'Folder sync', text: 'Point it at any synced folder to see the same notes everywhere.' },
						{ icon: 'moon', title: 'Light and dark', text: 'Follows the system’s appearance or keeps your own.' },
						{ icon: 'languages', title: 'Many languages', text: 'The interface speaks the languages of the system.' },
					],
				},
				{
					type: 'split',
					eyebrow: 'Usage',
					title: 'A few lines of Go',
					text: 'Sample Notes is an NSGo app: its views are written in Go and drawn natively on every platform.',
					items: [
						{ icon: 'code', title: 'State as signals', text: 'The open note and the search are signals the views read.' },
						{ icon: 'rocket', title: 'Hot reload', text: 'Changes to a view show while the app runs.' },
						{ icon: 'puzzle', title: 'One codebase', text: 'The same code builds the app for every platform.' },
					],
					code: { lang: 'go', code: usage() },
				},
				{
					type: 'cards',
					eyebrow: 'Platforms',
					title: 'Four platforms, one app',
					items: [
						{ icon: 'laptop', title: 'macOS', text: 'Apple silicon and Intel.' },
						{ icon: 'app-window', title: 'Windows', text: 'x64 and arm64.' },
						{ icon: 'terminal', title: 'Linux', text: 'x64 with Wayland or X11.' },
						{ icon: 'smartphone', title: 'iOS', text: 'iPhone and iPad.' },
					],
				},
				{
					type: 'end',
					logo: 'nsgo',
					title: 'Built for NSGo',
					text: 'NSGo is a cross-platform native UI engine with a Go backend.',
					actions: [
						{ label: 'NSGo website', href: 'https://nsgo.dev' },
						{ label: 'GitHub', href: 'https://github.com/nsgo-dev/nsgo', icon: 'github' },
					],
				},
			],
			zh: [
				{
					type: 'features',
					id: 'features',
					eyebrow: '应用',
					title: '笔记需要的一切',
					items: [
						{ icon: 'file-text', title: '纯文本', text: '每条笔记都是一个 Markdown 文件，任何编辑器都能打开。' },
						{ icon: 'search', title: '即时搜索', text: '边输入边按标题和正文找到笔记。' },
						{ icon: 'list-checks', title: '清单', text: '不离开键盘就能勾掉事项。' },
						{ icon: 'folder-sync', title: '文件夹同步', text: '指向任意同步文件夹，在每台设备上看到同样的笔记。' },
						{ icon: 'moon', title: '浅色和深色', text: '跟随系统外观，或保持你自己的选择。' },
						{ icon: 'languages', title: '多种语言', text: '界面使用系统的语言。' },
					],
				},
				{
					type: 'split',
					eyebrow: '用法',
					title: '几行 Go 代码',
					text: '示例笔记是一个 NSGo 应用：视图用 Go 编写，在每个平台上原生绘制。',
					items: [
						{ icon: 'code', title: '状态即信号', text: '打开的笔记和搜索都是视图读取的信号。' },
						{ icon: 'rocket', title: '热重载', text: '应用运行时就能看到视图的改动。' },
						{ icon: 'puzzle', title: '一套代码', text: '同一份代码构建每个平台的应用。' },
					],
					code: { lang: 'go', code: usage() },
				},
				{
					type: 'cards',
					eyebrow: '平台',
					title: '四个平台，一个应用',
					items: [
						{ icon: 'laptop', title: 'macOS', text: 'Apple 芯片和 Intel。' },
						{ icon: 'app-window', title: 'Windows', text: 'x64 和 arm64。' },
						{ icon: 'terminal', title: 'Linux', text: 'x64，Wayland 或 X11。' },
						{ icon: 'smartphone', title: 'iOS', text: 'iPhone 和 iPad。' },
					],
				},
				{
					type: 'end',
					logo: 'nsgo',
					title: '为 NSGo 而建',
					text: 'NSGo 是以 Go 为后端的跨平台原生 UI 引擎。',
					actions: [
						{ label: 'NSGo 官网', href: 'https://nsgo.dev' },
						{ label: 'GitHub', href: 'https://github.com/nsgo-dev/nsgo', icon: 'github' },
					],
				},
			],
		},
	},
});

/** The usage the home page shows. */
function usage() {
	return `func Root(cx *core.Scope) core.Node {
	notes := store.Open(cx, "~/Notes")
	return core.View{Children: []core.Node{
		notes.List{},
		ui.Button{Text: "New note", OnPress: notes.New},
	}}
}`;
}
