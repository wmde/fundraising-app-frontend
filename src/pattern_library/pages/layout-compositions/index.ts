import { Page } from '@src/pattern_library/pages/Page';

const name = 'Layout Compositions';
const url = 'layout-compositions';
import content from './content.md';

import cluster from '@src/pattern_library/css/compositions/cluster.css?raw';
import flow from '@src/pattern_library/css/compositions/flow.css?raw';
import grid from '@src/pattern_library/css/compositions/grid.css?raw';
import repel from '@src/pattern_library/css/compositions/repel.css?raw';
import sidebar from '@src/pattern_library/css/compositions/sidebar.css?raw';
import switcher from '@src/pattern_library/css/compositions/switcher.css?raw';
import wrapper from '@src/pattern_library/css/compositions/wrapper.css?raw';

const codeSamples = [
	{ name: 'cluster.css', code: cluster },
	{ name: 'flow.css', code: flow },
	{ name: 'grid.css', code: grid },
	{ name: 'repel.css', code: repel },
	{ name: 'sidebar.css', code: sidebar },
	{ name: 'switcher.css', code: switcher },
	{ name: 'wrapper.css', code: wrapper },
];

export default { name, url, content, codeSamples } as Page;
