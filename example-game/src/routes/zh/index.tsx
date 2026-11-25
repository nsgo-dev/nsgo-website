// The home page in Chinese.
import { createFileRoute } from '@tanstack/solid-router';
import { pageHead } from 'nsgo-website/components';
import { site } from 'nsgo-website/site';
import { Home } from '../../components/Home';

export const Route = createFileRoute('/zh/')({
	head: () => pageHead('zh', { title: site.zh.title, path: '', home: true }),
	component: () => <Home lang="zh" />,
});
