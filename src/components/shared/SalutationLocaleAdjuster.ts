import { Salutation } from '@src/view_models/Salutation';

/*
* This is used when a user changes language on the address form
* It takes the old salutation and looks to see if there's a locale
* for it. If you're thinking of improving it, please don't. There
* is already a proposal for improving it here:
*
* https://phabricator.wikimedia.org/T317388
*/

const salutationValueTranslations: Record<string, string> = {
	'Herr': 'Mr',
	'Frau': 'Ms',
	'Mr': 'Herr',
	'Ms': 'Frau',
	'No Salutation': 'Keine Anrede',
	'Keine Anrede': 'No Salutation',
};

export const adjustSalutationLocaleIfNeeded = ( salutations: Array<Salutation>, salutation: string ): string => {
	if ( salutation === '' ) {
		return '';
	}

	const currentSalutation = salutations.find( s => s.value === salutation );

	if ( currentSalutation !== undefined ) {
		return salutation;
	}

	return salutationValueTranslations[ salutation ] ?? '';
};
