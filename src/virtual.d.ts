// The modules the integration makes of a project's settings.
declare module 'virtual:nsgo-website/options' {
	const options: import('./config').SiteOptions;
	export default options;
}
declare module 'virtual:nsgo-website/assets' {
	/** The components the settings name, by their paths there. */
	export const components: Record<string, import('astro/runtime/server/index.js').AstroComponentFactory>;
	/** The images the settings name, by their paths there. */
	export const images: Record<string, ImageMetadata>;
}
declare module 'virtual:nsgo-website/icons' {
	/** The Kubai icons the site renders and animates, by name. */
	export const icons: Record<string, import('kubai-icons').KubaiIconData>;
}
