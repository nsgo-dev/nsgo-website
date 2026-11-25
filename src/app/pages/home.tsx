// The home page of a language, from the home setting.
import { HomePage } from '../../components/HomePage';
import type { Lang } from '../../config';


export function Page(props: { lang: Lang }) {
	return <HomePage lang={props.lang} />;
}
