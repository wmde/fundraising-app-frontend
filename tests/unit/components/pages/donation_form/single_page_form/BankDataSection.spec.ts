import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import BankDataSection from '@src/components/pages/donation_form/singlePageFormSections/BankDataSection.vue';
import { Store } from 'vuex';
import { createStore } from '@src/store/donation_store';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import { BankValidationResource } from '@src/api/BankValidationResource';
import { BankAccountResponse } from '@src/view_models/BankAccount';
import { action } from '@src/store/util';

const IBAN = 'DE12500105170648489890';
const formattedIBAN = 'DE12 5001 0517 0648 4898 90';
const BIC = 'INGDDEFFXXX';
const accountNumber = '0648489890';
const bankCode = '50010517';
const bankName = 'ING-DiBa';

const succeedingBankValidationResource = ( apiReturnValue: BankAccountResponse = null ): BankValidationResource => {
	const returnValue: BankAccountResponse = apiReturnValue ?? {
		accountNumber,
		bankCode,
		bankName,
		iban: IBAN,
		bic: BIC,
	};
	return {
		validateBankNumber: jest.fn( () => Promise.resolve( returnValue ) ),
		validateIban: jest.fn( () => Promise.resolve( returnValue ) ),
	};
};

const failingBankValidationResource = (): BankValidationResource => {
	return {
		validateBankNumber: jest.fn().mockRejectedValue( 'ERR' ),
		validateIban: jest.fn().mockRejectedValue( 'ERR' ),
	};
};

describe( 'BankDataSection.vue', () => {
	const getWrapper = ( bankValidationResource: BankValidationResource = null, store: Store<any> = null ): VueWrapper<any> => {
		return mount( BankDataSection, {
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
		const resource = succeedingBankValidationResource();
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
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 1 )' ).text() ).toStrictEqual( `Bank Account Number: ${ accountNumber }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 2 )' ).text() ).toStrictEqual( `Bank Code: ${ bankCode }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 3 )' ).text() ).toStrictEqual( `IBAN: ${ IBAN }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 4 )' ).text() ).toStrictEqual( `BIC: ${ BIC }` );
		expect( wrapper.find( '.iban-calculator-results-list li:nth-child( 5 )' ).text() ).toStrictEqual( `Bank Name: ${ bankName }` );
	} );

	it( 'Shows error for empty account number field', async () => {
		const resource = succeedingBankValidationResource();
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
		const resource = succeedingBankValidationResource();
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
		const resource = failingBankValidationResource();
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
		const resource = failingBankValidationResource();
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
		const resource = succeedingBankValidationResource();
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
		const resource = succeedingBankValidationResource();
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
		const resource = succeedingBankValidationResource();
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
		const resource = succeedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( resource.validateIban ).toHaveBeenCalledWith( { iban: IBAN } );
		expect( wrapper.find( '#iban-error' ).exists() ).toBeFalsy();
		expect( wrapper.find( '.iban-bank-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.iban-bank-name' ).text() ).toStrictEqual( `${ bankName } (${ BIC })` );
	} );

	it( 'Handles error result from IBAN validation API call', async () => {
		const resource = failingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.find( '#iban-error' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.iban-bank-name' ).exists() ).toBeFalsy();

	} );

	it( 'Validates the IBAN on load when one is present in store', async () => {
		const resource = succeedingBankValidationResource();
		const store = createStore();
		await store.dispatch( action( 'bankdata', 'setIban' ), IBAN );

		getWrapper( resource, store );

		expect( resource.validateIban ).toHaveBeenCalledWith( { iban: IBAN } );
	} );

} );
