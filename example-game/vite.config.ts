import { defineConfig } from 'vite';
import nsgoWebsite from 'nsgo-website';
import site from './site.config.ts';

// As example/: a subpath on GitHub Pages and in a local build, the root on
// the dev server.
const dev = process.argv.includes('dev');

export default defineConfig({
	base: process.env.BASE ?? (dev ? '/' : '/nsgo-website/game/'),
	plugins: [nsgoWebsite(site, { site: process.env.SITE ?? 'https://nsgo-dev.github.io' })],
});
