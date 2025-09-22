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
			},
		} );
	};

	test( 'suggestedAmountIsPreselected', () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
	} );

	test( 'justClickingIntoCustomAmountInputFieldDoesNotSelectTheRadioField', () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.checked ).toBeFalsy();
	} );

	test( 'EnteringValidCustomAmountsDeselectsSuggestedAmount', () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.checked ).toBeTruthy();
	} );

	test( 'reselectingCustomAmountDeselectsSuggestedAmount', () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.checked ).toBeTruthy();

		wrapper.find<HTMLInputElement>( '#suggested-amount' ).trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.checked ).toBeFalsy();
	} );

	test( 'customAmountGetsClearedWhenSuggestedAmountIsReselected', () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#custom-amount' ).trigger( 'click' );
		wrapper.find<HTMLInputElement>( '#custom-amount' ).setValue( '5500' );

		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '5500' );

		wrapper.find<HTMLInputElement>( '#suggested-amount' ).trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#custom-amount' ).element.value ).toEqual( '' );
	} );

	test( 'ShowsAndHidesMemberNameErrorMessageOnceUserStartsTypingInTheField', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );
		await nextTick();

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLElement>( '#member-name-error' ).exists() ).toBeTruthy();

		await wrapper.find<HTMLInputElement>( '#member-name' ).trigger( 'click' );
		wrapper.find<HTMLInputElement>( '#member-name' ).element.value = 'valid example name';

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeFalsy();
		expect( wrapper.find<HTMLElement>( '#member-name-error' ).exists() ).toBeFalsy();

	} );

	test( 'doesNotShowErrorMessageForIbanIfIbanIsEmpty', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = '';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeFalsy();
		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeFalsy();
	} );

	test( 'showsIbanErrorMessage', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'DEinvalidIBANxyz';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeTruthy();
	} );

	test( 'HidesIbanErrorMessageWhenUserStartsTyping', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'DEinvalidIBANxyz';

		await wrapper.find<HTMLInputElement>( '#iban' ).trigger( 'blur' );
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeTruthy();

		wrapper.find<HTMLInputElement>( '#iban' ).element.value = 'n';

		expect( wrapper.find<HTMLElement>( '#iban-error' ).exists() ).toBeFalsy();
	} );

	test( 'showsFormPageContentIfFlagIsSetToFormPage', () => {
		const wrapper = getWrapper( 'SHOW_FEE_CHANGE_FORM' );

		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'showsErrorPageContentIfFlagIsSetToError', () => {
		const wrapper = getWrapper( 'SHOW_ERROR_PAGE' );

		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'showsReturningPageContentIfFlagIsSetToReturnPage', () => {
		const wrapper = getWrapper( 'SHOW_FEE_ALREADY_CHANGED_PAGE' );

		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeFalsy();
	} );

	test( 'showsSuccessPageContentAfterSuccessfulFormSubmission', async () => {
		const wrapper = getWrapper();

		wrapper.find<HTMLInputElement>( '#member-name' ).element.value = 'valid example name';
		await wrapper.find( '#fee-change-submit-button' ).trigger( 'click' );

		expect( wrapper.find( '.membership-fee-success-page' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.membership-fee-return-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-error-page' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.membership-fee-form-page' ).exists() ).toBeFalsy();
	} );

} );
