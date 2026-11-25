// The roadmap page of a language, from the tracking issue's sub-issues.
import { RoadmapPage } from '../../components/RoadmapPage';
import type { Lang } from '../../config';


export function Page(props: { lang: Lang }) {
	return <RoadmapPage lang={props.lang} />;
}
