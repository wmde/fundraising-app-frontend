import { mount, VueWrapper } from '@vue/test-utils';
import SuggestedAmountField from '@src/components/shared/form_fields/SuggestedAmountField.vue';

const suggestedAmountInCents = 1600;

describe( 'SuggestedAmountField.vue', () => {
	const getWrapper = (): VueWrapper<any> => {
		return mount( SuggestedAmountField, {
			props: {
				modelValue: suggestedAmountInCents,
				isValid: true,
				suggestedAmountInCents,
				suggestedAmountLabel: 'suggestedAmountLabel',
				customAmountLabel: 'customAmountLabel',
				customAmountPlaceholder: 'customAmountPlaceholder',
				errorMessage: 'errorMessage',
			},
			global: {
				mocks: {
					$n: ( n: number, format: string ) => `${n}-${format}`,
				},
			},
		} );
	};

	test( 'suggested amount is preselected', () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
	} );

	test( 'clicking into custom amount input field does not select the radio field', () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
		expect( wrapper.find( '.text-radio-form-input-radio' ).classes() ).not.toContain( 'checked' );
	} );

	test( 'entering valid custom amounts deselects suggested amount', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeFalsy();
		expect( wrapper.find( '.text-radio-form-input-radio' ).classes() ).toContain( 'checked' );
	} );

	test( 're-selecting custom amount deselects suggested amount', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeFalsy();
		expect( wrapper.find( '.text-radio-form-input-radio' ).classes() ).toContain( 'checked' );

		await wrapper.find<HTMLInputElement>( '#suggested-amount' ).setValue( true );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
		expect( wrapper.find( '.text-radio-form-input-radio' ).classes() ).not.toContain( 'checked' );
	} );

	test( 'custom amount gets cleared when suggested amount is re-selected', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '5500' );

		await wrapper.find<HTMLInputElement>( '#suggested-amount' ).setValue( true );

		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '' );
	} );

	test( 'Formats the amount to decimal when custom amount field is blurred', async () => {
		const wrapper = getWrapper();

		// We have to manually set the model value to the integer we expect because we can't do the round trip
		await wrapper.setProps( { modelValue: 2342 } );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '23,42' );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'blur' );

		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '23.42-decimal' );
	} );
} );
