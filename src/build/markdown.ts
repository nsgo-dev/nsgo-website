// A docs page's Markdown to the HTML its page shows, once per build: GitHub's
// Markdown, asides as :::note[Title] … :::, headings with anchors for the
// table of contents, and code in both of the site's themes.
import type { Element, Root as HastRoot } from 'hast';
import { toString } from 'hast-util-to-string';
import type { Code, Root as MdastRoot } from 'mdast';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { createHighlighter, type Highlighter } from 'shiki';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';
import type { UI } from '../locales';

export interface Heading {
	depth: number;
	id: string;
	text: string;
}

export interface RenderedDoc {
	data: Record<string, unknown>;
	html: string;
	headings: Heading[];
}

const themes = { light: 'one-light', dark: 'one-dark-pro' } as const;
let highlighter: Promise<Highlighter> | undefined;
const languages = new Set<string>();

/** Splits the frontmatter, YAML between --- lines, from the Markdown after it. */
export function frontmatter(source: string): { data: Record<string, unknown>; body: string } {
	const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { data: {}, body: source };
	return { data: (parseYaml(m[1]) as Record<string, unknown>) ?? {}, body: source.slice(m[0].length) };
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot' }[c]};`);

/**
 * A block's title: title="…" in its meta, or a file name alone in a comment
 * on its first line, which then leaves the code.
 */
function titleOf(node: Code): { title?: string; code: string } {
	const meta = node.meta?.match(/title=(?:"([^"]*)"|'([^']*)')/);
	if (meta) return { title: meta[1] ?? meta[2], code: node.value };
	const [first, ...rest] = node.value.split('\n');
	const file = first.match(/^\s*(?:\/\/|#|--|;)\s*([\w./-]+\.[\w]+)\s*$/);
	if (file) return { title: file[1], code: rest.join('\n').replace(/^\n/, '') };
	return { code: node.value };
}

async function highlight(code: string, lang: string): Promise<string> {
	highlighter ??= createHighlighter({ themes: Object.values(themes), langs: [] });
	const h = await highlighter;
	let use = lang || 'text';
	if (!languages.has(use)) {
		try {
			await h.loadLanguage(use as never);
			languages.add(use);
		} catch {
			use = 'text';
		}
	}
	return h.codeToHtml(code, { lang: use, themes, defaultColor: false });
}

/** A block of code in both themes, with its title and a button that copies it. */
export async function codeBlock(code: string, lang: string, title: string | undefined, t: UI): Promise<string> {
	const pre = await highlight(code, lang);
	return (
		`<figure class="code${title ? ' has-title' : ''}">` +
		(title ? `<figcaption>${escape(title)}</figcaption>` : '') +
		pre +
		`<button type="button" class="code-copy" aria-label="${escape(t.docs.copy)}" data-copied="${escape(t.docs.copied)}"></button></figure>`
	);
}

/** The page's Markdown as HTML, its frontmatter and its headings of the second and third level. */
export async function renderMarkdown(source: string, t: UI): Promise<RenderedDoc> {
	const { data, body } = frontmatter(source);
	const headings: Heading[] = [];
	const words = t.docs;

	const tree = unified().use(remarkParse).use(remarkGfm).use(remarkDirective).parse(body) as MdastRoot;
	await unified().use(remarkGfm).use(remarkDirective).run(tree);

	// Code, as HTML of its own, so the rest of the page never touches it.
	const blocks: Promise<void>[] = [];
	visit(tree, 'code', (node: Code, index, parent) => {
		if (!parent || index === undefined) return;
		const { title, code } = titleOf(node);
		const html = { type: 'html', value: '' } as const;
		parent.children[index] = html as never;
		blocks.push(codeBlock(code, node.lang ?? '', title, t).then((value) => void ((html as { value: string }).value = value)));
	});
	await Promise.all(blocks);

	// :::note, :::tip, :::caution and :::danger, with a [title] of their own.
	visit(tree, (node) => {
		if (node.type !== 'containerDirective') return;
		const d = node as unknown as { name: string; children: { data?: { directiveLabel?: boolean }; children?: unknown[] }[]; data?: Record<string, unknown> };
		const kind = (['note', 'tip', 'caution', 'danger'] as const).find((k) => k === d.name);
		if (!kind) return;
		const label = d.children[0]?.data?.directiveLabel ? d.children.shift() : undefined;
		d.children.unshift({ type: 'paragraph', data: { hProperties: { className: ['aside-title'] } }, children: label?.children ?? [{ type: 'text', value: words[kind] }] } as never);
		d.data = { hName: 'aside', hProperties: { className: ['aside', `aside-${kind}`] } };
	});

	// Words like a:b are read as directives; any but the asides go back to text.
	visit(tree, (node, index, parent) => {
		if ((node.type !== 'textDirective' && node.type !== 'leafDirective') || !parent || index === undefined) return;
		const d = node as unknown as { name: string; children: { value?: string }[] };
		const text = `:${d.name}${d.children.length ? `[${d.children.map((c) => c.value ?? '').join('')}]` : ''}`;
		parent.children[index] = (node.type === 'leafDirective' ? { type: 'paragraph', children: [{ type: 'text', value: text }] } : { type: 'text', value: text }) as never;
	});

	const hast = (await unified().use(remarkRehype, { allowDangerousHtml: true }).use(rehypeSlug).run(tree as never)) as HastRoot;
	visit(hast, 'element', (node: Element) => {
		if (/^h[23]$/.test(node.tagName) && node.properties.id) {
			headings.push({ depth: Number(node.tagName[1]), id: String(node.properties.id), text: toString(node) });
		}
		// Tables scroll on their own when wider than the page.
		if (node.tagName === 'table') {
			const table = { ...node };
			Object.assign(node, { tagName: 'div', properties: { className: ['table-wrap'] }, children: [table] });
			return SKIP;
		}
	});
	const html = unified().use(rehypeStringify, { allowDangerousHtml: true }).stringify(hast as never);
	return { data, html: String(html), headings };
}
