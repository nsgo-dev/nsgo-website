// One of the site's icons in icons.ts, or NSGo's logo, in the text's color.
import nsgoLogo from '../assets/nsgo.svg?url';
import { icons, type IconName } from '../icons';

export function Icon(props: { name: IconName | 'nsgo'; size?: string; class?: string; label?: string }) {
	return (
		<>
			{props.name === 'nsgo' ? (
				<img class={props.class} src={nsgoLogo} alt={props.label ?? ''} width="18" height="18" />
			) : (
				<svg
					class={['icon flex-none', props.class]}
					viewBox="0 0 24 24"
					fill="currentColor"
					width={props.size ?? '1em'}
					height={props.size ?? '1em'}
					aria-hidden={props.label ? undefined : 'true'}
					aria-label={props.label}
					role={props.label ? 'img' : undefined}
					innerHTML={icons[props.name]}
				/>
			)}
		</>
	);
}
