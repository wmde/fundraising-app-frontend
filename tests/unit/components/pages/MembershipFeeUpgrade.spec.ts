import { mount, VueWrapper } from '@vue/test-utils';
import MembershipFeeUpgrade from '@src/components/pages/MembershipFeeUpgrade.vue';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import { nextTick } from 'vue';

const uuid = '28178402-56ef-4977-87d9-c681c29bb823';
const currentAmountInCents = 1000;
const suggestedAmountInCents = 1600;
const currentInterval = 3;

describe( 'MembershipFeeUpgrade.vue', () => {
	const getWrapper = ( feeChangeFrontendFlag: 'SHOW_FEE_CHANGE_FORM' | 'SHOW_FEE_ALREADY_CHANGED_PAGE' | 'SHOW_ERROR_PAGE' = 'SHOW_FEE_CHANGE_FORM' ): VueWrapper<any> => {
		return mount( MembershipFeeUpgrade, {
			props: {
				uuid,
				currentAmountInCents,
				suggestedAmountInCents,
				currentInterval,
				feeChangeFrontendFlag,
			},
			global: {
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
					membershipFeeChangeResource: { put: () => Promise.resolve( { status: 'OK' } ) },
				},
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

	// TODO We need to define when we format the amount.
	//      The current way of doing things (dividing & formatting with "decimal" on blur and again on submit) is wrong/brittle/inconsistent
	//      Membership fee should always be an integer, the field should throw away the decimals on blur
	xtest( 'German formatted decimal custom amount gets formatted with euro format', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '23,42' );

		// Our "euro" format will cut off the decimals
		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '23.42-euro' );
	} );

	// Cannot work because
	//  - the button click does not trigger the form submit (might change if we attach the element, see https://test-utils.vuejs.org/guide/essentials/forms#Native-form-submission
	//  - side effects of error summary element which calls `scrollIntoView` and expects elements to be there
	xtest( 'shows and hides member name error message once user starts typing in the field', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );
		await nextTick();

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLElement>( '#member-name-error' ).exists() ).toBeTruthy();

		await wrapper.find<HTMLInputElement>( '#member-name' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#member-name' ).setValue( 'valid example name' );

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeFalsy();
		expect( wrapper.find<HTMLElement>( '#member-name-error' ).exists() ).toBeFalsy();

	} );

	// skipping because it's not clear what exactly to test - submitting a fully empty form, checking that IBAN is not amoung the errors?
	xtest( 'does not show error message for IBAN if IBAN is empty', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = '';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeFalsy();
		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeFalsy();
	} );

	// Skipping because
	// - we need to fix the error summary interaction
	// - we need to mock the IBAN validation service to avoid HTTP calls
	xtest( 'shows IBAN error message', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'DEinvalidIBANxyz';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeTruthy();
	} );

	// Skipping because
	// - we need to fix the error summary interaction
	// - we need to mock the IBAN validation service to avoid HTTP calls
	xtest( 'hides IBAN error message when user starts typing', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'DEinvalidIBANxyz';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeTruthy();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'n';

		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeFalsy();
	} );

	test( 'shows form page content if flag is set to form page', () => {
		const wrapper = getWrapper( 'SHOW_FEE_CHANGE_FORM' );

		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'shows error page content if flag ss set to error', () => {
		const wrapper = getWrapper( 'SHOW_ERROR_PAGE' );

		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'shows returning page content if flag is set to return page', () => {
		const wrapper = getWrapper( 'SHOW_FEE_ALREADY_CHANGED_PAGE' );

		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'shows success page content after successful form submission', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#member-name' ).setValue( 'valid example name' );
		await wrapper.find( 'form' ).trigger( 'submit' );

		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
	} );

} );
