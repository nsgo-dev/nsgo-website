// The home page in English, the project's own: its settings say home: false.
import { createFileRoute } from '@tanstack/solid-router';
import { pageHead } from 'nsgo-website/components';
import { site } from 'nsgo-website/site';
import { Home } from '../components/Home';

export const Route = createFileRoute('/')({
	head: () => pageHead('en', { title: site.en.title, path: '', home: true }),
	component: () => <Home lang="en" />,
});
