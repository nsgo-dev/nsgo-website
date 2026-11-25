// Class lists more than one component shares, so each part of the site
// looks one way wherever it shows.

/** The width every row of the site keeps, as the header's. */
export const container = 'w-full max-w-[76rem] mx-auto px-5 md:px-8';

/** A button of the header's actions, around an icon and maybe a word; with iconSoft or iconFilled, and its padding. */
export const iconButton = 'icon-button inline-flex flex-none items-center justify-center gap-1.5 min-w-[2.125rem] h-[2.125rem] rounded-10 text-13 font-550 whitespace-nowrap transition-colors duration-150';
export const iconSoft = 'text-muted hover:bg-surface hover:text-ink';
export const iconFilled = 'bg-surface text-ink hover:bg-surface-2';

/** A soft square button of the header that opens a menu. */
export const menuTrigger = 'menu-trigger inline-grid place-items-center w-[2.125rem] h-[2.125rem] p-0 rounded-10 bg-surface text-ink transition-colors duration-200 hover:bg-surface-2 data-open:bg-surface-2';

/** The card of every menu, opening from where it was pressed. */
export const popupList =
	'popup-list z-60 grid m-0 p-1 overflow-y-auto overscroll-contain border border-line rounded-12 bg-page text-ink shadow-popup transition-[opacity,transform] duration-[160ms] ease-site focus-visible:outline-none motion-reduce:transition-none';

/** A row of a menu's card, with its padding and gap. */
export const popupItem = 'flex items-center w-full rounded-8 text-13 text-start outline-none cursor-pointer data-highlighted:bg-surface-2';

/** A caret that turns over while its menu is open. */
export const caret = 'caret transition-[rotate] duration-200 ease-site in-data-open:rotate-180';

/** A button of the hero, the end card and the sponsors page. */
export const button =
	'button inline-flex items-center justify-center gap-2 border rounded-site font-600 whitespace-nowrap transition-[translate,scale,background-color,border-color,box-shadow] duration-300 ease-site active:translate-y-px active:scale-[0.98] [&_.external]:opacity-60 [&>svg:last-child:not(:first-child)]:transition-[translate] [&>svg:last-child:not(:first-child)]:duration-300 [&>svg:last-child:not(:first-child)]:ease-site hover:[&>svg:last-child:not(:first-child)]:translate-x-0.5';

/** A button's size: the usual one, and the hero's. */
export const buttonSize = 'h-11 px-[1.125rem] text-15';
export const buttonLarge = 'h-13 px-[1.375rem] text-base';

/** The filled button, its top edge lit over a shadow tinted by the accent. */
export const primary =
	'primary border-transparent bg-accent text-on-accent bg-[linear-gradient(rgb(255_255_255/0.16),transparent)] shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_1px_2px_color-mix(in_srgb,var(--accent)_30%,transparent),0_8px_20px_-6px_color-mix(in_srgb,var(--accent)_55%,transparent)] hover:bg-accent-strong hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_1px_2px_color-mix(in_srgb,var(--accent)_30%,transparent),0_12px_28px_-8px_color-mix(in_srgb,var(--accent)_65%,transparent)]';

/** The outlined button. */
export const secondary = 'secondary border-line bg-page text-ink shadow-site hover:border-line-strong';

/** A page's words under its title, with its own width. */
export const lead = 'lead text-muted text-[clamp(1.0625rem,1rem+0.3vw,1.1875rem)] leading-[1.6] text-pretty';

/** A row of buttons, centered. */
export const ctaCenter = 'cta center flex flex-wrap justify-center gap-3';

/** Chinese and Japanese headings keep their letters apart, which other scripts draw closer. */
export const cjkTracking = '[:is(:lang(zh),:lang(ja))_&]:tracking-[-0.01em]';

/** A menu's card as tall as there is room for. */
export const popupHeight = 'max-h-(--available-height,70vh)';

/** A section of the home page, with its padding. */
export const section = 'section py-16 lg:py-28';

/** A heading of a section or the end card. */
export const sectionTitle = 'm-0 text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-700 tracking-[-0.025em] leading-[1.15] text-balance';

/** The small line above a section's title. */
export const eyebrow = 'eyebrow mb-3 text-accent text-13 font-650 tracking-[0.04em] uppercase';

/** An element that rises into place, a little after the one before it, as --i sets. */
export const rise = 'rise animate-rise [animation-delay:calc(var(--i,0)*70ms)]';

/** A highlight's title and words. */
export const itemTitle = 'mb-1.5 text-base font-650';
export const itemText = 'text-muted text-15 leading-[1.55]';
