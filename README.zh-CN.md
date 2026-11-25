<h1 align="center">NSGo Website</h1>

<p align="center">
  <strong>简体中文</strong> |
  <a href="README.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/oneo-me"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-oneo--me-181717?logo=github&logoColor=white"></a>
  <a href="https://oneo.me"><img alt="博客" src="https://img.shields.io/badge/%E5%8D%9A%E5%AE%A2-oneo.me-0969da"></a>
  <a href="https://x.com/oneo666"><img alt="X" src="https://img.shields.io/badge/X-%40oneo666-000000?logo=x&logoColor=white"></a>
  <a href="https://github.com/sponsors/oneo-me"><img alt="GitHub 赞助" src="https://img.shields.io/badge/GitHub%20%E8%B5%9E%E5%8A%A9-ea4aaa?logo=githubsponsors&logoColor=white"></a>
</p>

<p align="center">
  基于 TanStack Start、Solid 和 ui-sdk 的 NSGo 项目网站：首页、可搜索的双语文档、来自 GitHub issue 的路线图，以及共用的页头和页脚，全部由项目自己的设置生成，渲染成静态页面，页面之间切换不用重新加载。
</p>

## 安装

这个包直接发布 TypeScript 和 Solid 源码，需要 Vite 8 和 Bun。在项目的网站文件夹里从 GitHub 安装：

```sh
bun add vite github:nsgo-dev/nsgo-website
```

## 用法

一个站点只需要三个小文件。`site.config.ts` 放设置：

```ts
import { defineSite } from 'nsgo-website/config';

export default defineSite({
	name: 'NSGo Pet',
	title: { en: 'NSGo Pet: a desktop pet', zh: 'NSGo Pet：桌面宠物' },
	description: 'A desktop pet built with NSGo.',
	logo: './src/assets/logo.png',
	repo: 'https://github.com/oneo-me/nsgo-pet',
	docs: { sidebar: [{ label: { en: 'Start', zh: '开始' }, items: ['docs', 'docs/quick-start'] }] },
	roadmap: { tracking: 2 },
	home: {
		headline: { en: ['A desktop pet', 'for everyone.'], zh: ['桌面宠物，', '人人都能养。'] },
		lead: 'It lives on your desktop.',
		sections: [{ type: 'features', id: 'features', title: 'Features', items: [{ icon: 'heart', title: 'Cute', text: 'Very.' }] }],
	},
});
```

`vite.config.ts` 把设置和站点的访问地址交给插件，`tsconfig.json` 引入 Solid 的 JSX 和路由的类型：

```ts
import { defineConfig } from 'vite';
import nsgoWebsite from 'nsgo-website';
import site from './site.config.ts';

export default defineConfig({ base: '/nsgo-pet/', plugins: [nsgoWebsite(site, { site: 'https://oneo-me.github.io' })] });
```

```json
{ "extends": "nsgo-website/tsconfig", "include": ["**/*"], "files": ["node_modules/.nsgo-website/routeTree.gen.ts"], "exclude": ["dist", "node_modules"] }
```

`vite build` 把站点写到 `dist`，可以直接发布到 GitHub Pages：每个页面一份 HTML，外加 `404.html` 和搜索索引。

`languages` 选择站点的语言，不设时是英文和中文。可选 en、zh、zh-tw、ja、ko、es、fr、de、pt、ru、it、vi、id 和 tr，包里已备好这些语言的页头、页脚和路线图文字。第一种语言放在根路径，其他语言放在各自代码下。任何文字、列表或分区都可以是所有语言共用的一个值，也可以按语言分别写，如 `{ en, zh }`；没写到的语言用第一种语言的值。文档是按语言代码分文件夹的 Markdown，默认在 `../docs/public` 下。每项设置的说明见 [`src/config.ts`](src/config.ts)。

`look: 'demoscene'` 把整个站点做成实时计算机艺术（Demoscene）的样子，适合游戏引擎和游戏：深色主题黑底琥珀色，浅色主题白底 NSGo 蓝，等宽字体、方角、线框很少，不用发光和渐变。首页由项目自己编写，用 `nsgo-website/components` 里的 `Effects`、`Effect`、`Ticker`、`Demo` 和 `Parallax` 拼成：`Demo` 用当前主题的强调色实时绘制经典特效（可拖动的环面结、等离子、隧道、地形、星空等），并做抖动处理；`logoDark` 给出深色主题用的标志。[`example-game/`](example-game) 是可以照抄的模板。

`sponsors` 会加上赞助页，入口在页头导航的最后一项（`nav` 可调整位置）和页脚最右端。档位由项目自己定义，每档写标题和显示方式：`featured` 卡片，大号或小号 Logo，`service` 是 Logo 加一句它用什么代替出钱（如 CI），以及 `avatar` 头像或 `name` 名称。`maintainers` 在页面顶部用卡片展示可赞助的人，和 GitHub Sponsors 一样。`home` 让这一档也上首页，`places` 为空位邀请赞助；名额满了仍保留已有赞助商、全部显示，只在构建时警告。

页脚链接项目的许可证，没用 `footer.license` 指定别的时显示 MIT。替项目搭站点的 Agent 必须在这里写项目自己仓库里的许可证，不能用项目没有采用的许可证。

设置之外还想改的：

- **首页**：给 `home.visual` 或 `component` 分区指定项目自己的 Solid 组件（`.tsx`）；或者设 `home: false`，用 `HomePage` 或各分区组件自己写 `src/routes/index.tsx` 和 `src/routes/<代码>/index.tsx`。
- **首页上的代码**：`Split` 可以展示项目自己的代码，写法是 `import html from './file.go?highlight'`，在构建时高亮。
- **自定义页面**：在 `src/routes/` 和 `src/routes/<代码>/` 下添加 TanStack Router 路由，用 `nsgo-website/components` 的 `Page` 包住内容，用 `pageHead` 给出标题和分享卡片，再把它和包自带的链接一起列进 `nav`。
- **颜色和文字**：`customCss` 覆盖 [`tokens.css`](src/styles/tokens.css) 里的变量，`strings` 改页头页脚的文字。
- **样式**：项目自己在 `src/` 下的组件可以使用站点主题里的 Tailwind 类，如 `bg-surface`、`text-muted`，也可以用自己的 CSS 文件。

`nsgo-website-share-cards` 按设置画出分享链接用的 `public/share/<代码>.png`，需要 Chrome。

[`example/`](example) 是一个完整站点，也是本仓库自己的站点，介绍一个虚构应用，配上示例文档；[`example-game/`](example-game) 是一个虚构游戏引擎的站点，用 Demoscene 外观。

## 开发

```sh
bun install
bun test          # 设置的默认值和文档侧边栏
bun run build     # 把两个示例分别构建到各自的 dist
bun run check     # 包和两个示例的类型，需先构建
bun run dev       # 运行示例
bun run dev:game  # 运行游戏引擎模板
```

路线图用 `GITHUB_TOKEN` 或 GitHub CLI 的登录读取 GitHub；两者都没有时，构建会跳过它；追踪 Issue 不存在时，路线图和它的链接都会隐藏。搜索只在构建后的站点里可用，开发服务器上不可用。另见 [ARCHITECTURE.md](ARCHITECTURE.md) 和 [AGENTS.md](AGENTS.md)。更新记录见 [CHANGELOG.md](CHANGELOG.md)。

## 许可证

© nsgo-dev。源码仅供阅读，详见 [LICENSE](LICENSE)。
