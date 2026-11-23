import { defineConfig } from 'astro/config';
import nsgoWebsite from 'nsgo-website';
import site from './site.config.ts';

// GitHub Pages serves the site under the repository's name; a deploy may
// pass the address it was given in SITE and BASE, and a local build uses the
// same path so that links are checked under a subpath too. The dev server
// serves it at the root, where a browser opens it.
const dev = process.argv.includes('dev');

export default defineConfig({
	site: process.env.SITE ?? 'https://nsgo-dev.github.io',
	base: process.env.BASE ?? (dev ? '/' : '/nsgo-website'),
	integrations: [nsgoWebsite(site)],
});
