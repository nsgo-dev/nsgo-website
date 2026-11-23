// The roadmap, read from GitHub when the site is built. The tracking issue's
// sub-issues are the stages, in order; a stage's sub-issues are its tasks, grouped by the area their titles start with
// ("Audio: …"), and a task's sub-issues are its subtasks. For each task come
// the pull requests that close it and the open issues it is blocked by, which
// are why it waits. The pages carry the result; nothing is fetched in the
// browser.
import { execFileSync } from 'node:child_process';
import type { ResolvedRoadmap } from './resolve';

export type IssueState = 'open' | 'closed';
export type PullState = 'open' | 'draft' | 'merged' | 'closed';
/** A task's status: done, waiting for other issues, under review, started, or not started. */
export type Status = 'done' | 'blocked' | 'review' | 'progress' | 'planned';

export interface Ref {
	/** The issue's short name: #15 here, nsgo#1105 in another repository. */
	ref: string;
	title: string;
	state: IssueState;
	url: string;
}

export interface Pull {
	number: number;
	state: PullState;
	url: string;
}

export interface Progress {
	done: number;
	total: number;
}

export interface Task extends Ref {
	/** The title without its area. */
	name: string;
	status: Status;
	subtasks: Ref[];
	pulls: Pull[];
	/** The open issues it is blocked by. */
	waitsFor: Ref[];
}

export interface Area {
	/** The word the tasks' titles start with, or '' for titles without one. */
	name: string;
	progress: Progress;
	tasks: Task[];
}

export interface Stage extends Ref {
	/** Its tasks closed, of all. */
	progress: Progress;
	areas: Area[];
}

export type Roadmap = { status: 'ok'; fetchedAt: string; stages: Stage[] } | { status: 'unavailable'; reason: string };

// The page sizes keep the query within GitHub's limit on the nodes it may return.
const QUERY = `query($owner: String!, $name: String!, $number: Int!) {
	repository(owner: $owner, name: $name) {
		issue(number: $number) {
			subIssues(first: 20) {
				nodes {
					...issue
					subIssues(first: 100) {
						nodes {
							...issue
							subIssues(first: 30) { nodes { ...issue } }
							closedByPullRequestsReferences(first: 5, includeClosedPrs: true) { nodes { number state isDraft url } }
							blockedBy(first: 10) { nodes { ...issue } }
						}
					}
				}
			}
		}
	}
}
fragment issue on Issue { number title state url repository { nameWithOwner } }`;

interface GqlIssue {
	number: number;
	title: string;
	state: 'OPEN' | 'CLOSED';
	url: string;
	repository: { nameWithOwner: string };
}
interface GqlTask extends GqlIssue {
	subIssues: { nodes: GqlIssue[] };
	closedByPullRequestsReferences: { nodes: { number: number; state: 'OPEN' | 'CLOSED' | 'MERGED'; isDraft: boolean; url: string }[] };
	blockedBy: { nodes: GqlIssue[] };
}
interface GqlStage extends GqlIssue {
	subIssues: { nodes: GqlTask[] };
}

// The token GitHub's API takes: the workflow's, or the GitHub CLI's locally.
function token(): string | undefined {
	const env = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
	if (env) return env;
	try {
		return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
	} catch {
		return undefined;
	}
}

function ref(this: ResolvedRoadmap, issue: GqlIssue): Ref {
	const repo = issue.repository.nameWithOwner;
	return {
		ref: repo === `${this.owner}/${this.name}` ? `#${issue.number}` : `${repo.split('/')[1]}#${issue.number}`,
		title: issue.title,
		state: issue.state === 'CLOSED' ? 'closed' : 'open',
		url: issue.url,
	};
}

// The title without its area starts a sentence of its own.
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function task(this: ResolvedRoadmap, issue: GqlTask): Task & { area: string } {
	const base = ref.call(this, issue);
	const colon = issue.title.indexOf(':');
	const subtasks = issue.subIssues.nodes.map(ref, this);
	const pulls = issue.closedByPullRequestsReferences.nodes.map(
		(p): Pull => ({ number: p.number, url: p.url, state: p.state === 'MERGED' ? 'merged' : p.state === 'CLOSED' ? 'closed' : p.isDraft ? 'draft' : 'open' }),
	);
	const waitsFor = issue.blockedBy.nodes
		.filter((b) => b.state === 'OPEN')
		.sort((a, b) => a.number - b.number)
		.map(ref, this);
	const status: Status =
		base.state === 'closed'
			? 'done'
			: waitsFor.length > 0
				? 'blocked'
				: pulls.some((p) => p.state === 'open')
					? 'review'
					: pulls.some((p) => p.state === 'draft') || subtasks.some((t) => t.state === 'closed')
						? 'progress'
						: 'planned';
	return {
		...base,
		area: colon > 0 ? issue.title.slice(0, colon) : '',
		name: colon > 0 ? capitalize(issue.title.slice(colon + 1).trim()) : issue.title,
		status,
		subtasks,
		pulls,
		waitsFor,
	};
}

const count = (tasks: Ref[]): Progress => ({ done: tasks.filter((t) => t.state === 'closed').length, total: tasks.length });

function stage(this: ResolvedRoadmap, issue: GqlStage): Stage {
	const tasks = issue.subIssues.nodes.map(task, this);
	// Areas in the order their first task comes, with titles that name none last.
	const areas: Area[] = [];
	for (const t of tasks) {
		let area = areas.find((a) => a.name === t.area);
		if (!area) areas.push((area = { name: t.area, progress: { done: 0, total: 0 }, tasks: [] }));
		area.tasks.push(t);
	}
	for (const a of areas) a.progress = count(a.tasks);
	areas.sort((a, b) => Number(a.name === '') - Number(b.name === ''));
	return { ...ref.call(this, issue), progress: count(tasks), areas };
}

async function fetchRoadmap(r: ResolvedRoadmap): Promise<Roadmap> {
	const auth = token();
	if (!auth) throw new Error('no GitHub token: set GITHUB_TOKEN or sign in with gh');
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: QUERY, variables: { owner: r.owner, name: r.name, number: r.tracking } }),
	});
	if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
	const json = (await res.json()) as { data?: { repository: { issue: { subIssues: { nodes: GqlStage[] } } | null } }; errors?: { message: string }[] };
	if (json.errors?.length) throw new Error(json.errors[0].message);
	const issue = json.data?.repository.issue;
	if (!issue) throw new Error(`issue #${r.tracking} not found`);
	return { status: 'ok', fetchedAt: new Date().toISOString(), stages: issue.subIssues.nodes.map(stage, r) };
}

const cache = new Map<string, Promise<Roadmap>>();

/** The roadmap, read once for both languages' pages. */
export function loadRoadmap(r: ResolvedRoadmap): Promise<Roadmap> {
	const key = `${r.owner}/${r.name}#${r.tracking}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const loaded = fetchRoadmap(r).catch((error: unknown): Roadmap => {
		const reason = error instanceof Error ? error.message : String(error);
		// A deploy must not replace the roadmap with an empty one; a local build goes on without it.
		if (process.env.CI) throw new Error(`roadmap: ${reason}`);
		console.warn(`[roadmap] skipped: ${reason}`);
		return { status: 'unavailable', reason };
	});
	cache.set(key, loaded);
	return loaded;
}
