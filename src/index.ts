// The integration: Starlight set up as an NSGo project's site, its home,
// roadmap and sponsors pages, and the settings handed to the pages through
// virtual modules.
import { createRequire } from 'node:module';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import type { AstroIntegration } from 'astro';
import type { SiteOptions } from './config';
import { locales } from './locales';
import { loadRoadmap } from './roadmap';
import { assetsOf, languagesOf, localize, resolveSite, starlightSidebar } from './resolve';

export type * from './config';
export { defineSite } from './config';

const pkg = 'nsgo-website';
const require = createRequire(import.meta.url);

const modules = {
	options: 'virtual:nsgo-website/options',
	assets: 'virtual:nsgo-website/assets',
	icons: 'virtual:nsgo-website/icons',
};

/** The modules the pages read the settings from. */
function settings(options: SiteOptions, root: string) {
	const file = (path: string) => JSON.stringify(isAbsolute(path) ? path : resolve(root, path));
	const { components, images, icons } = assetsOf(options);
	const { starlight: _, ...json } = options;
	const source: Record<string, () => string> = {
		[modules.options]: () => `export default ${JSON.stringify(json)};`,
		[modules.assets]: () =>
			[
				...components.map((c, i) => `import c${i} from ${file(c)};`),
				...images.map((m, i) => `import m${i} from ${file(m)};`),
				`export const components = {${components.map((c, i) => `${JSON.stringify(c)}: c${i}`).join(', ')}};`,
				`export const images = {${images.map((m, i) => `${JSON.stringify(m)}: m${i}`).join(', ')}};`,
			].join('\n'),
		[modules.icons]: () =>
			[
				...icons.map((name, i) => {
					let path: string;
					try {
						path = require.resolve(`kubai-icons/icons/${name}`);
					} catch {
						throw new Error(`nsgo-website: Kubai Icons has no icon named "${name}"`);
					}
					return `import k${i} from ${JSON.stringify(path)};`;
				}),
				`export const icons = {${icons.map((name, i) => `${JSON.stringify(name)}: k${i}`).join(', ')}};`,
			].join('\n'),
	};
	return {
		name: 'nsgo-website:settings',
		resolveId(id: string) {
			if (id in source) return `\0${id}`;
		},
		load(id: string) {
			if (id.startsWith('\0') && id.slice(1) in source) return source[id.slice(1)]();
		},
	};
}

/** The site of an NSGo project, from its settings. */
export default function nsgoWebsite(given: SiteOptions): AstroIntegration {
	return {
		name: pkg,
		hooks: {
			'astro:config:setup': async ({ command, config, updateConfig, injectRoute }) => {
				const root = fileURLToPath(config.root);
				const base = config.base.replace(/\/$/, '');
				// A roadmap whose tracking issue does not exist is left out, with
				// its page and links, as if the setting were not there.
				let options = given;
				const roadmap = resolveSite(options, languagesOf(options)[0], base).roadmap;
				if (roadmap && (await loadRoadmap(roadmap)).status === 'missing') {
					console.warn(`[roadmap] left out: ${roadmap.owner}/${roadmap.name}#${roadmap.tracking} not found`);
					options = { ...options, roadmap: false };
				}
				// A tier's places are kept by the sponsors in it, so a full tier
				// shows them all and only warns.
				for (const tier of options.sponsors ? options.sponsors.tiers : []) {
					if (tier.places !== undefined && tier.sponsors.length > tier.places) {
						console.warn(`[sponsors] ${localize(tier.title, languagesOf(options)[0])} has ${tier.sponsors.length} sponsors for ${tier.places} places`);
					}
				}
				const docsDir = options.docs?.dir ?? '../docs/public';
				const langs = languagesOf(options);
				const [first, ...others] = langs;
				const component = (name: string) => `${pkg}/components/starlight/${name}.astro`;
				updateConfig({
					// Pages end in a slash, as GitHub Pages serves them; the dev
					// server's image endpoint, /_image, would 404 under 'always'.
					trailingSlash: command === 'dev' ? 'ignore' : 'always',
					devToolbar: { enabled: false },
					vite: { plugins: [settings(options, root)], ssr: { noExternal: [pkg] } },
					integrations: [
						starlight({
							title: options.name,
							description: localize(options.description, first),
							favicon: options.favicon ?? '/favicon.svg',
							defaultLocale: 'root',
							locales: Object.fromEntries([
								['root', { label: locales[first].label, lang: locales[first].tag }],
								...others.map((l) => [l, { label: locales[l].label, lang: locales[l].tag }]),
							]),
							social: [{ icon: 'github', label: 'GitHub', href: options.repo }],
							...(options.docs?.sidebar ? { sidebar: starlightSidebar(options.docs.sidebar, langs) as never } : {}),
							// The docs live outside src/content/docs, so Starlight's
							// Markdown features are turned on there too.
							markdown: { processedDirs: [docsDir] },
							routeMiddleware: `${pkg}/share`,
							// Code as the home page shows it: the same themes in a soft
							// frame, without a title bar, even for shell commands, and
							// with the system's own scrollbars. Its surface is set in
							// docs.css, from the site's own colors.
							expressiveCode: {
								themes: ['one-dark-pro', 'one-light'],
								defaultProps: { frame: 'code' },
								useThemedScrollbars: false,
								styleOverrides: {
									borderRadius: '0.625rem',
									codeFontSize: '0.8125rem',
									codeLineHeight: '1.7',
									codePaddingBlock: '1rem',
									codePaddingInline: '1.25rem',
									frames: {
										shadowColor: 'transparent',
										inlineButtonBorderOpacity: '0',
										inlineButtonBackgroundIdleOpacity: '0',
										inlineButtonBackgroundHoverOrFocusOpacity: '0.12',
										inlineButtonBackgroundActiveOpacity: '0.2',
									},
								},
							},
							// A look other than the default goes over the package's own
							// styles and under the project's.
							customCss: [
								`${pkg}/styles/tokens.css`,
								`${pkg}/styles/shell.css`,
								`${pkg}/styles/docs.css`,
								...(options.look && options.look !== 'default' ? [`${pkg}/styles/${options.look}.css`] : []),
								...(options.customCss ?? []),
							],
							components: {
								Head: component('Head'),
								Header: `${pkg}/components/shell/SiteHeader.astro`,
								PageFrame: component('PageFrame'),
								TwoColumnContent: component('TwoColumnContent'),
								MobileTableOfContents: component('MobileTableOfContents'),
								MobileMenuToggle: component('Empty'),
								MobileMenuFooter: component('Empty'),
								ContentPanel: component('ContentPanel'),
								MarkdownContent: component('MarkdownContent'),
								PageTitle: component('PageTitle'),
								Footer: component('Footer'),
								EditLink: component('EditLink'),
							},
							head: options.appleTouchIcon ? [{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}${options.appleTouchIcon}` } }] : [],
							...options.starlight,
						}),
					],
				});
				// One route per language; the pages tell their language by their path.
				const prefixes = langs.map((l) => (l === first ? '' : `/${l}`));
				for (const prefix of prefixes) {
					if (options.home) injectRoute({ pattern: `${prefix}/`, entrypoint: `${pkg}/routes/home.astro` });
					if (options.roadmap) injectRoute({ pattern: `${prefix}/roadmap/`, entrypoint: `${pkg}/routes/roadmap.astro` });
					if (options.sponsors) injectRoute({ pattern: `${prefix}/sponsors/`, entrypoint: `${pkg}/routes/sponsors.astro` });
				}
			},
			'astro:config:done': ({ injectTypes }) => {
				injectTypes({ filename: 'types.d.ts', content: `/// <reference types="${pkg}/virtual" />` });
			},
		},
	};
}
