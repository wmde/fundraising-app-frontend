import { Page } from '@src/pattern_library/pages/Page';

const name = 'Colour Definitions';
const url = 'colors';
import content from './content.md';

import color from '@src/pattern_library/css/variables/color.css?raw';

const codeSamples = [
	{ name: 'color.css', code: color },
];

export default { name, url, content, codeSamples } as Page;
