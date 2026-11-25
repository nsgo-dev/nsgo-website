// The header's language and theme menus. Each reads the reader's choice
// itself, as they hydrate on their own once the page is idle.
import { useContext } from 'solid-js';
import { Page } from '../../app/context';
import { site } from '../../site';
import { KIcon } from '../KIcon';
import { colors, languageChoices, themeChoices } from './choices';
import { HeaderMenu } from './HeaderMenu';

export function LanguageMenu() {
	const page = useContext(Page);
	return (
		<HeaderMenu
			class="max-sm:hidden!"
			label={site[page.lang()].t.language.name}
			items={languageChoices(page.lang())}
			value={page.language.choice()}
			onChange={(v) => page.language.choose(v)}
			icon={<KIcon name="languages" size={18} color={colors.languages} />}
		/>
	);
}

export function ThemeMenu() {
	const page = useContext(Page);
	return (
		<HeaderMenu
			class="max-sm:hidden!"
			label={site[page.lang()].t.theme.name}
			items={themeChoices(page.lang())}
			value={page.theme.choice()}
			onChange={(v) => page.theme.set(v as never)}
			icon={
				<span class="theme-icon grid place-items-center">
					<span class="when-light hidden in-data-[theme-choice=light]:grid">
						<KIcon name="sun" size={18} color={colors.sun} />
					</span>
					<span class="when-dark hidden in-data-[theme-choice=dark]:grid">
						<KIcon name="moon" size={18} color={colors.moon} />
					</span>
					<span class="when-auto hidden in-data-[theme-choice=auto]:grid">
						<KIcon name="monitor" size={18} color={colors.monitor} />
					</span>
				</span>
			}
		/>
	);
}
