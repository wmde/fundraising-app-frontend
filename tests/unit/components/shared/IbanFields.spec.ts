import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import IbanFields from '@src/components/shared/IbanFields.vue';
import { Store } from 'vuex';
import { createStore } from '@src/store/donation_store';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import type { BankValidationResource } from '@src/api/BankValidationResource';
import { action } from '@src/store/util';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import { accountNumber, bankCode, bankName, BIC, formattedIBAN, IBAN } from '@test/data/bankdata';
import { newFailingBankValidationResource } from '@test/unit/TestDoubles/FailingBankValidationResource';

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

describe( 'IbanFields.vue', () => {
	const getWrapper = ( bankValidationResource: BankValidationResource = null, store: Store<any> = null ): VueWrapper<any> => {
		return mount( IbanFields, {
			global: {
				plugins: [ store ?? createStore() ],
				provide: {
					bankValidationResource: bankValidationResource ?? new FakeBankValidationResource(),
				},
			},
		} );
	};

	it( 'shows and hides the IBAN calculator', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.iban-calculator' ).classes() ).not.toContain( 'visible' );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		expect( wrapper.find( '.iban-calculator' ).classes() ).toContain( 'visible' );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		expect( wrapper.find( '.iban-calculator' ).classes() ).not.toContain( 'visible' );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '.iban-calculator-close' ).trigger( 'click' );

		expect( wrapper.find( '.iban-calculator' ).classes() ).not.toContain( 'visible' );
	} );

	it( 'Searches for IBAN using calculator', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( resource.validateBankNumber ).toHaveBeenCalledWith( { accountNumber, bankCode } );
		expect( wrapper.find( '.iban-calculator-pages' ).classes() ).toContain( 'page-2' );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 1 )' ).text() )
			.toStrictEqual( `donation_form_iban_calculator_result_bank_account ${ accountNumber }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 2 )' ).text() )
			.toStrictEqual( `donation_form_iban_calculator_result_bank_code ${ bankCode }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 3 )' ).text() )
			.toStrictEqual( `donation_form_iban_calculator_result_iban ${ IBAN }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 4 )' ).text() )
			.toStrictEqual( `donation_form_iban_calculator_result_bic ${ BIC }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 5 )' ).text() )
			.toStrictEqual( `donation_form_iban_calculator_result_bank_name ${ bankName }` );
	} );

	it( 'Shows error for empty account number field', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.findAll( '.form-field.is-invalid' ).length ).toStrictEqual( 1 );
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLLinkElement>( '.error-summary-list a' ).element.href ).toContain( '#account-number' );
		expect( resource.validateBankNumber ).not.toHaveBeenCalled();
	} );

	it( 'Shows error for empty bank code field', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.findAll( '.form-field.is-invalid' ).length ).toStrictEqual( 1 );
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( wrapper.find<HTMLLinkElement>( '.error-summary-list a' ).element.href ).toContain( '#bank-code' );
		expect( resource.validateBankNumber ).not.toHaveBeenCalled();
	} );

	it( 'Handles error result from calculator API call', async () => {
		const resource = newFailingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.findAll( '.form-field.is-invalid' ).length ).toStrictEqual( 2 );
		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
	} );

	it( 'Shows and hides the calculator error summary', async () => {
		const resource = newFailingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'Returns to page 1 of the calculator when the donor hits no', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.iban-calculator-pages' ).classes() ).toContain( 'page-2' );

		await wrapper.find( '.iban-calculator-results-buttons .form-button:nth-child( 2 )' ).trigger( 'click' );

		expect( wrapper.find( '.iban-calculator-pages' ).classes() ).not.toContain( 'page-2' );
	} );

	it( 'Fills the IBAN field and store when the donor hits fill', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.iban-calculator-pages' ).classes() ).toContain( 'page-2' );

		await wrapper.find( '.iban-calculator-results-buttons .form-button:nth-child( 1 )' ).trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toStrictEqual( formattedIBAN );
	} );

	it( 'Sets the IBAN field as valid when donor fills from calculator', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#iban' ).trigger( 'blur' );
		expect( wrapper.find( '#iban-error' ).exists() ).toBeTruthy();

		await wrapper.find( '.calculate-iban-button' ).trigger( 'click' );
		await wrapper.find( '#account-number' ).setValue( accountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		await wrapper.find( '.iban-calculator' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.iban-calculator-pages' ).classes() ).toContain( 'page-2' );

		await wrapper.find( '.iban-calculator-results-buttons .form-button:nth-child( 1 )' ).trigger( 'click' );

		expect( wrapper.find( '#iban-error' ).exists() ).toBeFalsy();
	} );

	it( 'Validates the IBAN when the IBAN field is blurred', async () => {
		const resource = newSucceedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( resource.validateIban ).toHaveBeenCalledWith( { iban: IBAN } );
		expect( wrapper.find( '#iban-error' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.iban-bank-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.iban-bank-name' ).text() ).toStrictEqual( `${ bankName } (${ BIC })` );
	} );

	it( 'Handles error result from IBAN validation API call', async () => {
		const resource = newFailingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.find( '#iban-error' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.iban-bank-name' ).exists() ).toBeFalsy();

	} );

	it( 'Validates the IBAN on load when one is present in store', async () => {
		const resource = newSucceedingBankValidationResource();
		const store = createStore();
		await store.dispatch( action( 'bankdata', 'setIban' ), IBAN );

		getWrapper( resource, store );

		expect( resource.validateIban ).toHaveBeenCalledWith( { iban: IBAN } );
	} );

} );
