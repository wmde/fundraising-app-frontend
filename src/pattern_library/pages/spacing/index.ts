import { Page } from '@src/pattern_library/pages/Page';

const name = 'Spacing';
const url = 'spacing';
import content from './content.md';

import spacing from '@src/pattern_library/css/variables/spacing.css?raw';

const codeSamples = [
	{ name: 'spacing.css', code: spacing },
];

export default { name, url, content, codeSamples } as Page;
