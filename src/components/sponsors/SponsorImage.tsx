// A sponsor's logo or avatar, with its dark-theme logo in its place when it
// has one.
import { Show } from 'solid-js';
import { images } from 'virtual:nsgo-website/assets';
import type { ResolvedSponsor } from '../../resolve';

export function SponsorImage(props: { sponsor: ResolvedSponsor; height: number; decorative?: boolean; class: string }) {
	const alt = () => (props.decorative ? '' : props.sponsor.name);
	return (
		<>
			<Show when={props.sponsor.image}>
				{(image) => <img class={['sponsor-image', props.class, { 'theme-light': !!props.sponsor.imageDark }]} src={images[image()]} alt={alt()} height={props.height} />}
			</Show>
			<Show when={props.sponsor.imageDark}>{(dark) => <img class={`sponsor-image theme-dark ${props.class}`} src={images[dark()]} alt={alt()} height={props.height} />}</Show>
		</>
	);
}
