// The sponsors page of a language.
import { SponsorsPage } from '../../components/SponsorsPage';
import type { Lang } from '../../config';


export function Page(props: { lang: Lang }) {
	return <SponsorsPage lang={props.lang} />;
}
