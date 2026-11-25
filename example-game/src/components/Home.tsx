// The home page of a made-up game engine, a template to copy: the
// package's demoscene pieces with the engine's own words and pictures.
// Change, drop or add sections freely; nothing here comes from the settings.
import { Demo, Effect, Effects, End, Hero, Page, Parallax, Split, Ticker } from 'nsgo-website/components';
import { site } from 'nsgo-website/site';
import { For } from 'solid-js';
import frame from './frame.go?highlight';
import './Home.css';

const words = {
	en: {
		status: 'Sample project · not a real engine',
		headline: ['Real-time', 'is an art.'] as [string, string],
		lead: 'Sample Engine draws, moves and plays games from Go code, frame by frame. It is made up, to fill this template.',
		start: 'Start a game',
		chips: ['Windows', 'macOS', 'Linux', 'iOS'],
		ticker: ['Sample Engine', 'Written in Go', 'Real-time rendering', 'One project, every platform', 'Open source', 'Made up for this template'],
		features: { eyebrow: 'The engine', title: 'Six effects, one engine' },
		effects: [
			{ demo: 'tunnel', title: 'Rendering', text: 'Sprites, lights and shaders, drawn natively on every platform.' },
			{ demo: 'bounce', title: 'Physics', text: 'Bodies that fall, bounce and stack, stepped at a steady rate.' },
			{ demo: 'scope', title: 'Audio', text: 'Music and effects, mixed and placed around the player.' },
			{ demo: 'trail', title: 'Input', text: 'Gamepads, keys and touch read as one set of actions.' },
			{ demo: 'rotozoom', title: 'Platforms', text: 'One project builds for desktop, handheld and phone.' },
			{ demo: 'plasma', title: 'Hot reload', text: 'Change the code and see it while the game keeps running.' },
		] as const,
		code: { eyebrow: 'Usage', title: 'A frame in Go', text: 'A scene is a Go value; the engine calls it once a frame.' },
		end: { title: 'Built for NSGo', text: 'NSGo is a cross-platform native UI engine with a Go backend.', site: 'NSGo website' },
	},
	zh: {
		status: '示例项目 · 并非真实引擎',
		headline: ['实时，', '即艺术。'] as [string, string],
		lead: '示例引擎用 Go 代码一帧一帧地绘制、驱动和播放游戏。它是虚构的，只为填充这个模板。',
		start: '开始做游戏',
		chips: ['Windows', 'macOS', 'Linux', 'iOS'],
		ticker: ['示例引擎', '用 Go 编写', '实时渲染', '一个项目，所有平台', '开源', '为模板虚构'],
		features: { eyebrow: '引擎', title: '六种效果，一个引擎' },
		effects: [
			{ demo: 'tunnel', title: '渲染', text: '精灵、光照和着色器，在每个平台上原生绘制。' },
			{ demo: 'bounce', title: '物理', text: '会下落、弹起和堆叠的物体，以稳定的步长模拟。' },
			{ demo: 'scope', title: '音频', text: '音乐和音效，混合后摆放在玩家周围。' },
			{ demo: 'trail', title: '输入', text: '手柄、键盘和触摸，统一读作一组动作。' },
			{ demo: 'rotozoom', title: '多平台', text: '一个项目构建桌面、掌机和手机版本。' },
			{ demo: 'plasma', title: '热重载', text: '改了代码，游戏不停就能看到。' },
		] as const,
		code: { eyebrow: '用法', title: '用 Go 写一帧', text: '场景就是一个 Go 值，引擎每帧调用它一次。' },
		end: { title: '为 NSGo 而建', text: 'NSGo 是以 Go 为后端的跨平台原生 UI 引擎。', site: 'NSGo 官网' },
	},
};

export function Home(props: { lang: 'en' | 'zh' }) {
	const s = () => site[props.lang];
	const w = () => words[props.lang];
	return (
		<Page>
			<Demo effect="stars" width={480} height={300} class="sky" />
			<div class="home">
				<Hero
					lang={props.lang}
					status={w().status}
					headline={w().headline}
					lead={w().lead}
					actions={[
						{ label: w().start, href: 'docs/quick-start/' },
						{ label: 'GitHub', href: s().repo, icon: 'github' },
					]}
					chips={w().chips}
					visual={<Demo effect="knot" width={280} height={280} drag class="knot" />}
				/>
				<Ticker items={w().ticker} />
				<Effects id="features" eyebrow={w().features.eyebrow} title={w().features.title}>
					<For each={w().effects}>{(e) => <Effect demo={e.demo} title={e.title} text={e.text} />}</For>
				</Effects>
				<Split lang={props.lang} eyebrow={w().code.eyebrow} title={w().code.title} text={w().code.text} html={frame} />
				<Parallax speed={-0.06} class="finale">
					<End
						lang={props.lang}
						logo="nsgo"
						title={w().end.title}
						text={w().end.text}
						actions={[
							{ label: w().end.site, href: 'https://nsgo.dev' },
							{ label: 'GitHub', href: 'https://github.com/nsgo-dev/nsgo', icon: 'github' },
						]}
					/>
				</Parallax>
				<div class="ground" aria-hidden="true">
					<Demo effect="terrain" width={360} height={120} class="terrain" />
				</div>
			</div>
		</Page>
	);
}
