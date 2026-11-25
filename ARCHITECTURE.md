# NSGo Website architecture

Vite plugins that turn a project's settings into its whole site: TanStack Start with Solid renders every page to HTML at build, and the browser takes the pages over so that moving between them never reloads. The package writes the routes, hands the settings and the docs to the pages through virtual modules and indexes the docs for search. The project keeps only its settings, its docs and whatever pages or components it wants of its own.

## Code map

| Path | Responsibility |
| --- | --- |
| `src/index.ts` | The plugins: the routes written per page and language, the virtual modules, prerendering and the search index |
| `src/config.ts` | The settings' types, the package's public contract |
| `src/resolve.ts`, `src/docs.ts` | Settings to one language's content, and the docs' sidebar, with defaults; pure |
| `src/locales.ts` | Every language a site may turn on, with the frame's own words in it |
| `src/site.ts` | Every language resolved under the site's base, for the pages |
| `src/build/markdown.ts` | The docs' Markdown and code to HTML, once per build |
| `src/roadmap.ts`, `src/stars.ts` | The roadmap and the stars from GitHub, read once per build |
| `src/app/` | The root route, the router, each page's route data and the page shell's state |
| `src/components/` | Pages, home sections, the demoscene look's pieces, the shell and the docs' parts, in Solid, styled with Tailwind's classes |
| `src/styles/` | Tailwind's theme drawn from `tokens.css`, the Markdown the build writes, and each look over them |
| `bin/share-cards.ts` | Draws the share images with headless Chrome |
| `example/` | A complete site that builds and type-checks the package |
| `example-game/` | A game engine's site in the demoscene look, its home page its own |
| `design/` | Scenra drafts of the default look's pages in its light theme, drawn from the example |

## Boundaries

- Nothing in `src/` names a project; every project fact comes from the settings, and the frame's words from `locales.ts`.
- `resolve.ts` and `docs.ts` import no Vite, Solid or virtual module, so the plugins, the pages, the share-cards command and the tests share them.
- Files the settings name (components, images, Kubai icons) are imported only through the generated `virtual:nsgo-website/*` modules.
- What GitHub or the docs' files say is read at build into modules; nothing is fetched in the browser but pages' own chunks and the search index.
- A route's file imports its page's data and head from `app/pages/<page>-route.ts` and its component from `<page>.tsx`, so the router loads a page's code only with the page.
- Interactive parts that ui-sdk draws hydrate on their own once the page is idle, inside `<Hydrate>`, so their code stays out of the first load. A part inside `<Hydrate>` reads what changes from context or the router, never from props, which `<Hydrate>` fixes at its first value.
- The first language's pages sit at the root and each other's under its code; links in the settings are written as the first language has them and `resolveHref` places them.
- Components style themselves with Tailwind's classes and keep a plain class of their own, such as `.hero`, for a look or a project's CSS to reach. The theme knows only the site's own values, so every class means one of them.
- CSS files hold only what no class can: the variables a project changes, the HTML the build writes, and the looks.
- Adding a language to `locales.ts` means giving it every word of `UI`; a test holds every language to English's keys. A build carries only the site's own languages.

## Core flows

**Build.** Creating the plugins writes one small route file per page and language under the project's `node_modules/.nsgo-website`, with the project's own `src/routes` mounted beside them; Vite's config hook then reads the roadmap, dropping its routes when GitHub cannot find the tracking issue. TanStack Start builds the client and the renderer, prerenders every page it was given and every page their links reach into `dist`, and Pagefind indexes the docs there.

**Moving between pages.** The shell sends clicks on the site's own links, those of docs' Markdown included, through the router and preloads a page while the pointer rests on its link. A docs page's content is its own chunk, loaded with the page.

**Roadmap.** The roadmap is read from the tracking issue's sub-issues through GitHub's GraphQL API. Without a token a local build shows a notice, while a build under `CI` fails rather than publish an empty roadmap.

## Verification

`bun test` covers `resolve.ts` and `docs.ts`. `bun run build` builds both examples, and `bun run check` then type-checks the package through them, against the routes the build wrote; look at the example's pages in a browser after changing components or CSS.

## Subjects

| Document | When to read |
| --- | --- |
| [Settings](docs/architecture/settings.md) | Adding or changing a setting |
