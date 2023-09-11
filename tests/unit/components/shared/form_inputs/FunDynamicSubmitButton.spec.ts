import { mount } from '@vue/test-utils';
import FunDynamicSubmitButton from '@src/components/shared/form_inputs/FunDynamicSubmitButton.vue';

describe( 'FunDynamicSubmitButton.vue', () => {

	const cases = [
		[ 'PPL', 'donation_form_finalize_paypal' ],
		[ 'UEB', 'donation_form_finalize_bank_transfer' ],
		[ 'MCP', 'donation_form_finalize_credit_card' ],
		[ 'SUB', 'donation_form_finalize_sofort' ],
		[ 'blabla', 'donation_form_finalize' ],
		[ 'BEZ', 'donation_form_finalize' ],
		[ '', 'donation_form_finalize' ],
	];

	test.each( cases )(
		'given payment method %p the submit button shows %p',
		( paymentMethod :string, expectedTranslationKey: string ) => {

			const wrapper = mount( FunDynamicSubmitButton, {
				props: {
					buttonValue: 'submit',
					paymentType: paymentMethod,
				},
			} );
			expect( wrapper.text() ).toEqual( expectedTranslationKey );
		}
	);
} );
