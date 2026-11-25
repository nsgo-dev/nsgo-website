// A docs page's data and head, apart from its component so that the
// component loads with the page rather than with every page.
import { notFound } from '@tanstack/solid-router';
import { pages } from 'virtual:nsgo-website/docs';
import type { Heading } from '../../build/markdown';
import type { Lang } from '../../config';
import { first } from '../../site';
import { pageHead } from '../head';

export interface DocContent {
	title: string;
	description?: string;
	html: string;
	headings: Heading[];
	edit: string;
}

const slugOf = (splat: string | undefined) => ['docs', (splat ?? '').replace(/^\/|\/$/g, '')].filter(Boolean).join('/');

export async function load(lang: Lang, splat: string | undefined) {
	const slug = slugOf(splat);
	const own = pages[`${lang}:${slug}`];
	const loader = own ?? pages[`${first}:${slug}`];
	if (!loader) throw notFound();
	return { slug, fallback: !own, doc: (await loader()).default };
}

export type DocData = Awaited<ReturnType<typeof load>>;

export function head(lang: Lang, ctx: { loaderData?: DocData }) {
	const d = ctx.loaderData;
	if (!d) return {};
	return pageHead(lang, { title: d.doc.title, description: d.doc.description, path: `${d.slug}/` });
}
