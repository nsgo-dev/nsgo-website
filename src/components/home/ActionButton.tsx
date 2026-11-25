// A button of the hero or the end card. A link that leaves the site ends in
// the external mark; one within it, when filled, in an arrow.
import { Show } from 'solid-js';
import type { Lang } from '../../config';
import type { ResolvedAction } from '../../resolve';
import { hrefIn } from '../../site';
import { Icon } from '../Icon';
import { button, buttonLarge, buttonSize, primary, secondary } from '../ui';

export function ActionButton(props: { lang: Lang; action: ResolvedAction; index: number; large?: boolean }) {
	const variant = () => props.action.variant ?? (props.index === 0 ? 'primary' : 'secondary');
	const link = () => hrefIn(props.action.href, props.lang);
	return (
		<a class={[button, props.large ? buttonLarge : buttonSize, variant() === 'primary' ? primary : secondary]} href={link().href} {...(link().external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
			<Show when={props.action.icon}>{(icon) => <Icon name={icon()} size="1.05rem" />}</Show>
			{props.action.label}
			{link().external ? (
				<Icon name="external" size={variant() === 'secondary' ? '0.85rem' : '0.9rem'} class={variant() === 'secondary' ? 'external' : undefined} />
			) : (
				variant() === 'primary' && <Icon name="right-arrow" size="1rem" />
			)}
		</a>
	);
}
