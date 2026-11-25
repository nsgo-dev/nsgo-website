// The modules the build makes of a project's settings and docs.
declare module 'virtual:nsgo-website/options' {
	const options: import('./config').SiteOptions;
	export default options;
	/** The address the site is served from, without its base. */
	export const site: string;
}
declare module 'virtual:nsgo-website/assets' {
	/** The images the settings name, by their paths there, as their built addresses. */
	export const images: Record<string, string>;
}
declare module 'virtual:nsgo-website/components' {
	/** The project's own components the settings name, by their paths there. */
	export const components: Record<string, import('solid-js').Component<{ lang: import('./config').Lang }>>;
}
declare module 'virtual:nsgo-website/icons' {
	/** The Kubai icons the site renders and animates, by name. */
	export const icons: Record<string, import('kubai-icons').KubaiIconData>;
}
declare module 'virtual:nsgo-website/styles' {}
declare module 'virtual:nsgo-website/roadmap' {
	/** The roadmap as GitHub had it at build, without the roadmap setting none. */
	export const roadmap: import('./roadmap').Roadmap | null;
}
declare module 'virtual:nsgo-website/stars' {
	/** The repository's stars at build, when GitHub told them. */
	export const stars: number | null;
}
declare module 'virtual:nsgo-website/docs' {
	export const index: import('./docs').DocsIndex;
	/** Each page's content by language and slug, as en:docs/quick-start. */
	export const pages: Record<string, () => Promise<{ default: import('./app/pages/docs-route').DocContent }>>;
}
declare module 'virtual:nsgo-website/code' {
	/** The home pages' code as HTML, by language, code language and code, each after a NUL. */
	export const code: Record<string, string>;
}
declare module '*?highlight' {
	/** The file's code, highlighted in both of the site's themes, as HTML for Split's html. */
	const html: string;
	export default html;
}
