import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { Validity } from '@src/view_models/Validity';
import { nextTick } from 'vue';

describe( 'ErrorSummary.vue', () => {

	afterEach( () => {
		document.getElementsByTagName( 'html' )[ 0 ].innerHTML = '';
	} );

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( ErrorSummary, {
			props: {
				isVisible: false,
				items: [
					{
						validity: Validity.INVALID,
						message: 'donation_form_error_summary_amount',
						focusElement: 'amount-500',
						scrollElement: 'payment-form-amount',
					},
					{
						validity: Validity.INVALID,
						message: 'donation_form_error_summary_payment_type',
						focusElement: 'paymentType-0',
						scrollElement: 'payment-form-type',
					},
				],
				focusOnSubmit: true,
			},
			attachTo: document.body,
		} );
	};

	it( 'Focuses the summary when it becomes visible', async () => {
		const scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		const wrapper = getWrapper();

		await wrapper.setProps( { isVisible: true } );
		await nextTick();

		expect( document.activeElement ).toStrictEqual( wrapper.element );
		expect( scrollElement.scrollIntoView ).toHaveBeenCalledWith( { behavior: 'auto' } );
	} );

	it( 'Does not focus the summary when it becomes visible and focusOnSubmit is false', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { focusOnSubmit: false } );
		await wrapper.setProps( { isVisible: true } );
		await nextTick();

		expect( document.activeElement ).toStrictEqual( document.body );
	} );

	it( 'Focuses and scrolls the invalid field when a summary item is clicked', async () => {
		const focusElement = { focus: jest.fn() };
		const scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: ( id: string ) => {
			switch ( id ) {
				case 'amount-500':
					return focusElement;
				case 'payment-form-amount':
					return scrollElement;
				default:
					return { scrollIntoView: () => {} };
			}
		} } );
		const wrapper = getWrapper();

		await wrapper.setProps( { isVisible: true } );
		await nextTick();
		await wrapper.find( '[href="#amount-500"]' ).trigger( 'click' );

		expect( focusElement.focus ).toHaveBeenCalledWith( { preventScroll: true } );
		expect( scrollElement.scrollIntoView ).toHaveBeenCalledWith( { behavior: 'auto' } );
	} );

	it( 'Focuses the the invalid field only when a summary item is clicked and no scroll item exists', async () => {
		const element = { focus: jest.fn(), scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: ( id: string ) => {
			switch ( id ) {
				case 'amount-500':
					return element;
				case 'payment-form-amount':
					return null;
				default:
					return { scrollIntoView: () => {} };
			}
		} } );
		const wrapper = getWrapper();

		await wrapper.setProps( { isVisible: true } );
		await nextTick();
		await wrapper.find( '[href="#amount-500"]' ).trigger( 'click' );

		expect( element.focus ).toHaveBeenCalledWith( { preventScroll: false } );
	} );
} );
