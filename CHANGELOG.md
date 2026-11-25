# Changelog

## [Unreleased]

- Add the `nsgoWebsite` Vite plugins on TanStack Start, Solid and ui-sdk: a home page, searchable docs, a roadmap from GitHub and the shared header and footer.
- Style the site with Tailwind CSS in the site's own theme, whose classes a project's own components may use too.
- Render every page to static HTML that moves to other pages without reloading and loads its menus' code only once idle.
- Add the `languages` setting to serve a site in any of 14 languages with the frame's words translated.
- Add `home` sections, `nav`, `footer`, `strings` and `customCss` settings to shape a project's site.
- Add `Page`, `pageHead`, `HomePage` and the home section components for a project's own pages, and `?highlight` imports for their code.
- Add the `sponsors` setting for a sponsors page of the project's own tiers, with maintainers' cards, home tiers and invitations to open places.
- Add the `look: 'demoscene'` setting, real-time computer art in amber on black or NSGo's blue on white, with its components and the `example-game` template.
- Add the `logoDark` setting for a logo on the dark theme.
- Add the `nsgo-website-share-cards` command to draw share images in the site's look.
- Show the repository's stars on the header's GitHub button and frost the page scrolling under the header.
- Fit the site to phones: a menu with the language and theme, the doc's title opening its pages, full-screen search and a centered footer.
- Lay out a roadmap stage of one area across the row, its tasks as lanes packed like a waterfall (#4 by @oneo-me).
- Show code blocks in One Dark and One Light on the site's surface, with a quiet title row, a copy button and long blocks scrolling inside.
