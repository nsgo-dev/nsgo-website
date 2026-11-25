// A choice's Kubai icon in its color, or a language's mark in its color.
import { KIcon } from '../KIcon';
import type { Choice } from './choices';

export function ChoiceIcon(props: { choice: Choice; size?: number }) {
	return (
		<>
			{props.choice.icon ? (
				<KIcon name={props.choice.icon} size={props.size ?? 16} color={props.choice.color} />
			) : (
				<span class="lang-tag inline-grid place-items-center flex-none size-4 rounded-4 bg-[color-mix(in_srgb,var(--tag)_14%,transparent)] text-(--tag) text-[0.5rem] font-700 leading-none" style={{ '--tag': props.choice.color }}>
					{props.choice.mark}
				</span>
			)}
		</>
	);
}
