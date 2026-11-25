// The footer every page shares, home and docs alike: one line, the
// copyright with the code's license on the left, the key links on the
// right and, in the corner, the sponsors page.
import { For, Show } from 'solid-js';
import type { Lang } from '../../config';
import { site } from '../../site';
import { Icon } from '../Icon';
import { KIcon } from '../KIcon';
import { container } from '../ui';

const footerLink = 'inline-flex items-center text-muted transition-colors duration-150 hover:text-ink';

export function SiteFooter(props: { lang: Lang }) {
	const f = () => site[props.lang].footer;
	return (
		<footer class="site-footer mt-auto py-6 text-muted text-13 leading-[1.5]">
			<div class={`footer-row ${container} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 max-sm:justify-center max-sm:text-center`}>
				<p class="footer-copyright flex flex-wrap gap-2 text-faint max-sm:justify-center">
					{f().copyright}
					<Show when={f().license}>
						{(license) => (
							<a class="text-faint transition-colors duration-150 hover:text-ink" href={license().href} target="_blank" rel="noopener noreferrer">
								{license().label}
							</a>
						)}
					</Show>
				</p>
				<ul class="footer-links flex flex-wrap gap-x-5 gap-y-1 max-sm:justify-center">
					<For each={f().links}>
						{(link) => (
							<li>
								<a class={`${footerLink} gap-1`} href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
									{link.label}
									<Show when={link.external}>
										<Icon name="external" size="0.7rem" class="external text-faint" />
									</Show>
								</a>
							</li>
						)}
					</For>
					<Show when={f().sponsors}>
						{(sponsors) => (
							<li>
								<a class={`footer-sponsors ${footerLink} gap-1.5`} href={sponsors().href} data-kubai-trigger>
									<KIcon name="heart" size={14} color="#ec4899" />
									{sponsors().label}
								</a>
							</li>
						)}
					</Show>
				</ul>
			</div>
		</footer>
	);
}
