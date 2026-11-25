# NSGo Website

Vite plugins, on TanStack Start, Solid and ui-sdk, that build an NSGo project's website from its settings. Read ARCHITECTURE.md before coding.

## Principles

- The package owns the implementation; a project only gives settings, docs and its own components. Keep anything a second project would also need in the package, behind a setting with a sensible default.
- A new setting goes in `src/config.ts` with a comment for its reader; changing or removing one breaks every site using it and needs the user's approval.
- Keep every language of `locales.ts` saying the same thing.

## Working with the user

- Do not create sub-Agents or Git worktrees; work directly in the current checkout.
- Ask before changing dependencies or the settings' public shape.
- Commit and push only when asked. Changes for a project's site belong in that project's repository.

## Verification

Run the commands in README Development; all must pass. After visual changes, look at the example in a browser.

## Documentation

- Update a document only when a fact its reader needs changes.
- Avoid secondary labels and descriptions that restate a heading or value; let the layout explain.
- Write only what code and comments cannot show: purpose, boundaries and reasons, not names, fields, defaults or step-by-step behavior.
- Keep each document within its budget; check its size after editing it and trim it before handing off when it is over.
- Record completed user-visible outcomes as one-clause `Unreleased` bullets with references crediting each pull request's author, such as `(#12 by @alice)`, ordered by type and merging related ones. Before the first release, write `Unreleased` as the first version's notes.
- Repair documents you touch instead of only appending to them.
- Keep `README.md` and `README.zh-CN.md` equivalent; everything else, including code comments, is English.
- Keep documentation on the code branch and reconcile it during merges.
