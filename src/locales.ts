// Every language a site may turn on, with the words of the site's frame in
// it: the header, its menus, the footer and the roadmap. A site lists the
// ones it uses in its languages setting; the first is served at the root and
// each other under its code, as zh/ or ja/. A project changes the plain words
// with its strings setting.
import type { Link } from './config';

export interface UI {
	nav: Record<'label' | 'menu' | 'docs' | 'roadmap' | 'features' | 'github' | 'community' | 'feedback' | 'changelog', string>;
	theme: Record<'name' | 'light' | 'dark' | 'auto', string>;
	language: Record<'name' | 'auto', string>;
	start: string;
	license: string;
	/** The area of roadmap tasks whose titles name none. */
	other: string;
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
}

export interface Locale {
	/** Its name in itself, as the language menu lists it. */
	label: string;
	/** Its BCP-47 tag, for lang attributes, Starlight and dates. */
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
	nav: { label: 'Main', menu: 'Menu', docs: 'Docs', roadmap: 'Roadmap', features: 'Features', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Changelog' },
	theme: { name: 'Theme', light: 'Light', dark: 'Dark', auto: 'Auto' },
	language: { name: 'Language', auto: 'Auto' },
	start: 'Get started',
	license: 'MIT',
	other: 'Other',
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
};

const zh: UI = {
	nav: { label: '主导航', menu: '菜单', docs: '文档', roadmap: '路线图', features: '功能', github: 'GitHub', community: '社区', feedback: '反馈', changelog: '更新日志' },
	theme: { name: '主题', light: '浅色', dark: '深色', auto: '自动' },
	language: { name: '语言', auto: '自动' },
	start: '入门指南',
	license: 'MIT',
	other: '其他',
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
};

const zhTW: UI = {
	nav: { label: '主導覽', menu: '選單', docs: '文件', roadmap: '路線圖', features: '功能', github: 'GitHub', community: '社群', feedback: '意見回饋', changelog: '更新紀錄' },
	theme: { name: '主題', light: '淺色', dark: '深色', auto: '自動' },
	language: { name: '語言', auto: '自動' },
	start: '入門指南',
	license: 'MIT',
	other: '其他',
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
};

const ja: UI = {
	nav: { label: 'メイン', menu: 'メニュー', docs: 'ドキュメント', roadmap: 'ロードマップ', features: '機能', github: 'GitHub', community: 'コミュニティ', feedback: 'フィードバック', changelog: '変更履歴' },
	theme: { name: 'テーマ', light: 'ライト', dark: 'ダーク', auto: '自動' },
	language: { name: '言語', auto: '自動' },
	start: 'はじめる',
	license: 'MIT',
	other: 'その他',
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
};

const ko: UI = {
	nav: { label: '주요', menu: '메뉴', docs: '문서', roadmap: '로드맵', features: '기능', github: 'GitHub', community: '커뮤니티', feedback: '피드백', changelog: '변경 내역' },
	theme: { name: '테마', light: '라이트', dark: '다크', auto: '자동' },
	language: { name: '언어', auto: '자동' },
	start: '시작하기',
	license: 'MIT',
	other: '기타',
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
};

const es: UI = {
	nav: { label: 'Principal', menu: 'Menú', docs: 'Documentación', roadmap: 'Hoja de ruta', features: 'Funciones', github: 'GitHub', community: 'Comunidad', feedback: 'Comentarios', changelog: 'Cambios' },
	theme: { name: 'Tema', light: 'Claro', dark: 'Oscuro', auto: 'Automático' },
	language: { name: 'Idioma', auto: 'Automático' },
	start: 'Empezar',
	license: 'MIT',
	other: 'Otros',
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
};

const fr: UI = {
	nav: { label: 'Principal', menu: 'Menu', docs: 'Documentation', roadmap: 'Feuille de route', features: 'Fonctionnalités', github: 'GitHub', community: 'Communauté', feedback: 'Retours', changelog: 'Changements' },
	theme: { name: 'Thème', light: 'Clair', dark: 'Sombre', auto: 'Automatique' },
	language: { name: 'Langue', auto: 'Automatique' },
	start: 'Commencer',
	license: 'MIT',
	other: 'Autres',
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
};

const de: UI = {
	nav: { label: 'Haupt', menu: 'Menü', docs: 'Dokumentation', roadmap: 'Roadmap', features: 'Funktionen', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Änderungen' },
	theme: { name: 'Design', light: 'Hell', dark: 'Dunkel', auto: 'Automatisch' },
	language: { name: 'Sprache', auto: 'Automatisch' },
	start: 'Loslegen',
	license: 'MIT',
	other: 'Sonstiges',
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
};

const pt: UI = {
	nav: { label: 'Principal', menu: 'Menu', docs: 'Documentação', roadmap: 'Roteiro', features: 'Recursos', github: 'GitHub', community: 'Comunidade', feedback: 'Feedback', changelog: 'Alterações' },
	theme: { name: 'Tema', light: 'Claro', dark: 'Escuro', auto: 'Automático' },
	language: { name: 'Idioma', auto: 'Automático' },
	start: 'Começar',
	license: 'MIT',
	other: 'Outros',
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
};

const ru: UI = {
	nav: { label: 'Основное', menu: 'Меню', docs: 'Документация', roadmap: 'Дорожная карта', features: 'Возможности', github: 'GitHub', community: 'Сообщество', feedback: 'Отзывы', changelog: 'Изменения' },
	theme: { name: 'Тема', light: 'Светлая', dark: 'Тёмная', auto: 'Авто' },
	language: { name: 'Язык', auto: 'Авто' },
	start: 'Начать',
	license: 'MIT',
	other: 'Другое',
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
};

const it: UI = {
	nav: { label: 'Principale', menu: 'Menu', docs: 'Documentazione', roadmap: 'Roadmap', features: 'Funzionalità', github: 'GitHub', community: 'Community', feedback: 'Feedback', changelog: 'Modifiche' },
	theme: { name: 'Tema', light: 'Chiaro', dark: 'Scuro', auto: 'Automatico' },
	language: { name: 'Lingua', auto: 'Automatica' },
	start: 'Inizia',
	license: 'MIT',
	other: 'Altro',
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
};

const vi: UI = {
	nav: { label: 'Chính', menu: 'Menu', docs: 'Tài liệu', roadmap: 'Lộ trình', features: 'Tính năng', github: 'GitHub', community: 'Cộng đồng', feedback: 'Góp ý', changelog: 'Thay đổi' },
	theme: { name: 'Giao diện', light: 'Sáng', dark: 'Tối', auto: 'Tự động' },
	language: { name: 'Ngôn ngữ', auto: 'Tự động' },
	start: 'Bắt đầu',
	license: 'MIT',
	other: 'Khác',
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
};

const id: UI = {
	nav: { label: 'Utama', menu: 'Menu', docs: 'Dokumentasi', roadmap: 'Peta jalan', features: 'Fitur', github: 'GitHub', community: 'Komunitas', feedback: 'Masukan', changelog: 'Perubahan' },
	theme: { name: 'Tema', light: 'Terang', dark: 'Gelap', auto: 'Otomatis' },
	language: { name: 'Bahasa', auto: 'Otomatis' },
	start: 'Mulai',
	license: 'MIT',
	other: 'Lainnya',
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
};

const tr: UI = {
	nav: { label: 'Ana', menu: 'Menü', docs: 'Belgeler', roadmap: 'Yol haritası', features: 'Özellikler', github: 'GitHub', community: 'Topluluk', feedback: 'Geri bildirim', changelog: 'Değişiklikler' },
	theme: { name: 'Tema', light: 'Açık', dark: 'Koyu', auto: 'Otomatik' },
	language: { name: 'Dil', auto: 'Otomatik' },
	start: 'Başlayın',
	license: 'MIT',
	other: 'Diğer',
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
