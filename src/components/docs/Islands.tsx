// The docs page's parts that hydrate on their own once the page is idle:
// each reads the page it is on itself, so it follows the reader from page
// to page without its code in the page's first load.
import { useLoaderData } from '@tanstack/solid-router';
import { createMemo, useContext } from 'solid-js';
import { index } from 'virtual:nsgo-website/docs';
import { Page } from '../../app/context';
import type { DocData } from '../../app/pages/docs-route';
import type { Lang } from '../../config';
import { sidebarOf } from '../../app/sidebar';
import { docIn } from '../../docs';
import { first, site } from '../../site';
import { DocPicker } from './DocPicker';
import { Sidebar } from './Sidebar';
import { useCurrentHeading } from './Toc';
import { TocMenu } from './TocMenu';

const useDoc = () => useLoaderData({ strict: false }) as () => DocData;

export function DocsSidebar(props: { lang: Lang }) {
	const page = useContext(Page);
	const entries = createMemo(() => sidebarOf(props.lang));
	return <Sidebar entries={entries()} here={page.pathname()} />;
}

export function DocsPicker(props: { lang: Lang }) {
	const page = useContext(Page);
	const data = useDoc();
	const entries = createMemo(() => sidebarOf(props.lang));
	const title = () => docIn(index, data().slug, props.lang, first)?.label ?? data().doc.title;
	return <DocPicker title={title()} label={site[props.lang].t.docs.pages} entries={entries()} here={page.pathname()} />;
}

export function DocsTocMenu(props: { lang: Lang }) {
	const data = useDoc();
	const headings = () => data().doc.headings;
	const current = useCurrentHeading(headings);
	const t = () => site[props.lang].t.docs;
	return <TocMenu title={t().toc} overview={t().overview} headings={headings()} current={current()} />;
}
