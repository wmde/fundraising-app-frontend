import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import BankFields from '@src/components/shared/BankFields.vue';
import { createStore } from '@src/store/donation_store';
import { BankValidationResource } from '@src/api/BankValidationResource';
import DirectDebitField from '@src/components/shared/form_fields/DirectDebitField.vue';
import { BankAccountResponse } from '@src/view_models/BankAccount';
import { Store } from 'vuex';
import { action } from '@src/store/util';
import { nextTick } from 'vue';

const IBAN = 'DE12500105170648489890';
const BIC = 'INGDDEFFXXX';
const bankAccountNumber = '0648489890';
const bankCode = '50010517';
const bankName = 'ING-DiBa';

describe( 'BankFields.vue', () => {

	let store: Store<any>;

	const succeedingBankValidationResource = ( apiReturnValue: BankAccountResponse = null ): BankValidationResource => {
		const returnValue: BankAccountResponse = apiReturnValue ?? {
			accountNumber: IBAN,
			bankCode,
			bankName,
			iban: IBAN,
			bic: BIC,
		};
		return {
			validateBankNumber: jest.fn().mockReturnValue( returnValue ),
			validateIban: jest.fn().mockReturnValue( returnValue ),
		};
	};

	const failingBankValidationResource = (): BankValidationResource => {
		return {
			validateBankNumber: jest.fn().mockRejectedValue( 'ERR' ),
			validateIban: jest.fn().mockRejectedValue( 'ERR' ),
		};
	};

	const getWrapper = ( bankValidationResource: BankValidationResource = null ): VueWrapper<any> => {
		store = createStore();
		const validationResource = bankValidationResource ?? succeedingBankValidationResource();

		return mount( BankFields, {
			global: {
				plugins: [ store ],
				provide: {
					bankValidationResource: validationResource,
				},
			},
		} );
	};

	it( 'sets IBAN fields validity', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#account-number' ).setValue( IBAN );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await nextTick();
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeTruthy();

		await wrapper.find( '#account-number' ).setValue( '' );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await nextTick();
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeFalsy();
	} );

	it( 'sets account number fields validity', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#account-number' ).setValue( bankAccountNumber );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );
		await nextTick();
		await wrapper.find( '#bank-code' ).setValue( bankCode );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'bank-code' );

		await nextTick();
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeTruthy();

		await wrapper.find( '#bank-code' ).setValue( '' );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'bank-code' );

		await nextTick();
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeFalsy();
	} );

	it( 'checks with the server for a valid IBAN', async () => {
		const resource = succeedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#account-number' ).setValue( IBAN );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await flushPromises();

		expect( resource.validateIban ).toHaveBeenCalledWith( { iban: IBAN } );
		expect( store.getters[ 'bankdata/accountNumber' ] ).toStrictEqual( IBAN );
		expect( store.getters[ 'bankdata/bankCode' ] ).toStrictEqual( '' );
		expect( store.getters[ 'bankdata/bankName' ] ).toStrictEqual( bankName );
		expect( store.getters[ 'bankdata/iban' ] ).toStrictEqual( IBAN );
		expect( store.getters[ 'bankdata/bic' ] ).toStrictEqual( BIC );
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeTruthy();
	} );

	it( 'checks with the server for a valid Account Number', async () => {
		const resource = succeedingBankValidationResource( {
			accountNumber: bankAccountNumber,
			bankCode,
			bankName,
			iban: IBAN,
			bic: BIC,
		} );
		const wrapper = getWrapper( resource );

		await wrapper.find( '#account-number' ).setValue( bankAccountNumber );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await nextTick();

		await wrapper.find( '#bank-code' ).setValue( bankCode );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'bank-code' );

		await flushPromises();

		expect( resource.validateBankNumber ).toHaveBeenCalledWith( { accountNumber: bankAccountNumber, bankCode: bankCode } );
		expect( store.getters[ 'bankdata/accountNumber' ] ).toStrictEqual( bankAccountNumber );
		expect( store.getters[ 'bankdata/bankCode' ] ).toStrictEqual( bankCode );
		expect( store.getters[ 'bankdata/bankName' ] ).toStrictEqual( bankName );
		expect( store.getters[ 'bankdata/iban' ] ).toStrictEqual( IBAN );
		expect( store.getters[ 'bankdata/bic' ] ).toStrictEqual( BIC );
		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeTruthy();
	} );

	it( 'does not check server when IBAN is invalid', async () => {
		const resource = succeedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#account-number' ).setValue( '$ invalid IBAN $' );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await flushPromises();

		expect( resource.validateIban ).not.toHaveBeenCalled();
	} );

	it( 'does not check server when account number field is empty', async () => {
		const resource = succeedingBankValidationResource();
		const wrapper = getWrapper( resource );

		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'bank-code' );

		await flushPromises();

		expect( resource.validateBankNumber ).not.toHaveBeenCalled();
	} );

	it( 'does not check server when bank code field is empty', async () => {
		const resource = succeedingBankValidationResource();
		const wrapper = getWrapper( resource );

		await wrapper.find( '#account-number' ).setValue( bankAccountNumber );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await flushPromises();

		expect( resource.validateBankNumber ).not.toHaveBeenCalled();
	} );

	it( 'handles server IBAN error response', async () => {
		const resource = failingBankValidationResource();
		const wrapper = getWrapper( resource );

		await store.dispatch( action( 'bankdata', 'setBankName' ), bankName );
		await store.dispatch( action( 'bankdata', 'setIban' ), IBAN );
		await store.dispatch( action( 'bankdata', 'setBic' ), BIC );

		await wrapper.find( '#account-number' ).setValue( IBAN );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await flushPromises();

		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeFalsy();
		expect( store.getters[ 'bankdata/bankName' ] ).toStrictEqual( '' );
		expect( store.getters[ 'bankdata/iban' ] ).toStrictEqual( '' );
		expect( store.getters[ 'bankdata/bic' ] ).toStrictEqual( '' );
	} );

	it( 'handles server account number error response', async () => {
		const resource = failingBankValidationResource();
		const wrapper = getWrapper( resource );
		await store.dispatch( action( 'bankdata', 'setBankName' ), bankName );

		await wrapper.find( '#account-number' ).setValue( bankAccountNumber );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'account-number' );

		await nextTick();

		await wrapper.find( '#bank-code' ).setValue( bankCode );
		wrapper.findComponent( DirectDebitField ).vm.$emit( 'field-changed', 'bank-code' );

		await flushPromises();

		expect( store.getters[ 'bankdata/bankDataIsValid' ] ).toBeFalsy();
		expect( store.getters[ 'bankdata/bankName' ] ).toStrictEqual( '' );
	} );
} );
