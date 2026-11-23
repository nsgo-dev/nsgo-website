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
  把 NSGo 项目的网站做成一个 Astro 集成：首页、双语文档、来自 GitHub issue 的路线图，以及共用的页头和页脚，全部由项目自己的设置生成。
</p>

## 安装

这个包直接发布 TypeScript 和 Astro 源码，需要 Astro 7 和 Bun。在项目的网站文件夹里从 GitHub 安装：

```sh
bun add astro github:nsgo-dev/nsgo-website
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

`astro.config.mjs` 把设置交给集成，`src/content.config.ts` 声明文档：

```js
import { defineConfig } from 'astro/config';
import nsgoWebsite from 'nsgo-website';
import site from './site.config.ts';

export default defineConfig({ site: 'https://oneo-me.github.io', base: '/nsgo-pet', integrations: [nsgoWebsite(site)] });
```

```ts
import { docsCollection } from 'nsgo-website/content';
export const collections = { docs: docsCollection() };
```

`languages` 选择站点的语言，不设时是英文和中文。可选 en、zh、zh-tw、ja、ko、es、fr、de、pt、ru、it、vi、id 和 tr，包里已备好这些语言的页头、页脚和路线图文字。第一种语言放在根路径，其他语言放在各自代码下。任何文字、列表或分区都可以是所有语言共用的一个值，也可以按语言分别写，如 `{ en, zh }`；没写到的语言用第一种语言的值。文档是按语言代码分文件夹的 Markdown，默认在 `../docs/public` 下。每项设置的说明见 [`src/config.ts`](src/config.ts)。

页脚链接项目的许可证，没用 `footer.license` 指定别的时显示 MIT。替项目搭站点的 Agent 必须在这里写项目自己仓库里的许可证，不能用项目没有采用的许可证。

设置之外还想改的：

- **首页**：给 `home.visual` 或 `component` 分区指定项目自己的 `.astro` 文件；或者设 `home: false`，用 `HomePage` 或各分区组件自己写 `src/pages/index.astro` 和 `src/pages/<代码>/index.astro`。
- **自定义页面**：在 `src/pages/` 和 `src/pages/<代码>/` 下用 `nsgo-website/components` 的 `Page` 包住任意内容，再把它和包自带的链接一起列进 `nav`。
- **颜色和文字**：`customCss` 覆盖 [`tokens.css`](src/styles/tokens.css) 里的变量，`strings` 改页头页脚的文字，`starlight` 改任意 Starlight 设置。

`nsgo-website-share-cards` 按设置画出分享链接用的 `public/share/<代码>.png`，需要 Chrome。

[`example/`](example) 是一个完整站点，也是本仓库自己的站点，介绍一个虚构应用，配上示例文档。

## 开发

```sh
bun install
bun test        # 设置的默认值
bun run check   # 包和示例的类型
bun run build   # 把示例构建到 example/dist
bun run dev     # 运行示例
```

项目的 `dev` 脚本要写成 `astro dev --ignore-lock`，否则被 AI 代理启动时，Astro 会把服务器转到后台。路线图用 `GITHUB_TOKEN` 或 GitHub CLI 的登录读取 GitHub；两者都没有时，构建会跳过它；追踪 Issue 不存在时，路线图和它的链接都会隐藏。另见 [ARCHITECTURE.md](ARCHITECTURE.md) 和 [AGENTS.md](AGENTS.md)。更新记录见 [CHANGELOG.md](CHANGELOG.md)。

## 许可证

© nsgo-dev。源码仅供阅读，详见 [LICENSE](LICENSE)。
