// What every part of a page shares: its language, its path and the
// reader's choices.
import { createContext } from 'solid-js';
import type { Lang } from '../config';
import type { createLanguage, createTheme } from './prefs';

export interface PageContext {
	lang: () => Lang;
	/** The page's path under the site's base, as /zh/docs/. */
	pathname: () => string;
	theme: ReturnType<typeof createTheme>;
	language: ReturnType<typeof createLanguage> & { choose(value: string): void };
	/** Whether the page is the 404 page, which has no address of its own. */
	notFound: () => boolean;
}

export const Page = createContext<PageContext>();
