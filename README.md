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
  The website of an NSGo project as one Astro integration: a home page, bilingual docs, a roadmap from GitHub issues and the shared header and footer, all from the project's own settings.
</p>

## Install

The package ships its TypeScript and Astro sources and needs Astro 7 and Bun. Add it to the project's site folder from GitHub:

```sh
bun add astro github:nsgo-dev/nsgo-website
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

`astro.config.mjs` hands them to the integration, and `src/content.config.ts` declares the docs:

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

`languages` picks the site's languages, English and Chinese unless set: any of en, zh, zh-tw, ja, ko, es, fr, de, pt, ru, it, vi, id and tr, whose header, footer and roadmap words the package has. The first is served at the root and each other under its code. Any text, list or section may be one value for every language or one per language, as `{ en, zh }`; a language left out takes the first's. The docs are Markdown in one folder per language code, under `../docs/public` by default. [`src/config.ts`](src/config.ts) documents every setting.

`sponsors` adds a sponsors page, linked last in the header's navigation (`nav` may place it elsewhere) and at the footer's end, of the project's own tiers, each with its title and a layout: `featured` cards, large or small logos, `service` for a logo with what a company gives instead of money (such as CI), `avatar` or `name`. `maintainers` puts the people readers sponsor atop the page as cards, as GitHub Sponsors does. `home` puts a tier on the home page too, and `places` invites sponsors to its open places; a full tier keeps its sponsors, shows them all and only warns at build.

The footer links the project's license, MIT unless `footer.license` names another. An agent setting up a site must give there the license in the project's own repository, never one the project does not use.

To change more than the settings allow:

- **Home page**: give `home.visual` or a `component` section an `.astro` file of the project's, or set `home: false` and write `src/pages/index.astro` and `src/pages/<code>/index.astro` from `HomePage` or the section components.
- **Own pages**: wrap any content in `Page` from `nsgo-website/components` under `src/pages/` and `src/pages/<code>/`, and list it in `nav` beside the package's own links.
- **Colors and words**: `customCss` overrides the variables of [`tokens.css`](src/styles/tokens.css), `strings` the header's and footer's words, and `starlight` any Starlight setting.

`nsgo-website-share-cards` draws `public/share/<code>.png`, the images of shared links, from the settings; it needs Chrome.

[`example/`](example) is a complete site, this repository's own, describing a made-up app with sample docs.

## Development

```sh
bun install
bun test        # the settings' defaults
bun run check   # types of the package and the example
bun run build   # builds the example into example/dist
bun run dev     # serves the example
```

A project's `dev` script runs `astro dev --ignore-lock`, as Astro otherwise moves its server to the background when an AI agent starts it. The roadmap reads GitHub with `GITHUB_TOKEN` or the GitHub CLI's sign-in; a build without either leaves it out, and a tracking issue that does not exist hides it with its links. See [ARCHITECTURE.md](ARCHITECTURE.md) and [AGENTS.md](AGENTS.md). Changes are in [CHANGELOG.md](CHANGELOG.md).

## License

© nsgo-dev. The source is published for reading only; see [LICENSE](LICENSE).
