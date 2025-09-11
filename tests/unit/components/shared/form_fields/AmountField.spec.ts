import { mount, VueWrapper } from '@vue/test-utils';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';

describe( 'AmountField.vue', () => {

	const getWrapper = ( modelValue: string = '' ): VueWrapper<any> => {
		return mount( AmountField, {
			props: {
				modelValue,
				paymentAmounts: [ 500, 1000, 10000, 29900 ],
			},
			global: {
				mocks: {
					$n: ( n: number, format: string ) => `${n}-${format}`,
				},
			},
		} );
	};

	it( 'shows errors', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showError: true, errorMessage: 'I haz errorz' } );

		expect( wrapper.find( '.help.is-danger' ).text() ).toStrictEqual( 'I haz errorz' );
	} );

	it( 'emits amount event when amount is selected', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '29900' ] );
	} );

	it( 'emits amount event when custom amount is entered', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( '23' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '2300' ] );
	} );

	it( 'converts custom amounts with decimal point to cent amounts', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( '12.34' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '1234' ] );
	} );

	it( 'converts custom amounts with comma to cent amounts', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( '23,42' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '2342' ] );
	} );

	it( 'cuts off cent fractions from custom amounts', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( '23,429' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '2342' ] );
	} );

	it( 'emits empty string when custom amount is invalid', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( 'hi mom!' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ) ).toBeTruthy();
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toEqual( [ '' ] );
	} );

	it( 'does not trigger field change on custom amount blur when amount is selected and custom amount is empty', async () => {
		const wrapper = getWrapper( '29900' );
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' ) ).toBeFalsy();
	} );

	it( 'triggers field change on custom amount blur when custom value is empty and no amount is selected', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' ) ).toBeTruthy();
	} );

	it( 'clears selected amount when custom amount is entered', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

		expect( wrapper.find( '.radio-form-input.is-active input[value="29900"]' ).exists() ).toBeTruthy();

		await customAmountInput.setValue( '1998' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.find( '.radio-form-input.active input[value="29900"]' ).exists() ).toBeFalsy();
	} );

	it( 'unsets custom amount when amount is selected', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		await customAmountInput.setValue( '1998' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.find( '.form-field-amount-custom.active' ).exists() ).toBeTruthy();

		await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

		expect( wrapper.find( '.form-field-amount-custom.active' ).exists() ).toBeFalsy();
	} );

	it( 'custom amount radio is not activated by click', async () => {
		const wrapper = getWrapper();
		const customAmountRadioElement = wrapper.find( '.text-radio-form-input-radio' );

		await customAmountRadioElement.trigger( 'click' );

		expect( wrapper.find( '.form-field-amount-custom.active' ).exists() ).toBeFalsy();
	} );

	it( 'Checks the custom amount radio when value is custom', async () => {
		const wrapper = getWrapper();
		const customAmountInput = wrapper.find( '#amount-custom' );

		expect( wrapper.find<HTMLInputElement>( '.text-radio-form-input-radio' ).element.checked ).toBeFalsy();

		await customAmountInput.setValue( '1998' );
		await customAmountInput.trigger( 'blur' );

		expect( wrapper.find<HTMLInputElement>( '.text-radio-form-input-radio' ).element.checked ).toBeTruthy();

		await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

		expect( wrapper.find<HTMLInputElement>( '.text-radio-form-input-radio' ).element.checked ).toBeFalsy();
	} );

	it( 'does not select amounts for choices that are below minimum amount', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { minimumAmount: 1000 } );

		const belowChoice = wrapper.find<HTMLInputElement>( 'input[value="500"]' );

		await belowChoice.trigger( 'change' );

		expect( belowChoice.element.checked ).toBeFalsy();
	} );

	it( 'localises choices', () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.form-field-amount-radio:nth-child(1) .control-label' ).text() ).toStrictEqual( '5-euros' );
		expect( wrapper.find( '.form-field-amount-radio:nth-child(2) .control-label' ).text() ).toStrictEqual( '10-euros' );
		expect( wrapper.find( '.form-field-amount-radio:nth-child(3) .control-label' ).text() ).toStrictEqual( '100-euros' );
		expect( wrapper.find( '.form-field-amount-radio:nth-child(4) .control-label' ).text() ).toStrictEqual( '299-euros' );
	} );

	it( 'sets aria-describedby', async () => {
		const wrapper = getWrapper();
		expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 0 );

		await wrapper.setProps( { ariaDescribedby: 'help-text' } );

		expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 5 );
		expect( wrapper.find( '#amount-custom' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'help-text' );

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( '#amount-custom' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'help-text amount-error' );
	} );
} );
