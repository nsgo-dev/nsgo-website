# Settings

The settings are the only contract between the package and a project, so their shape decides what a project can change without forking the package.

## One value or one per language

Any value may be one per language, as `{ en, zh }`, at any depth: a word, a list or a whole home page. `localize` resolves an object whose keys are all language codes, so a setting never names its languages in its own type, and a project splits a value only where its languages differ. A language left out takes the first language's value, so turning on a language never breaks a site, only leaves parts untranslated. A real setting must therefore never consist only of keys that are language codes, such as `id`.

## Data, not code

The settings must survive `JSON.stringify`, because the integration hands them to the pages as a virtual module. Anything that is code (a component, an image, an icon) is named by a path or name, and the integration generates the imports. This is also why the package's own words with templates, such as the roadmap's counts, live in `locales.ts` and only their plain strings can be overridden.

## Defaults

`resolveSite` fills every default in one place for one language, so the header, footer, menu pane and share cards agree on what a site shows. A part the settings turn off, such as the roadmap or feedback, disappears from every link list at once.
