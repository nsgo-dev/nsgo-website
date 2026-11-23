# NSGo Website architecture

An Astro integration that turns a project's settings into its whole site. It sets up Starlight with the package's own header, footer and page frame, injects the home, roadmap and sponsors pages, and hands the settings to every page through virtual modules. The project keeps only its settings, its docs and whatever pages or components it wants of its own.

## Code map

| Path | Responsibility |
| --- | --- |
| `src/index.ts` | The integration: Starlight's settings, injected routes and the virtual modules |
| `src/config.ts` | The settings' types, the package's public contract |
| `src/resolve.ts` | Settings to one language's content, with defaults; pure |
| `src/locales.ts` | Every language a site may turn on, with the frame's own words in it |
| `src/site.ts` | Both languages resolved under the site's base, for the pages |
| `src/content.ts`, `src/share.ts`, `src/roadmap.ts` | The docs collection, share-card meta tags, the roadmap from GitHub |
| `src/components/` | Pages, home sections, the shell and Starlight overrides |
| `bin/share-cards.ts` | Draws the share images with headless Chrome |
| `example/` | A complete site that builds and type-checks the package |

## Boundaries

- Nothing in `src/` names a project; every project fact comes from the settings, and the frame's words from `locales.ts`.
- `resolve.ts` imports no Astro or virtual module, so the integration, the pages, the share-cards command and the tests share it.
- Files the settings name (components, images, Kubai icons) are imported only through the generated `virtual:nsgo-website/assets` and `icons` modules; `icons` alone reaches the browser, so it must never import components.
- The first language's pages sit at the root and each other's under its code; links in the settings are written as the first language has them and `resolveHref` places them.
- Adding a language to `locales.ts` means giving it every word of `UI`; a test holds every language to English's keys.
- Starlight is configured only in `src/index.ts`; a project's `starlight` setting goes over it last.

## Core flows

**Build.** `astro:config:setup` adds Starlight with the overrides, registers the Vite plugin that serves the virtual modules and injects the home, roadmap and sponsors pages once per language when those settings exist; each page tells its language by its path. Pages call `site[lang]` for their content.

**Roadmap.** The roadmap page reads the tracking issue's sub-issues once per build through GitHub's GraphQL API. Without a token a local build shows a notice, while a build under `CI` fails rather than publish an empty roadmap. A tracking issue GitHub cannot find leaves the roadmap out instead: the integration checks it before injecting routes and drops the page and its links.

## Verification

`bun test` covers `resolve.ts`. `bun run check` type-checks the package through the example, and `bun run build` builds it; look at the example's pages in a browser after changing components or CSS.

## Subjects

| Document | When to read |
| --- | --- |
| [Settings](docs/architecture/settings.md) | Adding or changing a setting |
