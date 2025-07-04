import { Pattern } from '@src/pattern_library/patterns/Pattern';

const name = 'IBAN Calculator';
const url = 'iban-calculator';
import description from './description.md';
import html from './markup.html?raw';
import examples from './Examples.vue';
import css from '../../css/blocks/iban-calculator.css?raw';

export default { name, url, description, html, examples, css } as Pattern;
