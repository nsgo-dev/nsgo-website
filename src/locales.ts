// Every language a site may turn on, with the words of the site's frame in
// it: the header, its menus, the footer, the roadmap and the sponsors page.
// A site lists the
// ones it uses in its languages setting; the first is served at the root and
// each other under its code, as zh/ or ja/. A project changes the plain words
// with its strings setting.
import type { Link } from './config';

export interface UI {
	nav: Record<'label' | 'menu' | 'docs' | 'roadmap' | 'features' | 'github' | 'community' | 'feedback' | 'changelog' | 'sponsors', string>;
	theme: Record<'name' | 'light' | 'dark' | 'auto', string>;
	language: Record<'name' | 'auto', string>;
	start: string;
	license: string;
	/** The area of roadmap tasks whose titles name none. */
	other: string;
	/** note, tip, caution and danger title the asides; copy and copied are the code blocks' button. */
	docs: Record<'toc' | 'overview' | 'previous' | 'next' | 'edit' | 'pages' | 'skip' | 'note' | 'tip' | 'caution' | 'danger' | 'copy' | 'copied', string>;
	/** unavailable: in place of results where the index is not built, as on the dev server. */
	search: Record<'label' | 'placeholder' | 'empty' | 'loading' | 'unavailable' | 'close', string>;
	notFound: Record<'title' | 'text' | 'home', string>;
	roadmap: {
		title: string;
		description: (name: string) => string;
		stage: (n: number) => string;
		progress: (done: number, total: number) => string;
		subtasks: (done: number, total: number) => string;
		status: Record<'done' | 'blocked' | 'review' | 'progress' | 'planned', string>;
		pull: Record<'open' | 'draft' | 'merged' | 'closed', string>;
		waitsFor: string;
		open: string;
		closed: string;
		/** Before the date the issues were read. */
		asOf: string;
		/** Around the reason and the link to the tracking issue. */
		unavailable: [string, string, string];
	};
	/** The notes of NSGo's places, the default community menu. */
	community: { nsgo: string; telegram: string; awesome: string };
	sponsors: {
		title: string;
		description: (name: string) => string;
		become: string;
		/** The button of a maintainer's card. */
		sponsor: string;
		/** Under the home page's first tier. */
		homeText: (name: string) => string;
		/** On the invitation to a tier's empty places. */
		left: (n: number) => string;
	};
}

export interface Locale {
	/** Its name in itself, as the language menu lists it. */
	label: string;
	/** Its BCP-47 tag, for lang attributes and dates. */
	tag: string;
	/** Its Open Graph locale. */
	og: string;
	/** The language menu's mark for it. */
	mark: string;
	/** Written without spaces between words, so lines join without one. */
	cjk?: boolean;
	ui: UI;
}

const en: UI = {
	nav: { label: 'Main', menu: 'Menu', docs: 'Docs', roadmap: 'Roadmap', features: 'Features', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Changelog', sponsors: 'Sponsors' },
	theme: { name: 'Theme', light: 'Light', dark: 'Dark', auto: 'Auto' },
	language: { name: 'Language', auto: 'Auto' },
	start: 'Get started',
	license: 'MIT',
	other: 'Other',
	docs: { toc: 'On this page', overview: 'Overview', previous: 'Previous', next: 'Next', edit: 'Edit page', pages: 'Docs', skip: 'Skip to content', note: 'Note', tip: 'Tip', caution: 'Caution', danger: 'Danger', copy: 'Copy', copied: 'Copied' },
	search: { label: 'Search', placeholder: 'Search the docs', empty: 'No results for', loading: 'Searching…', unavailable: 'Search works on the built site.', close: 'Close' },
	notFound: { title: 'Page not found', text: 'This page does not exist, or it has moved.', home: 'Back to the home page' },
	roadmap: {
		title: 'Roadmap',
		description: (name) => `The stages of ${name}, their tasks by area and their subtasks, with each one’s progress, pull requests and what it waits for, from its GitHub issues.`,
		stage: (n) => `Stage ${n}`,
		progress: (done, total) => `${done} of ${total} tasks closed`,
		subtasks: (done, total) => `${done} of ${total} subtasks closed`,
		status: { done: 'Done', blocked: 'Blocked', review: 'In review', progress: 'In progress', planned: 'Planned' },
		pull: { open: 'Open', draft: 'Draft', merged: 'Merged', closed: 'Closed' },
		waitsFor: 'Waits for',
		open: 'Open',
		closed: 'Closed',
		asOf: 'As of ',
		unavailable: ['This build could not read the issues from GitHub (', '). See them on ', '.'],
	},
	community: { nsgo: 'The cross-platform native UI engine', telegram: 'NSGo Telegram', awesome: 'Apps, libraries and resources' },
	sponsors: {
		title: 'Sponsors',
		description: (name) => `The companies and people whose sponsorship keeps ${name} going.`,
		become: 'Become a sponsor',
		sponsor: 'Sponsor',
		homeText: (name) => `${name} is kept going by these sponsors.`,
		left: (n) => `${n} ${n === 1 ? 'place' : 'places'} left`,
	},
};

const zh: UI = {
	nav: { label: '主导航', menu: '菜单', docs: '文档', roadmap: '路线图', features: '功能', github: 'GitHub', community: '社区', feedback: '反馈', changelog: '更新日志', sponsors: '赞助' },
	theme: { name: '主题', light: '浅色', dark: '深色', auto: '自动' },
	language: { name: '语言', auto: '自动' },
	start: '入门指南',
	license: 'MIT',
	other: '其他',
	docs: { toc: '本页内容', overview: '概述', previous: '上一页', next: '下一页', edit: '编辑此页', pages: '文档', skip: '跳到正文', note: '注意', tip: '提示', caution: '警告', danger: '危险', copy: '复制', copied: '已复制' },
	search: { label: '搜索', placeholder: '搜索文档', empty: '没有结果：', loading: '正在搜索…', unavailable: '构建后的站点才能搜索。', close: '关闭' },
	notFound: { title: '页面不存在', text: '这个页面不存在，或者已经移走了。', home: '回到首页' },
	roadmap: {
		title: '路线图',
		description: (name) => `${name} 的各个阶段、按领域分组的任务和子任务，以及每一项的进度、拉取请求和在等待什么，来自它的 GitHub issue。`,
		stage: (n) => `阶段 ${n}`,
		progress: (done, total) => `已关闭 ${done} / ${total} 个任务`,
		subtasks: (done, total) => `已关闭 ${done} / ${total} 个子任务`,
		status: { done: '已完成', blocked: '受阻', review: '审查中', progress: '进行中', planned: '计划中' },
		pull: { open: '打开', draft: '草稿', merged: '已合并', closed: '已关闭' },
		waitsFor: '等待',
		open: '未关闭',
		closed: '已关闭',
		asOf: '数据截至 ',
		unavailable: ['这次构建没能从 GitHub 读取 issue（', '）。请到 ', ' 查看。'],
	},
	community: { nsgo: '跨平台原生 UI 引擎', telegram: 'NSGo Telegram 群组', awesome: '应用、库和资源' },
	sponsors: {
		title: '赞助',
		description: (name) => `感谢这些企业和个人的赞助，让 ${name} 得以持续发展。`,
		become: '成为赞助者',
		sponsor: '赞助',
		homeText: (name) => `这些赞助者支持着 ${name} 的持续发展。`,
		left: (n) => `还剩 ${n} 个位置`,
	},
};

const zhTW: UI = {
	nav: { label: '主導覽', menu: '選單', docs: '文件', roadmap: '路線圖', features: '功能', github: 'GitHub', community: '社群', feedback: '意見回饋', changelog: '更新紀錄', sponsors: '贊助' },
	theme: { name: '主題', light: '淺色', dark: '深色', auto: '自動' },
	language: { name: '語言', auto: '自動' },
	start: '入門指南',
	license: 'MIT',
	other: '其他',
	docs: { toc: '本頁內容', overview: '概述', previous: '上一頁', next: '下一頁', edit: '編輯此頁', pages: '文件', skip: '跳到正文', note: '注意', tip: '提示', caution: '警告', danger: '危險', copy: '複製', copied: '已複製' },
	search: { label: '搜尋', placeholder: '搜尋文件', empty: '沒有結果：', loading: '正在搜尋…', unavailable: '建置後的網站才能搜尋。', close: '關閉' },
	notFound: { title: '找不到頁面', text: '這個頁面不存在，或者已經移走了。', home: '回到首頁' },
	roadmap: {
		title: '路線圖',
		description: (name) => `${name} 的各個階段、依領域分組的任務與子任務，以及每一項的進度、拉取請求和在等待什麼，來自它的 GitHub issue。`,
		stage: (n) => `階段 ${n}`,
		progress: (done, total) => `已關閉 ${done} / ${total} 個任務`,
		subtasks: (done, total) => `已關閉 ${done} / ${total} 個子任務`,
		status: { done: '已完成', blocked: '受阻', review: '審查中', progress: '進行中', planned: '計畫中' },
		pull: { open: '開啟', draft: '草稿', merged: '已合併', closed: '已關閉' },
		waitsFor: '等待',
		open: '未關閉',
		closed: '已關閉',
		asOf: '資料截至 ',
		unavailable: ['這次建置無法從 GitHub 讀取 issue（', '）。請到 ', ' 查看。'],
	},
	community: { nsgo: '跨平台原生 UI 引擎', telegram: 'NSGo Telegram 群組', awesome: '應用程式、函式庫和資源' },
	sponsors: {
		title: '贊助',
		description: (name) => `感謝這些企業和個人的贊助，讓 ${name} 得以持續發展。`,
		become: '成為贊助者',
		sponsor: '贊助',
		homeText: (name) => `這些贊助者支持著 ${name} 的持續發展。`,
		left: (n) => `還剩 ${n} 個位置`,
	},
};

const ja: UI = {
	nav: { label: 'メイン', menu: 'メニュー', docs: 'ドキュメント', roadmap: 'ロードマップ', features: '機能', github: 'GitHub', community: 'コミュニティ', feedback: 'フィードバック', changelog: '変更履歴', sponsors: 'スポンサー' },
	theme: { name: 'テーマ', light: 'ライト', dark: 'ダーク', auto: '自動' },
	language: { name: '言語', auto: '自動' },
	start: 'はじめる',
	license: 'MIT',
	other: 'その他',
	docs: { toc: 'このページの内容', overview: '概要', previous: '前へ', next: '次へ', edit: 'ページを編集', pages: 'ドキュメント', skip: '本文へスキップ', note: '注記', tip: 'ヒント', caution: '注意', danger: '危険', copy: 'コピー', copied: 'コピーしました' },
	search: { label: '検索', placeholder: 'ドキュメントを検索', empty: '結果がありません：', loading: '検索中…', unavailable: '検索はビルドしたサイトで使えます。', close: '閉じる' },
	notFound: { title: 'ページが見つかりません', text: 'このページは存在しないか、移動しました。', home: 'ホームに戻る' },
	roadmap: {
		title: 'ロードマップ',
		description: (name) => `${name} の各段階、領域ごとのタスクとサブタスク、それぞれの進捗、プルリクエスト、待っているものを GitHub の issue から示します。`,
		stage: (n) => `段階 ${n}`,
		progress: (done, total) => `${total} 件中 ${done} 件のタスクが完了`,
		subtasks: (done, total) => `${total} 件中 ${done} 件のサブタスクが完了`,
		status: { done: '完了', blocked: 'ブロック中', review: 'レビュー中', progress: '進行中', planned: '予定' },
		pull: { open: 'オープン', draft: 'ドラフト', merged: 'マージ済み', closed: 'クローズ' },
		waitsFor: '待機中',
		open: '未完了',
		closed: '完了',
		asOf: '取得日 ',
		unavailable: ['このビルドでは GitHub から issue を読み込めませんでした（', '）。', ' で確認してください。'],
	},
	community: { nsgo: 'クロスプラットフォームのネイティブ UI エンジン', telegram: 'NSGo Telegram', awesome: 'アプリ、ライブラリ、リソース' },
	sponsors: {
		title: 'スポンサー',
		description: (name) => `${name} の開発を支えてくださる企業と個人のスポンサーです。`,
		become: 'スポンサーになる',
		sponsor: 'スポンサー',
		homeText: (name) => `${name} はこれらのスポンサーに支えられています。`,
		left: (n) => `残り ${n} 枠`,
	},
};

const ko: UI = {
	nav: { label: '주요', menu: '메뉴', docs: '문서', roadmap: '로드맵', features: '기능', github: 'GitHub', community: '커뮤니티', feedback: '피드백', changelog: '변경 내역', sponsors: '후원' },
	theme: { name: '테마', light: '라이트', dark: '다크', auto: '자동' },
	language: { name: '언어', auto: '자동' },
	start: '시작하기',
	license: 'MIT',
	other: '기타',
	docs: { toc: '이 페이지의 내용', overview: '개요', previous: '이전', next: '다음', edit: '페이지 편집', pages: '문서', skip: '본문으로 건너뛰기', note: '참고', tip: '팁', caution: '주의', danger: '위험', copy: '복사', copied: '복사됨' },
	search: { label: '검색', placeholder: '문서 검색', empty: '결과 없음:', loading: '검색 중…', unavailable: '검색은 빌드된 사이트에서 동작합니다.', close: '닫기' },
	notFound: { title: '페이지를 찾을 수 없음', text: '이 페이지는 없거나 다른 곳으로 옮겨졌습니다.', home: '홈으로 돌아가기' },
	roadmap: {
		title: '로드맵',
		description: (name) => `${name}의 단계, 영역별 작업과 하위 작업, 각각의 진행 상황, 풀 리퀘스트와 기다리는 항목을 GitHub 이슈에서 보여 줍니다.`,
		stage: (n) => `${n}단계`,
		progress: (done, total) => `작업 ${total}개 중 ${done}개 완료`,
		subtasks: (done, total) => `하위 작업 ${total}개 중 ${done}개 완료`,
		status: { done: '완료', blocked: '막힘', review: '리뷰 중', progress: '진행 중', planned: '예정' },
		pull: { open: '열림', draft: '초안', merged: '병합됨', closed: '닫힘' },
		waitsFor: '대기 중',
		open: '열림',
		closed: '닫힘',
		asOf: '기준 ',
		unavailable: ['이번 빌드에서 GitHub 이슈를 읽지 못했습니다 (', '). ', '에서 확인하세요.'],
	},
	community: { nsgo: '크로스 플랫폼 네이티브 UI 엔진', telegram: 'NSGo Telegram', awesome: '앱, 라이브러리, 리소스' },
	sponsors: {
		title: '후원',
		description: (name) => `${name}의 개발을 이어 가게 해 주는 기업과 개인 후원자입니다.`,
		become: '후원하기',
		sponsor: '후원하기',
		homeText: (name) => `${name}은(는) 이 후원사들의 지원으로 이어지고 있습니다.`,
		left: (n) => `${n}자리 남음`,
	},
};

const es: UI = {
	nav: { label: 'Principal', menu: 'Menú', docs: 'Documentación', roadmap: 'Hoja de ruta', features: 'Funciones', github: 'GitHub', community: 'Comunidad', feedback: 'Comentarios', changelog: 'Cambios', sponsors: 'Patrocinadores' },
	theme: { name: 'Tema', light: 'Claro', dark: 'Oscuro', auto: 'Automático' },
	language: { name: 'Idioma', auto: 'Automático' },
	start: 'Empezar',
	license: 'MIT',
	other: 'Otros',
	docs: { toc: 'En esta página', overview: 'Resumen', previous: 'Anterior', next: 'Siguiente', edit: 'Editar página', pages: 'Documentación', skip: 'Saltar al contenido', note: 'Nota', tip: 'Consejo', caution: 'Precaución', danger: 'Peligro', copy: 'Copiar', copied: 'Copiado' },
	search: { label: 'Buscar', placeholder: 'Buscar en la documentación', empty: 'Sin resultados para', loading: 'Buscando…', unavailable: 'La búsqueda funciona en el sitio compilado.', close: 'Cerrar' },
	notFound: { title: 'Página no encontrada', text: 'Esta página no existe o se ha movido.', home: 'Volver al inicio' },
	roadmap: {
		title: 'Hoja de ruta',
		description: (name) => `Las etapas de ${name}, sus tareas por área y sus subtareas, con el progreso, las pull requests y lo que espera cada una, desde sus issues de GitHub.`,
		stage: (n) => `Etapa ${n}`,
		progress: (done, total) => `${done} de ${total} tareas cerradas`,
		subtasks: (done, total) => `${done} de ${total} subtareas cerradas`,
		status: { done: 'Hecho', blocked: 'Bloqueado', review: 'En revisión', progress: 'En curso', planned: 'Previsto' },
		pull: { open: 'Abierta', draft: 'Borrador', merged: 'Fusionada', closed: 'Cerrada' },
		waitsFor: 'Espera a',
		open: 'Abierto',
		closed: 'Cerrado',
		asOf: 'A fecha de ',
		unavailable: ['Esta compilación no pudo leer las issues de GitHub (', '). Consúltalas en ', '.'],
	},
	community: { nsgo: 'El motor de UI nativa multiplataforma', telegram: 'NSGo en Telegram', awesome: 'Apps, bibliotecas y recursos' },
	sponsors: {
		title: 'Patrocinadores',
		description: (name) => `Las empresas y personas cuyo patrocinio mantiene ${name} en marcha.`,
		become: 'Patrocinar',
		sponsor: 'Patrocinar',
		homeText: (name) => `${name} sigue adelante gracias a estos patrocinadores.`,
		left: (n) => (n === 1 ? 'Queda 1 lugar' : `Quedan ${n} lugares`),
	},
};

const fr: UI = {
	nav: { label: 'Principal', menu: 'Menu', docs: 'Documentation', roadmap: 'Feuille de route', features: 'Fonctionnalités', github: 'GitHub', community: 'Communauté', feedback: 'Retours', changelog: 'Changements', sponsors: 'Sponsors' },
	theme: { name: 'Thème', light: 'Clair', dark: 'Sombre', auto: 'Automatique' },
	language: { name: 'Langue', auto: 'Automatique' },
	start: 'Commencer',
	license: 'MIT',
	other: 'Autres',
	docs: { toc: 'Sur cette page', overview: 'Vue d’ensemble', previous: 'Précédent', next: 'Suivant', edit: 'Modifier la page', pages: 'Documentation', skip: 'Aller au contenu', note: 'Remarque', tip: 'Astuce', caution: 'Attention', danger: 'Danger', copy: 'Copier', copied: 'Copié' },
	search: { label: 'Rechercher', placeholder: 'Rechercher dans la documentation', empty: 'Aucun résultat pour', loading: 'Recherche…', unavailable: 'La recherche fonctionne sur le site construit.', close: 'Fermer' },
	notFound: { title: 'Page introuvable', text: 'Cette page n’existe pas ou a été déplacée.', home: 'Retour à l’accueil' },
	roadmap: {
		title: 'Feuille de route',
		description: (name) => `Les étapes de ${name}, leurs tâches par domaine et leurs sous-tâches, avec l’avancement, les pull requests et ce qu’attend chacune, d’après ses issues GitHub.`,
		stage: (n) => `Étape ${n}`,
		progress: (done, total) => `${done} tâches fermées sur ${total}`,
		subtasks: (done, total) => `${done} sous-tâches fermées sur ${total}`,
		status: { done: 'Terminé', blocked: 'Bloqué', review: 'En revue', progress: 'En cours', planned: 'Prévu' },
		pull: { open: 'Ouverte', draft: 'Brouillon', merged: 'Fusionnée', closed: 'Fermée' },
		waitsFor: 'Attend',
		open: 'Ouvert',
		closed: 'Fermé',
		asOf: 'Au ',
		unavailable: ['Cette compilation n’a pas pu lire les issues de GitHub (', '). Consultez-les sur ', '.'],
	},
	community: { nsgo: 'Le moteur d’UI native multiplateforme', telegram: 'NSGo sur Telegram', awesome: 'Apps, bibliothèques et ressources' },
	sponsors: {
		title: 'Sponsors',
		description: (name) => `Les entreprises et les personnes dont le soutien fait avancer ${name}.`,
		become: 'Devenir sponsor',
		sponsor: 'Sponsoriser',
		homeText: (name) => `${name} avance grâce à ces sponsors.`,
		left: (n) => (n === 1 ? '1 place restante' : `${n} places restantes`),
	},
};

const de: UI = {
	nav: { label: 'Haupt', menu: 'Menü', docs: 'Dokumentation', roadmap: 'Roadmap', features: 'Funktionen', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Änderungen', sponsors: 'Sponsoren' },
	theme: { name: 'Design', light: 'Hell', dark: 'Dunkel', auto: 'Automatisch' },
	language: { name: 'Sprache', auto: 'Automatisch' },
	start: 'Loslegen',
	license: 'MIT',
	other: 'Sonstiges',
	docs: { toc: 'Auf dieser Seite', overview: 'Überblick', previous: 'Zurück', next: 'Weiter', edit: 'Seite bearbeiten', pages: 'Dokumentation', skip: 'Zum Inhalt springen', note: 'Hinweis', tip: 'Tipp', caution: 'Vorsicht', danger: 'Gefahr', copy: 'Kopieren', copied: 'Kopiert' },
	search: { label: 'Suchen', placeholder: 'Dokumentation durchsuchen', empty: 'Keine Ergebnisse für', loading: 'Suche läuft…', unavailable: 'Die Suche funktioniert auf der gebauten Website.', close: 'Schließen' },
	notFound: { title: 'Seite nicht gefunden', text: 'Diese Seite gibt es nicht, oder sie wurde verschoben.', home: 'Zur Startseite' },
	roadmap: {
		title: 'Roadmap',
		description: (name) => `Die Phasen von ${name}, ihre Aufgaben nach Bereich und ihre Unteraufgaben, mit Fortschritt, Pull Requests und worauf jede wartet, aus den GitHub-Issues.`,
		stage: (n) => `Phase ${n}`,
		progress: (done, total) => `${done} von ${total} Aufgaben geschlossen`,
		subtasks: (done, total) => `${done} von ${total} Unteraufgaben geschlossen`,
		status: { done: 'Erledigt', blocked: 'Blockiert', review: 'In Review', progress: 'In Arbeit', planned: 'Geplant' },
		pull: { open: 'Offen', draft: 'Entwurf', merged: 'Gemergt', closed: 'Geschlossen' },
		waitsFor: 'Wartet auf',
		open: 'Offen',
		closed: 'Geschlossen',
		asOf: 'Stand ',
		unavailable: ['Dieser Build konnte die Issues nicht von GitHub lesen (', '). Siehe ', '.'],
	},
	community: { nsgo: 'Die plattformübergreifende native UI-Engine', telegram: 'NSGo auf Telegram', awesome: 'Apps, Bibliotheken und Ressourcen' },
	sponsors: {
		title: 'Sponsoren',
		description: (name) => `Die Unternehmen und Menschen, deren Unterstützung ${name} am Laufen hält.`,
		become: 'Sponsor werden',
		sponsor: 'Sponsern',
		homeText: (name) => `${name} wird von diesen Sponsoren getragen.`,
		left: (n) => (n === 1 ? '1 Platz frei' : `${n} Plätze frei`),
	},
};

const pt: UI = {
	nav: { label: 'Principal', menu: 'Menu', docs: 'Documentação', roadmap: 'Roteiro', features: 'Recursos', github: 'GitHub', community: 'Comunidade', feedback: 'Feedback', changelog: 'Alterações', sponsors: 'Patrocinadores' },
	theme: { name: 'Tema', light: 'Claro', dark: 'Escuro', auto: 'Automático' },
	language: { name: 'Idioma', auto: 'Automático' },
	start: 'Começar',
	license: 'MIT',
	other: 'Outros',
	docs: { toc: 'Nesta página', overview: 'Visão geral', previous: 'Anterior', next: 'Próximo', edit: 'Editar página', pages: 'Documentação', skip: 'Pular para o conteúdo', note: 'Nota', tip: 'Dica', caution: 'Cuidado', danger: 'Perigo', copy: 'Copiar', copied: 'Copiado' },
	search: { label: 'Pesquisar', placeholder: 'Pesquisar na documentação', empty: 'Nenhum resultado para', loading: 'Pesquisando…', unavailable: 'A pesquisa funciona no site gerado.', close: 'Fechar' },
	notFound: { title: 'Página não encontrada', text: 'Esta página não existe ou foi movida.', home: 'Voltar ao início' },
	roadmap: {
		title: 'Roteiro',
		description: (name) => `As etapas de ${name}, suas tarefas por área e subtarefas, com o progresso, os pull requests e o que cada uma aguarda, a partir das issues do GitHub.`,
		stage: (n) => `Etapa ${n}`,
		progress: (done, total) => `${done} de ${total} tarefas fechadas`,
		subtasks: (done, total) => `${done} de ${total} subtarefas fechadas`,
		status: { done: 'Concluído', blocked: 'Bloqueado', review: 'Em revisão', progress: 'Em andamento', planned: 'Planejado' },
		pull: { open: 'Aberto', draft: 'Rascunho', merged: 'Mesclado', closed: 'Fechado' },
		waitsFor: 'Aguarda',
		open: 'Aberto',
		closed: 'Fechado',
		asOf: 'Em ',
		unavailable: ['Esta compilação não conseguiu ler as issues do GitHub (', '). Veja-as em ', '.'],
	},
	community: { nsgo: 'O motor de UI nativa multiplataforma', telegram: 'NSGo no Telegram', awesome: 'Apps, bibliotecas e recursos' },
	sponsors: {
		title: 'Patrocinadores',
		description: (name) => `As empresas e pessoas cujo patrocínio mantém ${name} em andamento.`,
		become: 'Patrocinar',
		sponsor: 'Patrocinar',
		homeText: (name) => `${name} segue em frente graças a estes patrocinadores.`,
		left: (n) => (n === 1 ? 'Resta 1 vaga' : `Restam ${n} vagas`),
	},
};

const ru: UI = {
	nav: { label: 'Основное', menu: 'Меню', docs: 'Документация', roadmap: 'Дорожная карта', features: 'Возможности', github: 'GitHub', community: 'Сообщество', feedback: 'Отзывы', changelog: 'Изменения', sponsors: 'Спонсоры' },
	theme: { name: 'Тема', light: 'Светлая', dark: 'Тёмная', auto: 'Авто' },
	language: { name: 'Язык', auto: 'Авто' },
	start: 'Начать',
	license: 'MIT',
	other: 'Другое',
	docs: { toc: 'На этой странице', overview: 'Обзор', previous: 'Назад', next: 'Далее', edit: 'Редактировать страницу', pages: 'Документация', skip: 'Перейти к содержимому', note: 'Примечание', tip: 'Совет', caution: 'Осторожно', danger: 'Опасно', copy: 'Копировать', copied: 'Скопировано' },
	search: { label: 'Поиск', placeholder: 'Поиск по документации', empty: 'Нет результатов для', loading: 'Поиск…', unavailable: 'Поиск работает на собранном сайте.', close: 'Закрыть' },
	notFound: { title: 'Страница не найдена', text: 'Этой страницы нет, или она перемещена.', home: 'На главную' },
	roadmap: {
		title: 'Дорожная карта',
		description: (name) => `Этапы ${name}, их задачи по областям и подзадачи, с прогрессом, пул-реквестами и тем, чего ждёт каждая, по issue на GitHub.`,
		stage: (n) => `Этап ${n}`,
		progress: (done, total) => `Закрыто задач: ${done} из ${total}`,
		subtasks: (done, total) => `Закрыто подзадач: ${done} из ${total}`,
		status: { done: 'Готово', blocked: 'Заблокировано', review: 'На ревью', progress: 'В работе', planned: 'Запланировано' },
		pull: { open: 'Открыт', draft: 'Черновик', merged: 'Слит', closed: 'Закрыт' },
		waitsFor: 'Ждёт',
		open: 'Открыто',
		closed: 'Закрыто',
		asOf: 'На ',
		unavailable: ['Эта сборка не смогла прочитать issue с GitHub (', '). Смотрите их в ', '.'],
	},
	community: { nsgo: 'Кроссплатформенный нативный UI-движок', telegram: 'NSGo в Telegram', awesome: 'Приложения, библиотеки и ресурсы' },
	sponsors: {
		title: 'Спонсоры',
		description: (name) => `Компании и люди, чья поддержка помогает развивать ${name}.`,
		become: 'Стать спонсором',
		sponsor: 'Поддержать',
		homeText: (name) => `${name} развивается благодаря этим спонсорам.`,
		left: (n) => `Свободно мест: ${n}`,
	},
};

const it: UI = {
	nav: { label: 'Principale', menu: 'Menu', docs: 'Documentazione', roadmap: 'Roadmap', features: 'Funzionalità', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Modifiche', sponsors: 'Sponsor' },
	theme: { name: 'Tema', light: 'Chiaro', dark: 'Scuro', auto: 'Automatico' },
	language: { name: 'Lingua', auto: 'Automatica' },
	start: 'Inizia',
	license: 'MIT',
	other: 'Altro',
	docs: { toc: 'In questa pagina', overview: 'Panoramica', previous: 'Precedente', next: 'Successivo', edit: 'Modifica pagina', pages: 'Documentazione', skip: 'Vai al contenuto', note: 'Nota', tip: 'Suggerimento', caution: 'Attenzione', danger: 'Pericolo', copy: 'Copia', copied: 'Copiato' },
	search: { label: 'Cerca', placeholder: 'Cerca nella documentazione', empty: 'Nessun risultato per', loading: 'Ricerca…', unavailable: 'La ricerca funziona sul sito compilato.', close: 'Chiudi' },
	notFound: { title: 'Pagina non trovata', text: 'Questa pagina non esiste o è stata spostata.', home: 'Torna alla home' },
	roadmap: {
		title: 'Roadmap',
		description: (name) => `Le fasi di ${name}, le loro attività per area e le sottoattività, con avanzamento, pull request e ciò che ciascuna attende, dalle issue di GitHub.`,
		stage: (n) => `Fase ${n}`,
		progress: (done, total) => `${done} di ${total} attività chiuse`,
		subtasks: (done, total) => `${done} di ${total} sottoattività chiuse`,
		status: { done: 'Fatto', blocked: 'Bloccato', review: 'In revisione', progress: 'In corso', planned: 'Pianificato' },
		pull: { open: 'Aperta', draft: 'Bozza', merged: 'Unita', closed: 'Chiusa' },
		waitsFor: 'Attende',
		open: 'Aperto',
		closed: 'Chiuso',
		asOf: 'Al ',
		unavailable: ['Questa build non è riuscita a leggere le issue da GitHub (', '). Consultale su ', '.'],
	},
	community: { nsgo: 'Il motore di UI nativa multipiattaforma', telegram: 'NSGo su Telegram', awesome: 'App, librerie e risorse' },
	sponsors: {
		title: 'Sponsor',
		description: (name) => `Le aziende e le persone il cui sostegno porta avanti ${name}.`,
		become: 'Diventa sponsor',
		sponsor: 'Sponsorizza',
		homeText: (name) => `${name} va avanti grazie a questi sponsor.`,
		left: (n) => (n === 1 ? 'Resta 1 posto' : `Restano ${n} posti`),
	},
};

const vi: UI = {
	nav: { label: 'Chính', menu: 'Menu', docs: 'Tài liệu', roadmap: 'Lộ trình', features: 'Tính năng', github: 'GitHub', community: 'Cộng đồng', feedback: 'Góp ý', changelog: 'Thay đổi', sponsors: 'Nhà tài trợ' },
	theme: { name: 'Giao diện', light: 'Sáng', dark: 'Tối', auto: 'Tự động' },
	language: { name: 'Ngôn ngữ', auto: 'Tự động' },
	start: 'Bắt đầu',
	license: 'MIT',
	other: 'Khác',
	docs: { toc: 'Trên trang này', overview: 'Tổng quan', previous: 'Trước', next: 'Tiếp', edit: 'Sửa trang', pages: 'Tài liệu', skip: 'Chuyển đến nội dung', note: 'Ghi chú', tip: 'Mẹo', caution: 'Thận trọng', danger: 'Nguy hiểm', copy: 'Sao chép', copied: 'Đã sao chép' },
	search: { label: 'Tìm kiếm', placeholder: 'Tìm trong tài liệu', empty: 'Không có kết quả cho', loading: 'Đang tìm…', unavailable: 'Tìm kiếm hoạt động trên trang đã build.', close: 'Đóng' },
	notFound: { title: 'Không tìm thấy trang', text: 'Trang này không tồn tại hoặc đã được chuyển đi.', home: 'Về trang chủ' },
	roadmap: {
		title: 'Lộ trình',
		description: (name) => `Các giai đoạn của ${name}, nhiệm vụ theo lĩnh vực và nhiệm vụ con, cùng tiến độ, pull request và điều mỗi nhiệm vụ đang chờ, từ các issue trên GitHub.`,
		stage: (n) => `Giai đoạn ${n}`,
		progress: (done, total) => `Đã đóng ${done}/${total} nhiệm vụ`,
		subtasks: (done, total) => `Đã đóng ${done}/${total} nhiệm vụ con`,
		status: { done: 'Xong', blocked: 'Bị chặn', review: 'Đang duyệt', progress: 'Đang làm', planned: 'Dự kiến' },
		pull: { open: 'Mở', draft: 'Nháp', merged: 'Đã gộp', closed: 'Đã đóng' },
		waitsFor: 'Đang chờ',
		open: 'Mở',
		closed: 'Đã đóng',
		asOf: 'Tính đến ',
		unavailable: ['Bản dựng này không đọc được issue từ GitHub (', '). Xem tại ', '.'],
	},
	community: { nsgo: 'Engine UI gốc đa nền tảng', telegram: 'NSGo trên Telegram', awesome: 'Ứng dụng, thư viện và tài nguyên' },
	sponsors: {
		title: 'Nhà tài trợ',
		description: (name) => `Các công ty và cá nhân có sự tài trợ giúp ${name} tiếp tục phát triển.`,
		become: 'Trở thành nhà tài trợ',
		sponsor: 'Tài trợ',
		homeText: (name) => `${name} tiếp tục phát triển nhờ các nhà tài trợ này.`,
		left: (n) => `Còn ${n} chỗ trống`,
	},
};

const id: UI = {
	nav: { label: 'Utama', menu: 'Menu', docs: 'Dokumentasi', roadmap: 'Peta jalan', features: 'Fitur', github: 'GitHub', community: 'Komunitas', feedback: 'Masukan', changelog: 'Perubahan', sponsors: 'Sponsor' },
	theme: { name: 'Tema', light: 'Terang', dark: 'Gelap', auto: 'Otomatis' },
	language: { name: 'Bahasa', auto: 'Otomatis' },
	start: 'Mulai',
	license: 'MIT',
	other: 'Lainnya',
	docs: { toc: 'Di halaman ini', overview: 'Ikhtisar', previous: 'Sebelumnya', next: 'Berikutnya', edit: 'Edit halaman', pages: 'Dokumentasi', skip: 'Langsung ke konten', note: 'Catatan', tip: 'Tips', caution: 'Perhatian', danger: 'Bahaya', copy: 'Salin', copied: 'Tersalin' },
	search: { label: 'Cari', placeholder: 'Cari di dokumentasi', empty: 'Tidak ada hasil untuk', loading: 'Mencari…', unavailable: 'Pencarian berfungsi di situs hasil build.', close: 'Tutup' },
	notFound: { title: 'Halaman tidak ditemukan', text: 'Halaman ini tidak ada atau sudah dipindahkan.', home: 'Kembali ke beranda' },
	roadmap: {
		title: 'Peta jalan',
		description: (name) => `Tahapan ${name}, tugas per area dan subtugasnya, dengan kemajuan, pull request, dan apa yang ditunggu masing-masing, dari issue GitHub-nya.`,
		stage: (n) => `Tahap ${n}`,
		progress: (done, total) => `${done} dari ${total} tugas ditutup`,
		subtasks: (done, total) => `${done} dari ${total} subtugas ditutup`,
		status: { done: 'Selesai', blocked: 'Terhambat', review: 'Ditinjau', progress: 'Berjalan', planned: 'Direncanakan' },
		pull: { open: 'Terbuka', draft: 'Draf', merged: 'Digabung', closed: 'Ditutup' },
		waitsFor: 'Menunggu',
		open: 'Terbuka',
		closed: 'Ditutup',
		asOf: 'Per ',
		unavailable: ['Build ini tidak dapat membaca issue dari GitHub (', '). Lihat di ', '.'],
	},
	community: { nsgo: 'Mesin UI native lintas platform', telegram: 'NSGo di Telegram', awesome: 'Aplikasi, pustaka, dan sumber daya' },
	sponsors: {
		title: 'Sponsor',
		description: (name) => `Perusahaan dan orang-orang yang dukungannya membuat ${name} terus berjalan.`,
		become: 'Jadi sponsor',
		sponsor: 'Sponsori',
		homeText: (name) => `${name} terus berjalan berkat para sponsor ini.`,
		left: (n) => `Tersisa ${n} tempat`,
	},
};

const tr: UI = {
	nav: { label: 'Ana', menu: 'Menü', docs: 'Belgeler', roadmap: 'Yol haritası', features: 'Özellikler', github: 'GitHub', community: 'Topluluk', feedback: 'Geri bildirim', changelog: 'Değişiklikler', sponsors: 'Sponsorlar' },
	theme: { name: 'Tema', light: 'Açık', dark: 'Koyu', auto: 'Otomatik' },
	language: { name: 'Dil', auto: 'Otomatik' },
	start: 'Başlayın',
	license: 'MIT',
	other: 'Diğer',
	docs: { toc: 'Bu sayfada', overview: 'Genel bakış', previous: 'Önceki', next: 'Sonraki', edit: 'Sayfayı düzenle', pages: 'Belgeler', skip: 'İçeriğe geç', note: 'Not', tip: 'İpucu', caution: 'Dikkat', danger: 'Tehlike', copy: 'Kopyala', copied: 'Kopyalandı' },
	search: { label: 'Ara', placeholder: 'Belgelerde ara', empty: 'Sonuç yok:', loading: 'Aranıyor…', unavailable: 'Arama, derlenmiş sitede çalışır.', close: 'Kapat' },
	notFound: { title: 'Sayfa bulunamadı', text: 'Bu sayfa yok ya da taşındı.', home: 'Ana sayfaya dön' },
	roadmap: {
		title: 'Yol haritası',
		description: (name) => `${name} projesinin aşamaları, alanlara göre görevleri ve alt görevleri; her birinin ilerlemesi, pull request’leri ve beklediği şeylerle, GitHub issue’larından.`,
		stage: (n) => `Aşama ${n}`,
		progress: (done, total) => `${total} görevden ${done} tanesi kapandı`,
		subtasks: (done, total) => `${total} alt görevden ${done} tanesi kapandı`,
		status: { done: 'Tamamlandı', blocked: 'Engellendi', review: 'İncelemede', progress: 'Sürüyor', planned: 'Planlandı' },
		pull: { open: 'Açık', draft: 'Taslak', merged: 'Birleştirildi', closed: 'Kapalı' },
		waitsFor: 'Bekliyor',
		open: 'Açık',
		closed: 'Kapalı',
		asOf: 'Tarih: ',
		unavailable: ['Bu derleme GitHub’dan issue’ları okuyamadı (', '). Şurada görün: ', '.'],
	},
	community: { nsgo: 'Çapraz platform yerel UI motoru', telegram: 'Telegram’da NSGo', awesome: 'Uygulamalar, kütüphaneler ve kaynaklar' },
	sponsors: {
		title: 'Sponsorlar',
		description: (name) => `${name} projesini sürdüren şirketler ve kişiler.`,
		become: 'Sponsor ol',
		sponsor: 'Sponsor ol',
		homeText: (name) => `${name} bu sponsorların desteğiyle sürüyor.`,
		left: (n) => `${n} yer kaldı`,
	},
};

export const locales = {
	en: { label: 'English', tag: 'en', og: 'en_US', mark: 'EN', ui: en },
	zh: { label: '简体中文', tag: 'zh-CN', og: 'zh_CN', mark: '简', cjk: true, ui: zh },
	'zh-tw': { label: '繁體中文', tag: 'zh-TW', og: 'zh_TW', mark: '繁', cjk: true, ui: zhTW },
	ja: { label: '日本語', tag: 'ja', og: 'ja_JP', mark: '日', cjk: true, ui: ja },
	ko: { label: '한국어', tag: 'ko', og: 'ko_KR', mark: '한', ui: ko },
	es: { label: 'Español', tag: 'es', og: 'es_ES', mark: 'ES', ui: es },
	fr: { label: 'Français', tag: 'fr', og: 'fr_FR', mark: 'FR', ui: fr },
	de: { label: 'Deutsch', tag: 'de', og: 'de_DE', mark: 'DE', ui: de },
	pt: { label: 'Português', tag: 'pt-BR', og: 'pt_BR', mark: 'PT', ui: pt },
	ru: { label: 'Русский', tag: 'ru', og: 'ru_RU', mark: 'RU', ui: ru },
	it: { label: 'Italiano', tag: 'it', og: 'it_IT', mark: 'IT', ui: it },
	vi: { label: 'Tiếng Việt', tag: 'vi', og: 'vi_VN', mark: 'VI', ui: vi },
	id: { label: 'Bahasa Indonesia', tag: 'id', og: 'id_ID', mark: 'ID', ui: id },
	tr: { label: 'Türkçe', tag: 'tr', og: 'tr_TR', mark: 'TR', ui: tr },
} satisfies Record<string, Locale>;

/** A language the package has the words of, by its code in paths and settings. */
export type Lang = keyof typeof locales;
export const allLangs = Object.keys(locales) as Lang[];
export const isLang = (code: string): code is Lang => code in locales;

/** NSGo's places in a language, the default community menu. */
export function nsgoCommunity(ui: UI): Link[] {
	return [
		{ label: 'NSGo', note: ui.community.nsgo, href: 'https://nsgo.dev', icon: 'nsgo' },
		{ label: ui.community.telegram, note: '@nsgo_dev', href: 'https://t.me/nsgo_dev', icon: 'telegram' },
		{ label: 'Awesome NSGo', note: ui.community.awesome, href: 'https://awesomensgo.dev/', icon: 'star' },
	];
}
