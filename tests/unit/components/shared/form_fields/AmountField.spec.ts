import { mount, VueWrapper } from '@vue/test-utils';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import { nextTick } from 'vue';

describe( 'AmountField.vue', () => {

	const getWrapper = ( modelValue: string = '', slots: { message?: string } = {} ): VueWrapper<any> => {
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
			slots,
			attachTo: document.body,
		} );
	};

	describe( 'functionality tests', () => {
		it( 'shows errors', async () => {
			const wrapper = getWrapper();

			expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();

			await wrapper.setProps( { showError: true, errorMessage: 'I haz errorz' } );

			expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();
		} );

		it( 'shows messages', async () => {
			const wrapper = getWrapper( '', {
				message: '1 million dollars!',
			} );

			expect( wrapper.find( '.field-container__message' ).exists() ).toBeTruthy();
			expect( wrapper.find( '.field-container__message' ).text() ).toStrictEqual( '1 million dollars!' );
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

			expect( wrapper.find<HTMLInputElement>( 'input[value="29900"]' ).element.checked ).toBeTruthy();

			await customAmountInput.setValue( '1998' );
			await customAmountInput.trigger( 'blur' );

			expect( wrapper.find<HTMLInputElement>( 'input[type="radio"]' ).element.checked ).toBeFalsy();
		} );

		it( 'unsets custom amount when amount is selected', async () => {
			const wrapper = getWrapper();
			const customAmountInput = wrapper.find( '#amount-custom' );

			await customAmountInput.setValue( '1998' );
			await customAmountInput.trigger( 'blur' );

			// Vue test utils outputs the value '1998-decimal' so test that just the value is in there
			expect( wrapper.find<HTMLInputElement>( 'input[type="text"]' ).element.value ).toContain( '1998' );

			await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

			expect( wrapper.find<HTMLInputElement>( 'input[type="text"]' ).element.value ).toStrictEqual( '' );
		} );

		it( 'custom amount is focused on radio click', async () => {
			const wrapper = getWrapper();

			await wrapper.find( '.text-radio__radio' ).trigger( 'click' );
			await nextTick();

			expect( document.activeElement ).toStrictEqual( wrapper.find( '#amount-custom' ).element );
		} );

		it( 'Checks the custom amount radio when value is custom', async () => {
			const wrapper = getWrapper();
			const customAmountInput = wrapper.find( '#amount-custom' );

			expect( wrapper.find( '.text-radio__radio' ).classes() ).not.toContain( 'text-radio__radio--checked' );

			await customAmountInput.setValue( '1998' );
			await customAmountInput.trigger( 'blur' );

			expect( wrapper.find( '.text-radio__radio' ).classes() ).toContain( 'text-radio__radio--checked' );

			await wrapper.find( 'input[value="29900"]' ).trigger( 'change' );

			expect( wrapper.find( '.text-radio__radio' ).classes() ).not.toContain( 'text-radio__radio--checked' );
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

			expect( wrapper.find( '#amount-500 + span' ).text() ).toStrictEqual( '5-euros' );
			expect( wrapper.find( '#amount-1000 + span' ).text() ).toStrictEqual( '10-euros' );
			expect( wrapper.find( '#amount-10000 + span' ).text() ).toStrictEqual( '100-euros' );
			expect( wrapper.find( '#amount-29900 + span' ).text() ).toStrictEqual( '299-euros' );
		} );
	} );

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper( '', {
				message: '1 million dollars!',
			} );

			expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 5 );
			expect( wrapper.find( '#amount-custom' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'amount-message' );

			await wrapper.setProps( { showError: true } );

			expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 5 );
			expect( wrapper.find( '#amount-custom' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'amount-error' );

			await wrapper.setProps( { ariaDescribedby: 'extra-label' } );

			expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 5 );
			expect( wrapper.find( '#amount-custom' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'amount-error extra-label' );
		} );
	} );
} );
