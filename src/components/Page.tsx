// A page of the site's own layout, outside the docs, between the shared
// header and footer: a project makes its own pages with it under
// src/routes/, and under src/routes/<code>/ for each other language, with
// pageHead for their titles.
import type { JSX } from '@solidjs/web';

export function Page(props: { class?: string; search?: boolean; children?: JSX.Element }) {
	return (
		<main id="main" class={['page', props.class]} {...(props.search ? { 'data-pagefind-body': '' } : {})}>
			{props.children}
		</main>
	);
}
