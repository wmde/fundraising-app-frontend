import { Pattern } from '@src/pattern_library/patterns/Pattern';
import sectionHeading from '@src/pattern_library/patterns/section-heading';

const patterns: Pattern[] = [
	sectionHeading,
];

export interface Content {
	patterns: Pattern[];
}

export const content: Content = {
	patterns,
};
