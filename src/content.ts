/// <reference path="./virtual.d.ts" />
// The docs collection, for a project's src/content.config.ts:
//
//   import { docsCollection } from 'nsgo-website/content';
//   export const collections = { docs: docsCollection() };
//
// The docs live with the project, in one folder per language named by its
// code (docs.dir, ../docs/public by default); each is served under that
// language's docs path, so with English first en/packs.md becomes
// docs/packs/ and zh/packs.md zh/docs/packs/.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import options from 'virtual:nsgo-website/options';
import { languagesOf } from './resolve';

export function docsCollection() {
	const langs = languagesOf(options);
	const prefix = Object.fromEntries(langs.map((l, i) => [l, i === 0 ? 'docs' : `${l}/docs`]));
	const folders = langs.length > 1 ? `{${langs.join(',')}}` : langs[0];
	return defineCollection({
		loader: glob({
			base: options.docs?.dir ?? '../docs/public',
			pattern: `${folders}/**/[^_]*.{md,mdx}`,
			generateId: ({ entry }) => {
				const [lang, ...rest] = entry.replace(/\.mdx?$/, '').split('/');
				const page = rest.join('/').replace(/(^|\/)index$/, '');
				return [prefix[lang], page].filter(Boolean).join('/');
			},
		}),
		// home: a page that lays out its own sections, as the home page.
		schema: docsSchema({ extend: z.object({ home: z.boolean().optional() }) }),
	});
}
