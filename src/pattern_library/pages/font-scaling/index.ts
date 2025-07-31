import { Page } from '@src/pattern_library/pages/Page';

const name = 'Font Scaling';
const url = 'font-scaling';
import content from './content.md';

import type from '@src/pattern_library/css/variables/type.css?raw';

const codeSamples = [
	{ name: 'type.css', code: type },
];

export default { name, url, content, codeSamples } as Page;
