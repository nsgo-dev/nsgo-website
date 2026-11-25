// The reader's theme and language choices, kept in the browser: the boot
// script reads them before the page shows, and the header's menus change
// them here.
import { createSignal } from 'solid-js';

export type ThemeChoice = 'auto' | 'light' | 'dark';

const root = () => document.documentElement;
const system = () => matchMedia('(prefers-color-scheme: light)');

/** The theme the reader chose, auto until the page has mounted. */
export function createTheme() {
	const [choice, setChoice] = createSignal<ThemeChoice>('auto', { ownedWrite: true });
	const apply = (value: ThemeChoice) => {
		root().dataset.themeChoice = value;
		root().dataset.theme = value === 'auto' ? (system().matches ? 'light' : 'dark') : value;
	};
	return {
		choice,
		/** Reads the stored choice and follows the system's while it is automatic. */
		mount() {
			setChoice((root().dataset.themeChoice as ThemeChoice) || 'auto');
			const follow = () => choice() === 'auto' && apply('auto');
			system().addEventListener('change', follow);
			return () => system().removeEventListener('change', follow);
		},
		set(value: ThemeChoice) {
			localStorage.setItem('site-theme', value === 'auto' ? '' : value);
			setChoice(value);
			apply(value);
		},
	};
}

/** The language the reader chose: auto, following the browser, or a language's code. */
export function createLanguage() {
	const [choice, setChoice] = createSignal('auto', { ownedWrite: true });
	return {
		choice,
		mount() {
			setChoice(root().dataset.languageChoice || 'auto');
		},
		set(value: string) {
			localStorage.setItem('site-language', value);
			root().dataset.languageChoice = value;
			setChoice(value);
		},
	};
}
