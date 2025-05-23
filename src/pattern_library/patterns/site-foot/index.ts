import { Pattern } from '@src/pattern_library/patterns/Pattern';

const name = 'Site Foot';
const url = 'site-foot';
import description from './description.md';
import html from './markup.html?raw';
import examples from './Examples.vue';
import css from '../../css/blocks/site-foot.css?raw';

export default { name, url, description, html, examples, css } as Pattern;
