// The repository's star count for the header, read once per build like the
// roadmap; the header falls back to its label when GitHub cannot answer.
import { repoOf } from './resolve';
import { token } from './roadmap';

async function fetchStars(repo: string): Promise<number | undefined> {
	const { owner, name } = repoOf(repo);
	const auth = token();
	const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
		headers: { Accept: 'application/vnd.github+json', ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
	});
	if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
	const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
	return typeof stargazers_count === 'number' ? stargazers_count : undefined;
}

const cache = new Map<string, Promise<number | undefined>>();

/** The repository's stars, or undefined when GitHub cannot tell them. */
export function loadStars(repo: string): Promise<number | undefined> {
	const cached = cache.get(repo);
	if (cached) return cached;
	const loaded = fetchStars(repo).catch((error: unknown) => {
		console.warn(`[stars] skipped: ${error instanceof Error ? error.message : String(error)}`);
		return undefined;
	});
	cache.set(repo, loaded);
	return loaded;
}
