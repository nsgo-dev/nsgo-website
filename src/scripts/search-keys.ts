// The search results as a command palette: one row is always picked, the
// arrow keys and the pointer move it, and Enter opens it.
const root = document.querySelector<HTMLElement>('#starlight__search');

// A row is a page's title or one of its sections; a section's own title is
// inside it, so the section is looked for first.
const rowOf = (el: Element) =>
	el.closest<HTMLElement>('.pagefind-ui__result-nested') ?? el.closest<HTMLElement>('.pagefind-ui__result-title');

function rows(): HTMLElement[] {
	if (!root) return [];
	return [...root.querySelectorAll('.pagefind-ui__result-link')].map(rowOf).filter((row): row is HTMLElement => !!row);
}

function pick(row: HTMLElement | undefined, scroll: boolean) {
	root?.querySelector('[data-picked]')?.removeAttribute('data-picked');
	if (!row) return;
	row.setAttribute('data-picked', '');
	if (scroll) row.scrollIntoView({ block: 'nearest' });
}

if (root) {
	// A new query picks its first result once the results arrive.
	root.addEventListener('input', () => pick(undefined, false));
	new MutationObserver(() => {
		if (!root.querySelector('[data-picked]')) pick(rows()[0], false);
	}).observe(root, { childList: true, subtree: true });

	// Moving, not entering, so that rows scrolling under a still pointer keep
	// the keys' choice.
	root.addEventListener('mousemove', (event) => {
		const row = event.target instanceof Element ? rowOf(event.target) : null;
		if (row && !row.hasAttribute('data-picked') && rows().includes(row)) pick(row, false);
	});

	root.addEventListener('keydown', (event) => {
		if (event.isComposing) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			const list = rows();
			if (!list.length) return;
			event.preventDefault();
			const at = list.findIndex((row) => row.hasAttribute('data-picked'));
			const next = event.key === 'ArrowDown' ? Math.min(at + 1, list.length - 1) : Math.max(at - 1, 0);
			pick(list[next], true);
		} else if (event.key === 'Enter') {
			const link = root.querySelector<HTMLAnchorElement>('[data-picked] .pagefind-ui__result-link');
			if (!link) return;
			event.preventDefault();
			link.click();
		}
	});
}
