// The docs' search: a field in the header, or a button on phones, that
// opens a palette of results from the Pagefind index the build wrote. The
// arrow keys move through the pages and their sections, and Enter opens one.
import { useRouter } from '@tanstack/solid-router';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@ui-sdk/solid/command';
import { Dialog, DialogBackdrop, DialogClose, DialogContent, DialogShortcut, DialogTitle, DialogTrigger } from '@ui-sdk/solid/dialog';
import { createSignal, For, Show, useContext } from 'solid-js';
import { Page } from '../../app/context';
import { site } from '../../site';
import { go } from '../../app/navigate';
import { Icon } from '../Icon';

interface Result {
	url: string;
	title: string;
	excerpt: string;
	subs: { url: string; title: string; excerpt: string }[];
}

interface Pagefind {
	options(o: Record<string, unknown>): Promise<void>;
	init(): Promise<void>;
	destroy?(): Promise<void>;
	debouncedSearch(q: string, o?: unknown, ms?: number): Promise<{ results: { data(): Promise<PagefindData> }[] } | null>;
}
interface PagefindData {
	url: string;
	excerpt: string;
	meta: { title?: string };
	sub_results: { url: string; title: string; excerpt: string }[];
}

let pagefind: Promise<Pagefind> | undefined;
let indexLang = '';
// Pagefind searches the index of the page's language, which moving between
// languages without a reload changes.
const load = async () => {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	pagefind ??= import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`).then(async (pf: Pagefind) => {
		await pf.options({ baseUrl: `${base}/` });
		return pf;
	});
	const pf = await pagefind;
	const lang = document.documentElement.lang;
	if (indexLang && indexLang !== lang) {
		await pf.destroy?.();
		await pf.options({ baseUrl: `${base}/` });
	}
	if (indexLang !== lang) await pf.init();
	indexLang = lang;
	return pf;
};

export function Search() {
	const router = useRouter();
	const page = useContext(Page);
	const t = () => site[page.lang()].t;
	const [open, setOpen] = createSignal(false);
	const [query, setQuery] = createSignal('');
	const [results, setResults] = createSignal<Result[]>([]);
	const [state, setState] = createSignal<'idle' | 'loading' | 'unavailable'>('idle');

	const search = async (q: string) => {
		setQuery(q);
		if (!q.trim()) {
			setResults([]);
			setState('idle');
			return;
		}
		setState('loading');
		try {
			const pf = await load();
			const found = await pf.debouncedSearch(q, {}, 150);
			if (!found) return;
			const data = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
			if (q !== query()) return;
			setResults(
				data.map((d) => ({
					url: d.url,
					title: d.meta.title ?? d.url,
					excerpt: d.excerpt,
					subs: d.sub_results.filter((s) => s.url.includes('#') && !s.url.endsWith('#_top')).slice(0, 3),
				})),
			);
			setState('idle');
		} catch {
			setState('unavailable');
		}
	};

	return (
		<Dialog open={open()} onOpenChange={(next) => setOpen(next)}>
			<DialogTrigger
				class="search-trigger inline-flex items-center justify-center gap-2 size-[2.125rem] mr-1 max-sm:mr-0 p-0 rounded-10 bg-surface text-ink text-13 transition-colors duration-150 hover:bg-surface-2 [&>svg]:size-[1.125rem] lg:justify-start lg:w-48 lg:pl-3 lg:pr-1.5 lg:[&>svg]:size-[0.95rem]"
				 shortcut="mod+k" aria-label={t().search.label} onPointerEnter={() => void load().catch(() => {})}>
				<Icon name="magnifier" size="0.95rem" />
				<span class="search-label hidden lg:block flex-1 text-muted text-start">{t().search.label}</span>
				<DialogShortcut class="search-keys hidden lg:block px-1.5 py-px rounded-6 text-muted text-xs font-550" />
			</DialogTrigger>
			<DialogBackdrop class="search-backdrop fixed inset-0 z-80 bg-[rgb(0_0_0/0.4)] light:bg-[rgb(16_24_40/0.12)] transition-opacity duration-[160ms] ease-site data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
			<DialogContent class="search-dialog fixed inset-0 z-81 flex flex-col w-full max-w-none h-full max-h-none m-0 p-0 overflow-hidden bg-page text-ink outline-none transition-[opacity,scale] duration-[160ms] ease-site data-starting-style:opacity-0 data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:scale-[0.98] backdrop:bg-transparent motion-reduce:transition-none docs:top-24 docs:right-auto docs:bottom-auto docs:left-1/2 docs:-translate-x-1/2 docs:w-[min(40rem,calc(100vw-4rem))] docs:h-auto docs:max-h-[calc(100vh-10rem)] docs:border docs:border-line docs:rounded-16 docs:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.5)] docs:light:shadow-[0_24px_64px_-16px_rgb(16_24_40/0.25)]">
				<DialogTitle class="sr-only">{t().search.label}</DialogTitle>
				<Command
					class="flex flex-col min-h-0"
					filter={false}
					status={state() === 'loading' ? 'loading' : 'idle'}
					onQueryChange={(q) => void search(q)}
					onAction={(url) => {
						setOpen(false);
						go(router, url);
					}}
				>
					<div class="search-field flex flex-none items-center gap-2.5 h-14 pl-[1.125rem] pr-2 border-b border-line text-faint">
						<Icon name="magnifier" size="1rem" />
						<CommandInput
							class="flex-1 min-w-0 h-full bg-transparent text-ink text-base outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
							aria-label={t().search.label} placeholder={t().search.placeholder} />
						<DialogClose class="search-close h-9 px-3 rounded-8 text-muted text-sm hover:bg-surface hover:text-ink">{t().search.close}</DialogClose>
					</div>
					<Show when={query().trim()}>
						<CommandEmpty class="search-note py-6 px-5 text-muted text-sm text-center">
							{state() === 'unavailable' ? t().search.unavailable : state() === 'loading' ? t().search.loading : `${t().search.empty} “${query()}”`}
						</CommandEmpty>
					</Show>
					<CommandList class="search-results grid gap-0.5 p-1.5 overflow-y-auto overscroll-contain empty:hidden">
						<For each={results()}>
							{(r) => (
								<>
									<CommandItem value={r.url} label={r.title} class="search-page grid gap-0.5 px-3 py-2 rounded-10 cursor-pointer data-highlighted:bg-surface-2">
										<span class="search-title text-ink text-sm font-600">{r.title}</span>
										<span class="search-excerpt line-clamp-2 text-muted text-13 leading-[1.5] [&_mark]:bg-transparent [&_mark]:text-accent [&_mark]:font-600" innerHTML={r.excerpt} />
									</CommandItem>
									<For each={r.subs}>
										{(sub) => (
											<CommandItem value={sub.url} label={sub.title} class="search-section grid gap-0.5 ml-4 pl-3.5 pr-3 py-2 rounded-[0_0.625rem_0.625rem_0] border-s border-line cursor-pointer data-highlighted:bg-surface-2">
												<span class="search-title text-ink text-sm font-550">{sub.title}</span>
												<span class="search-excerpt line-clamp-2 text-muted text-13 leading-[1.5] [&_mark]:bg-transparent [&_mark]:text-accent [&_mark]:font-600" innerHTML={sub.excerpt} />
											</CommandItem>
										)}
									</For>
								</>
							)}
						</For>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
