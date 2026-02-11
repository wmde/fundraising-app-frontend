import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import MembershipFeeChange from '@src/components/pages/MembershipFeeChange.vue';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import type { BankValidationResource } from '@src/api/BankValidationResource';
import { newFailingBankValidationResource } from '@test/unit/TestDoubles/FailingBankValidationResource';

const uuid = '28178402-56ef-4977-87d9-c681c29bb823';
const currentAmountInCents = 1000;
const suggestedAmountInCents = 1600;
const currentInterval = 3;

describe( 'MembershipFeeChange.vue', () => {
	const getWrapper = ( bankValidationResource: BankValidationResource = null ): VueWrapper<any> => {
		return mount( MembershipFeeChange, {
			props: {
				uuid,
				currentAmountInCents,
				suggestedAmountInCents,
				currentInterval,
				feeChangeFrontendFlag: 'SHOW_FEE_CHANGE_FORM',
			},
			global: {
				provide: {
					bankValidationResource: bankValidationResource ?? newSucceedingBankValidationResource(),
					membershipFeeChangeResource: { put: () => Promise.resolve( { status: 'OK' } ) },
				},
				mocks: {
					$n: ( n: number, format: string ) => `${n}-${format}`,
				},
			},
		} );
	};

	beforeEach( () => {
		const scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );
	} );

	test( 'shows and hides member name error message once user starts typing in the field', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'form' ).trigger( 'submit' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#upgrade-form-member-name' ).attributes( 'data-error' ) ).toBeTruthy();

		await wrapper.find( '#member-name' ).trigger( 'click' );
		await wrapper.find( '#member-name' ).setValue( 'valid example name' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#upgrade-form-member-name' ).attributes( 'data-error' ) ).toBeFalsy();
	} );

	test( 'validates the IBAN and shows error message', async () => {
		const bankValidationResource = newFailingBankValidationResource();
		const wrapper = getWrapper( bankValidationResource );

		await wrapper.find( '#iban' ).setValue( 'DEinvalidIBANxyz' );
		await wrapper.find( '#iban' ).trigger( 'blur' );
		await wrapper.find( 'form' ).trigger( 'submit' );

		await flushPromises();

		expect( bankValidationResource.validateIban ).toHaveBeenCalledWith( { iban: 'DEinvalidIBANxyz' } );
		expect( wrapper.find<HTMLElement>( '.error-summary' ).html() ).toContain( 'donation_form_payment_iban_error' );
	} );

	test( 'does not validate the IBAN or show error message if it is empty', async () => {
		const bankValidationResource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( bankValidationResource );

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = '';

		await wrapper.find( '#iban' ).trigger( 'blur' );
		await wrapper.find( 'form' ).trigger( 'submit' );

		await flushPromises();

		expect( bankValidationResource.validateIban ).not.toHaveBeenCalled();
		expect( wrapper.find( '.error-summary' ).html() ).not.toContain( 'donation_form_payment_iban_error' );
	} );

	test( 'hides IBAN error message when user starts typing', async () => {
		const bankValidationResource = newFailingBankValidationResource();
		const wrapper = getWrapper( bankValidationResource );

		await wrapper.find( '#iban' ).setValue( 'DEinvalidIBANxyz' );
		await wrapper.find( '#iban' ).trigger( 'blur' );
		await wrapper.find( 'form' ).trigger( 'submit' );

		expect( wrapper.find( '#payment-form-iban' ).attributes( 'data-error' ) ).toBeTruthy();

		await wrapper.find( '#iban' ).setValue( 'n' );

		expect( wrapper.find( '#payment-form-iban' ).attributes( 'data-error' ) ).toBeFalsy();
	} );

	test( 'shows form page content if flag is set to form page', () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).toContain( 'membership_fee_upgrade_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_error_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_returning_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_confirmation_headline' );
	} );

	test( 'shows error page content if flag ss set to error', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { feeChangeFrontendFlag: 'SHOW_ERROR_PAGE' } );

		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_page_headline' );
		expect( wrapper.text() ).toContain( 'membership_fee_upgrade_error_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_returning_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_confirmation_headline' );
	} );

	test( 'shows returning page content if flag is set to return page', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { feeChangeFrontendFlag: 'SHOW_FEE_ALREADY_CHANGED_PAGE' } );

		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_error_page_headline' );
		expect( wrapper.text() ).toContain( 'membership_fee_upgrade_returning_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_confirmation_headline' );
	} );

	test( 'shows success page content after successful form submission', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#member-name' ).setValue( 'valid example name' );
		await wrapper.find( 'form' ).trigger( 'submit' );

		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_error_page_headline' );
		expect( wrapper.text() ).not.toContain( 'membership_fee_upgrade_returning_page_headline' );
		expect( wrapper.text() ).toContain( 'membership_fee_upgrade_confirmation_headline' );
	} );

} );
