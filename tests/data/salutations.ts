import type { Salutation } from '@src/view_models/Salutation';

export const salutations: Salutation[] = [
	{
		label: 'Herr',
		value: 'Herr',
		display: 'Herr',
		greetings: {
			formal: 'Good day',
			informal: 'Yo!',
			lastNameInformal: 'My Herr!',
		},
	},
	{
		label: 'Frau',
		value: 'Frau',
		display: 'Frau',
		greetings: {
			formal: 'Good day',
			informal: 'Yo!',
			lastNameInformal: 'My Frau!',
		},
	},
];

export default salutations;
