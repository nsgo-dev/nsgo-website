// Which of the site's languages a reader's browser asks for. Self-contained,
// as app/boot.ts inlines its source to run before the page shows.

export interface LanguageChoice {
	/** The language's code, as in paths. */
	code: string;
	/** Its BCP-47 tag. */
	tag: string;
}

/**
 * The first of the browser's languages the site has: the same tag, else,
 * for Chinese, the script its region writes, else the same language in
 * another region. The site's first language when none matches.
 */
export function pickLanguage(preferred: readonly string[], langs: LanguageChoice[]): string {
	const has = (code: string) => langs.some((l) => l.code === code);
	for (const raw of preferred) {
		const tag = raw.toLowerCase();
		const exact = langs.find((l) => l.tag.toLowerCase() === tag);
		if (exact) return exact.code;
		const primary = tag.split('-')[0];
		if (primary === 'zh') {
			const traditional = /^zh-(tw|hk|mo|hant)/.test(tag);
			for (const code of traditional ? ['zh-tw', 'zh'] : ['zh', 'zh-tw']) if (has(code)) return code;
			continue;
		}
		const same = langs.find((l) => l.tag.toLowerCase().split('-')[0] === primary);
		if (same) return same.code;
	}
	return langs[0].code;
}
