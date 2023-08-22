import { mount, VueWrapper } from '@vue/test-utils';
import AmountSelection from '@src/components/shared/AmountSelection.vue';

describe( 'AmountSelection.vue', () => {
	const getWrapper = ( amount: string, paymentAmounts: number[] = [ 500, 1000, 10000, 29900 ], minimumAmount: number = 0 ): VueWrapper<any> => {
		return mount( AmountSelection, {
			props: {
				amount,
				minimumAmount,
				paymentAmounts,
			},
		} );
	};

	it( 'emits amount event when amount is selected', async () => {
		const wrapper = getWrapper( '' );

		await wrapper.find( '#amount-29900' ).trigger( 'change' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '29900' ] );
	} );

	it( 'emits amount event when custom amount is entered', () => {
		const wrapper = getWrapper( '', [ 500 ] );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '23' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '2300' ] );
	} );

	it( 'converts custom amounts with decimal point to cent amounts', () => {
		const wrapper = getWrapper( '', [ 500 ] );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '12.34' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '1234' ] );
	} );

	it( 'converts custom amounts with comma to cent amounts', () => {
		const wrapper = getWrapper( '', [ 500 ] );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '23,42' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '2342' ] );
	} );

	it( 'cuts off cent fractions from custom amounts', () => {
		const wrapper = getWrapper( '', [ 500 ] );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '23,429' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '2342' ] );
	} );

	it( 'emits empty string when custom amount is invalid', () => {
		const wrapper = getWrapper( '', [ 500 ] );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( 'hi mom!' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '' ] );
	} );

	it( 'does not trigger an amount check when amount is selected and custom amount is empty', () => {
		const wrapper = getWrapper( '500' );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeFalsy();
	} );

	it( 'triggers an amount check in the store when custom value is empty and no amount is selected', () => {
		const wrapper = getWrapper( '' );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '' );
		customAmountInput.trigger( 'blur' );

		expect( wrapper.emitted( 'amount-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'amount-selected' )![ 0 ] ).toEqual( [ '' ] );
	} );

	it( 'clears selected amount when custom amount is entered', () => {
		const wrapper = getWrapper( '' );

		const presetAmount = wrapper.find( '#amount-29900' );
		const customAmountInput = wrapper.find( '#amount-custom' );
		presetAmount.trigger( 'click' );
		customAmountInput.setValue( '1998' );
		customAmountInput.trigger( 'blur' );

		// Can't access (computed) property on generic Vue instance,
		// see https://github.com/vuejs/vue-test-utils/issues/255
		expect( ( wrapper.vm as any ).selectedAmount ).toBe( 0 );
	} );

	it( 'clears custom amount when amount is selected', () => {
		const wrapper = getWrapper( '' );

		const customAmountInput = wrapper.find( '#amount-custom' );
		customAmountInput.setValue( '5' );
		customAmountInput.trigger( 'blur' );
		wrapper.find( '#amount-29900' ).trigger( 'click' );

		expect( ( wrapper.vm as any ).customAmount ).toBe( '' );
	} );

	it( 'prevents amount selection for choices that are below minimum amount', () => {
		const wrapper = getWrapper( '', [ 500, 1000, 10000, 29900 ], 1000 );

		const belowChoice = wrapper.find( '#amount-500' );

		expect( belowChoice.attributes().disabled ).toBeDefined();
		expect( belowChoice.element.parentElement!.className ).toContain( 'inactive' );

		[ 1000, 10000, 29900 ].forEach( amount => {
			const aboveChoice = wrapper.find( `#amount-${amount}` );
			expect( aboveChoice.element.getAttribute( 'disabled' ) ).toBeFalsy();
			expect( aboveChoice.element.parentElement!.className ).not.toContain( 'inactive' );
		} );

	} );

	it( 'does not select amounts for choices that are below minimum amount', () => {
		const wrapper = getWrapper( '500', [ 500, 1000, 10000, 29900 ], 1000 );

		const belowChoice = wrapper.find( '#amount-500' );

		expect( ( belowChoice.element as HTMLInputElement ).checked ).toBeFalsy();
	} );

	it( 'localises choices', () => {
		const $n = jest.fn();
		mount( AmountSelection, {
			props: {
				amount: '',
				minimumAmount: 1000,
				paymentAmounts: [ 500, 1000, 10000, 29900 ],
				validateAmountUrl: 'https://example.com/amount-check',
			},
			global: {
				mocks: {
					$n,
				},
			},
		} );

		expect( $n ).toHaveBeenCalledWith( 5, expect.anything() );
		expect( $n ).toHaveBeenCalledWith( 10, expect.anything() );
		expect( $n ).toHaveBeenCalledWith( 100, expect.anything() );
		expect( $n ).toHaveBeenCalledWith( 299, expect.anything() );
	} );
} );
