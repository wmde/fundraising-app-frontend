import { Page } from '@src/pattern_library/pages/Page';

const name = 'CSS Variables';
const url = 'css-variables';
import content from './content.md';

import type from '@src/pattern_library/css/variables/type.css?raw';
import spacing from '@src/pattern_library/css/variables/spacing.css?raw';
import color from '@src/pattern_library/css/variables/color.css?raw';
import global from '@src/pattern_library/css/variables/global.css?raw';

const codeSamples = [
	{ name: 'type.css', code: type },
	{ name: 'spacing.css', code: spacing },
	{ name: 'color.css', code: color },
	{ name: 'global.css', code: global },
];

export default { name, url, content, codeSamples } as Page;
