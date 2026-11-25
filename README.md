<h1 align="center">NSGo Website</h1>

<p align="center">
  <strong>English</strong> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/oneo-me"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-oneo--me-181717?logo=github&logoColor=white"></a>
  <a href="https://oneo.me"><img alt="Blog" src="https://img.shields.io/badge/Blog-oneo.me-0969da"></a>
  <a href="https://x.com/oneo666"><img alt="X" src="https://img.shields.io/badge/X-%40oneo666-000000?logo=x&logoColor=white"></a>
  <a href="https://github.com/sponsors/oneo-me"><img alt="GitHub Sponsors" src="https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?logo=githubsponsors&logoColor=white"></a>
</p>

<p align="center">
  The website of an NSGo project on TanStack Start, Solid and ui-sdk: a home page, bilingual docs with search, a roadmap from GitHub issues and the shared header and footer, all from the project's own settings, rendered to static pages that move between each other without reloading.
</p>

## Install

The package ships its TypeScript and Solid sources and needs Vite 8 and Bun. Add it to the project's site folder from GitHub:

```sh
bun add vite github:nsgo-dev/nsgo-website
```

## Usage

A site is three small files. `site.config.ts` holds the settings:

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

`vite.config.ts` hands them to the plugins with the address the site is served from, and `tsconfig.json` brings Solid's JSX and the routes' types:

```ts
import { defineConfig } from 'vite';
import nsgoWebsite from 'nsgo-website';
import site from './site.config.ts';

export default defineConfig({ base: '/nsgo-pet/', plugins: [nsgoWebsite(site, { site: 'https://oneo-me.github.io' })] });
```

```json
{ "extends": "nsgo-website/tsconfig", "include": ["**/*"], "files": ["node_modules/.nsgo-website/routeTree.gen.ts"], "exclude": ["dist", "node_modules"] }
```

`vite build` writes the site to `dist`, ready for GitHub Pages: every page as HTML, a `404.html` and the search index.

`languages` picks the site's languages, English and Chinese unless set: any of en, zh, zh-tw, ja, ko, es, fr, de, pt, ru, it, vi, id and tr, whose header, footer and roadmap words the package has. The first is served at the root and each other under its code. Any text, list or section may be one value for every language or one per language, as `{ en, zh }`; a language left out takes the first's. The docs are Markdown in one folder per language code, under `../docs/public` by default. [`src/config.ts`](src/config.ts) documents every setting.

`look: 'demoscene'` dresses the whole site as real-time computer art for game engines and games: amber on black in the dark theme, NSGo's blue on white in the light, monospaced type, square corners, few lines and no glow or gradient. Its home page is the project's own, built from `Effects`, `Effect`, `Ticker`, `Demo` and `Parallax` in `nsgo-website/components`: `Demo` draws classic effects (a knot the reader can drag, plasma, a tunnel, terrain, stars and more) in real time, dithered in the theme's accent; `logoDark` gives a logo for the dark theme. [`example-game/`](example-game) is a template to copy.

`sponsors` adds a sponsors page, linked last in the header's navigation (`nav` may place it elsewhere) and at the footer's end, of the project's own tiers, each with its title and a layout: `featured` cards, large or small logos, `service` for a logo with what a company gives instead of money (such as CI), `avatar` or `name`. `maintainers` puts the people readers sponsor atop the page as cards, as GitHub Sponsors does. `home` puts a tier on the home page too, and `places` invites sponsors to its open places; a full tier keeps its sponsors, shows them all and only warns at build.

The footer links the project's license, MIT unless `footer.license` names another. An agent setting up a site must give there the license in the project's own repository, never one the project does not use.

To change more than the settings allow:

- **Home page**: give `home.visual` or a `component` section a Solid component of the project's (`.tsx`), or set `home: false` and write `src/routes/index.tsx` and `src/routes/<code>/index.tsx` from `HomePage` or the section components.
- **Code on the home page**: a `Split` shows the project's own code from `import html from './file.go?highlight'`, highlighted at build.
- **Own pages**: add TanStack Router routes under `src/routes/` and `src/routes/<code>/`, wrap their content in `Page` from `nsgo-website/components`, give them `pageHead` for their titles and share cards, and list them in `nav` beside the package's own links.
- **Colors and words**: `customCss` overrides the variables of [`tokens.css`](src/styles/tokens.css), and `strings` the header's and footer's words.
- **Styles**: a project's own components under `src/` may use Tailwind's classes in the site's theme, such as `bg-surface` or `text-muted`, or CSS files of their own.

`nsgo-website-share-cards` draws `public/share/<code>.png`, the images of shared links, from the settings; it needs Chrome.

[`example/`](example) is a complete site, this repository's own, describing a made-up app with sample docs; [`example-game/`](example-game) is a made-up game engine's in the demoscene look.

## Development

```sh
bun install
bun test          # the settings' defaults and the docs' sidebar
bun run build     # builds both examples into their dist
bun run check     # types of the package and both examples, after a build
bun run dev       # serves the example
bun run dev:game  # serves the game engine template
```

The roadmap reads GitHub with `GITHUB_TOKEN` or the GitHub CLI's sign-in; a build without either leaves it out, and a tracking issue that does not exist hides it with its links. Search works on the built site, not on the dev server. See [ARCHITECTURE.md](ARCHITECTURE.md) and [AGENTS.md](AGENTS.md). Changes are in [CHANGELOG.md](CHANGELOG.md).

## License

© nsgo-dev. The source is published for reading only; see [LICENSE](LICENSE).
