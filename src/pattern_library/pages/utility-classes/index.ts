import { Page } from '@src/pattern_library/pages/Page';

const name = 'Utility Classes';
const url = 'utility-classes';
import content from './content.md';

import footerBottom from '@src/pattern_library/css/utilities/footer-bottom.css?raw';
import linkButton from '@src/pattern_library/css/utilities/link-button.css?raw';
import sticky from '@src/pattern_library/css/utilities/sticky.css?raw';
import visuallyHidden from '@src/pattern_library/css/utilities/visually-hidden.css?raw';

const codeSamples = [
	{ name: 'footer-bottom.css', code: footerBottom },
	{ name: 'link-button.css', code: linkButton },
	{ name: 'sticky.css', code: sticky },
	{ name: 'visually-hidden.css', code: visuallyHidden },
];

export default { name, url, content, codeSamples } as Page;
