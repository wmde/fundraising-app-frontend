import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import BankData from '@/components/shared/PaymentBankData.vue';
import { createStore } from '@/store/donation_store';
import { NS_BANKDATA } from '@/store/namespaces';
import bankdata from '@/store/bankdata';
import { action } from '@/store/util';
import {
	initializeBankData,
	markBankDataAsIncomplete,
	markBankDataAsInvalid,
	setBankData,
} from '@/store/bankdata/actionTypes';
import { BankAccountRequest } from '@/view_models/BankAccount';
import setTimeout = jest.setTimeout;

const localVue = createLocalVue();
localVue.use( Vuex );
localVue.use( Buefy );

describe( 'BankData', () => {

	it( 'validates IBANs correctly and sets the bank data to the store on success', () => {
		const wrapper = mount( BankData, {
			localVue,
			propsData: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountId: 'DE12345605171238489890' } );
		iban.trigger( 'blur' );
		const expectedAction = action( NS_BANKDATA, setBankData );
		const expectedPayload = {
			validationUrl: '/check-iban',
			requestParams: { iban: 'DE12345605171238489890' },
		} as BankAccountRequest;

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'validates (non-german) IBANs with letters correctly and sets the bank data to the store on success', () => {
		const wrapper = mount( BankData, {
			localVue,
			propsData: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountId: 'NL18ABNA0484869868 ' } );
		iban.trigger( 'blur' );
		const expectedAction = action( NS_BANKDATA, setBankData );
		const expectedPayload = {
			validationUrl: '/check-iban',
			requestParams: { iban: 'NL18ABNA0484869868 ' },
		} as BankAccountRequest;

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'validates legacy bank data correctly and sets it in the store on success', () => {
		const wrapper = mount( BankData, {
			localVue,
			propsData: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountId: '34560517' } );
		iban.trigger( 'blur' );
		const bic = wrapper.find( '#bic' );
		wrapper.setData( { bankId: '50010517' } );
		bic.trigger( 'blur' );
		const expectedAction = action( NS_BANKDATA, setBankData );
		const expectedPayload = {
			validationUrl: '/generate-iban',
			requestParams: { accountNumber: '34560517', bankCode: '50010517' },
		} as BankAccountRequest;

		expect( store.dispatch ).toHaveBeenLastCalledWith( expectedAction, expectedPayload );
	} );

	it( 'disables BIC field for German IBANs and not for other values', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		const bic = wrapper.find( '#bic' );

		wrapper.setData( { accountId: 'DE12345605171238489890' } );
		iban.trigger( 'blur' );
		await wrapper.vm.$nextTick();
		expect( bic.element.getAttribute( 'disabled' ) ).toMatch( 'disabled' );

		wrapper.setData( { accountId: 'AT12345605171238489890' } );
		iban.trigger( 'blur' );
		await wrapper.vm.$nextTick();
		expect( bic.element.getAttribute( 'disabled' ) ).toMatch( 'disabled' );

		wrapper.setData( { accountId: '34560517' } );
		iban.trigger( 'blur' );
		await wrapper.vm.$nextTick();
		expect( bic.element.getAttribute( 'disabled' ) ).toBeNull();
	} );

	it( 'marks invalid bank account IDs as invalid', () => {
		const wrapper = mount( BankData, {
			localVue,
			propsData: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountId: 'DE123456051äh?' } );
		iban.trigger( 'blur' );

		const expectedAction = action( NS_BANKDATA, markBankDataAsInvalid );
		expect( store.dispatch ).toBeCalledWith( expectedAction );
	} );

	it( 'marks bank account data as incomplete if valid IBAN is removed', () => {
		const wrapper = mount( BankData, {
			localVue,
			propsData: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountId: 'DE12345605171238489890' } );
		iban.trigger( 'blur' );

		wrapper.setData( { accountId: '' } );
		iban.trigger( 'blur' );

		const expectedAction = action( NS_BANKDATA, markBankDataAsIncomplete );
		expect( store.dispatch ).toHaveBeenNthCalledWith( 2, expectedAction );
	} );

	it( 'renders changes from the store in the input fields', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );

		const iban = wrapper.find( '#iban' );
		const bic = wrapper.find( '#bic' );
		wrapper.setData( { accountId: 'AT12345605171238489890', bankId: 'ABCDDEFFXXX' } );
		await wrapper.vm.$nextTick();

		expect( ( ( <HTMLInputElement> iban.element ).value ) ).toMatch( 'AT12345605171238489890' );
		expect( ( ( <HTMLInputElement> bic.element ).value ) ).toMatch( 'ABCDDEFFXXX' );
	} );

	it( 'renders the bank name set in the store', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );
		const store = wrapper.vm.$store;
		store.commit( NS_BANKDATA + '/SET_BANKNAME', 'Test Bank' );
		const iban = wrapper.find( '#bank-name' );
		await wrapper.vm.$nextTick();
		expect( iban.text() ).toMatch( 'Test Bank' );
	} );

	it( 'renders bank code / BIC field when legacy bank account number is entered', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => {},
			},
		} );

		let bankInfoInput = wrapper.find( 'input#bic' );
		expect( bankInfoInput.element ).not.toBeVisible();

		wrapper.setData( { accountId: '123' } );
		await wrapper.vm.$nextTick();

		bankInfoInput = wrapper.find( 'input#bic' );
		expect( bankInfoInput.element ).toBeVisible();
	} );

	it( 'renders bank code / BIC field when valid IBAN was validated', async () => {
		let getters;
		let store;
		getters = {
			bankDataIsValid: () => true,
			bankDataIsInvalid: () => false,
			getBankName: () => 'gute Bank',
		};
		store = new Vuex.Store( {
			modules: {
				[ NS_BANKDATA ]: {
					namespaced: true,
					getters,
				},
			},
		} );
		const wrapper = mount( BankData, {
			localVue,
			store,
			mocks: {
				$t: () => {},
			},
		} );
		wrapper.setData( { accountId: 'DE89370400440532013000' } );

		let bankInfoInput = wrapper.find( 'input#bic' );
		expect( bankInfoInput.element ).toBeVisible();
	} );

	it( 'does not render bank code / BIC field if IBAN is invalid', async () => {
		let getters;
		let store;
		getters = {
			bankDataIsValid: () => false,
			bankDataIsInvalid: () => true,
			getBankName: () => '',
		};
		store = new Vuex.Store( {
			modules: {
				[ NS_BANKDATA ]: {
					namespaced: true,
					getters,
				},
			},
		} );
		const wrapper = mount( BankData, {
			localVue,
			store,
			mocks: {
				$t: () => {},
			},
		} );
		wrapper.setData( { accountId: 'DE89370400440532013000' } );

		let bankInfoInput = wrapper.find( 'input#bic' );
		expect( bankInfoInput.element ).not.toBeVisible();
	} );

	it( 'renders the appropriate labels for no value', () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
		} );

		const bankDataLabels = wrapper.findAll( 'label' );
		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_default_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_default_label' );
	} );

	it( 'renders the appropriate labels for IBANs', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
		} );

		wrapper.setData( { accountId: 'DE12345605171238489890', bankId: 'ABCDDEFFXXX' } );
		const bankDataLabels = wrapper.findAll( 'label' );
		await wrapper.vm.$nextTick();
		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_iban_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_bic_label' );
	} );

	it( 'renders the appropriate labels for legacy bank accounts', async () => {
		const wrapper = mount( BankData, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
		} );

		wrapper.setData( { accountId: '34560517', bankId: '50010517' } );
		const bankDataLabels = wrapper.findAll( 'label' );
		await wrapper.vm.$nextTick();
		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_legacy_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_legacy_label' );
	} );

	it( 'puts initial values form the store in the fields', () => {
		const store = createStore();
		return store.dispatch( action( NS_BANKDATA, initializeBankData ), {
			accountId: 'DE12345605171238489890',
			bankId: 'ABCDDEFFXXX',
			bankName: 'Cool Bank',
		} ).then( () => {
			const wrapper = mount( BankData, {
				localVue,
				store,
				mocks: {
					$t: ( key: string ) => key,
				},
			} );
			const iban = wrapper.find( '#iban' );
			const bic = wrapper.find( '#bic' );
			const bankName = wrapper.find( '#bank-name' );

			expect( ( ( <HTMLInputElement> iban.element ).value ) ).toMatch( 'DE12345605171238489890' );
			expect( ( ( <HTMLInputElement> bic.element ).value ) ).toMatch( 'ABCDDEFFXXX' );
			expect( ( ( <HTMLElement> bankName.element ).textContent ) ).toMatch( 'Cool Bank' );
		} );
	} );
} );
