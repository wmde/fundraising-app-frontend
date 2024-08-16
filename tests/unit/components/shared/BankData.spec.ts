import { mount, VueWrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import BankData from '@src/components/shared/PaymentBankData.vue';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { BankAccountRequest } from '@src/view_models/BankAccount';
import { nextTick } from 'vue';

describe( 'BankData.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( BankData, {
			props: {
				validateBankDataUrl: '/check-iban',
				validateLegacyBankDataUrl: '/generate-iban',
			},
			global: {
				plugins: [ store ],
			},
		} );

		return {
			wrapper,
			store,
		};
	};

	it( 'validates IBANs correctly and sets the bank data to the store on success', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountNumber: 'DE12345605171238489890' } );
		iban.trigger( 'blur' );
		const expectedAction = action( 'bankdata', 'setBankData' );
		const expectedPayload = {
			validationUrl: '/check-iban',
			requestParams: { iban: 'DE12345605171238489890' },
		} as BankAccountRequest;

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'validates (non-german) IBANs with letters correctly and sets the bank data to the store on success', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountNumber: 'NL18ABNA0484869868 ' } );
		iban.trigger( 'blur' );
		const expectedAction = action( 'bankdata', 'setBankData' );
		const expectedPayload = {
			validationUrl: '/check-iban',
			requestParams: { iban: 'NL18ABNA0484869868 ' },
		} as BankAccountRequest;

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'validates legacy bank data correctly and sets it in the store on success', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountNumber: '34560517' } );
		iban.trigger( 'blur' );
		const bic = wrapper.find( '#bic' );
		wrapper.setData( { bankCode: '50010517' } );
		bic.trigger( 'blur' );
		const expectedAction = action( 'bankdata', 'setBankData' );
		const expectedPayload = {
			validationUrl: '/generate-iban',
			requestParams: { accountNumber: '34560517', bankCode: '50010517' },
		} as BankAccountRequest;

		expect( store.dispatch ).toHaveBeenLastCalledWith( expectedAction, expectedPayload );
	} );

	it( 'marks invalid bank account IDs as invalid', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );
		wrapper.setData( { accountNumber: 'DE123456051äh?' } );
		iban.trigger( 'blur' );

		const expectedAction = action( 'bankdata', 'markBankDataAsInvalid' );
		expect( store.dispatch ).toBeCalledWith( expectedAction );
	} );

	it( 'marks bank account data as incomplete if valid IBAN is removed', () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();

		const iban = wrapper.find( '#iban' );

		wrapper.setData( { accountNumber: 'DE12345605171238489890' } );
		iban.trigger( 'blur' );

		wrapper.setData( { accountNumber: '' } );
		iban.trigger( 'blur' );

		const expectedAction = action( 'bankdata', 'markBankDataAsIncomplete' );
		expect( store.dispatch ).toHaveBeenNthCalledWith( 2, expectedAction );
	} );

	it( 'renders changes from the store in the input fields', async () => {
		const { wrapper } = getWrapper();

		const iban = wrapper.find( '#iban' );
		const bic = wrapper.find( '#bic' );

		await wrapper.setData( { accountNumber: 'AT12345605171238489890', bankCode: 'ABCDDEFFXXX' } );

		expect( ( ( <HTMLInputElement> iban.element ).value ) ).toMatch( 'AT12 3456 0517 1238 4898 90' );
		expect( ( ( <HTMLInputElement> bic.element ).value ) ).toMatch( 'ABCDDEFFXXX' );
	} );

	it( 'renders the bank name set in the store', async () => {
		const { wrapper, store } = getWrapper();

		store.commit( 'bankdata/SET_BANK_NAME', 'Test Bank' );
		await nextTick();

		expect( wrapper.find( '#bank-name-iban' ).text() ).toMatch( 'Test Bank' );
	} );

	it( 'renders info message when bank info is valid but no bank name and bank code available', async () => {
		const { wrapper } = getWrapper( new Vuex.Store<any>( {
			modules: {
				[ 'bankdata' ]: {
					namespaced: true,
					getters: {
						bankDataIsValid: () => true,
						bankDataIsInvalid: () => false,
						accountNumber: () => '',
						bankCode: () => '',
						bankName: () => '',
					},
					actions: {
						markBankDataAsIncomplete: () => {},
						setBankData: () => {},
					},
				},
			},
		} ) );

		await wrapper.setData( { accountId: 'DE12345605171238489890' } );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.find( '#bank-name-not-available' ).text() )
			.toMatch( 'donation_form_payment_bankdata_bank_bic_placeholder_full' );
	} );

	it( 'renders bank code / BIC field when legacy bank account number is entered', async () => {
		const { wrapper } = getWrapper();

		expect( wrapper.find( 'input#bic' ).isVisible() ).toBe( false );

		await wrapper.setData( { accountNumber: '123' } );

		expect( wrapper.find( 'input#bic' ).isVisible() ).toBe( true );
	} );

	it( 'does not render bank code / BIC field when valid IBAN was validated', async () => {
		const { wrapper } = getWrapper( new Vuex.Store<any>( {
			modules: {
				[ 'bankdata' ]: {
					namespaced: true,
					getters: {
						bankDataIsValid: () => true,
						bankDataIsInvalid: () => false,
						accountNumber: () => '',
						bankCode: (): string => '',
						bankName: () => 'gute Bank',
					},
				},
			},
		} ) );

		await wrapper.setData( { accountId: 'DE89370400440532013000' } );

		expect( wrapper.find( 'input#bic' ).isVisible() ).toBe( false );
	} );

	it( 'does not render bank code / BIC field if IBAN is invalid', async () => {
		const { wrapper } = getWrapper( new Vuex.Store<any>( {
			modules: {
				[ 'bankdata' ]: {
					namespaced: true,
					getters: {
						bankDataIsValid: () => false,
						bankDataIsInvalid: () => true,
						accountNumber: () => '',
						bankCode: (): string => '',
						bankName: () => '',
					},
				},
			},
		} ) );

		await wrapper.setData( { accountId: 'DE89370400440532013000' } );

		expect( wrapper.find( 'input#bic' ).isVisible() ).toBe( false );
	} );

	it( 'renders the appropriate labels for no value', () => {
		const { wrapper } = getWrapper();

		const bankDataLabels = wrapper.findAll( 'label' );

		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_default_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_default_label' );
	} );

	it( 'renders the appropriate labels for IBANs', async () => {
		const { wrapper } = getWrapper();

		await wrapper.setData( { accountNumber: 'DE12345605171238489890', bankCode: 'ABCDDEFFXXX' } );

		const bankDataLabels = wrapper.findAll( 'label' );
		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_iban_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_bic_label' );
	} );

	it( 'renders the appropriate labels for legacy bank accounts', async () => {
		const { wrapper } = getWrapper();

		await wrapper.setData( { accountNumber: '34560517', bankCode: '50010517' } );

		const bankDataLabels = wrapper.findAll( 'label' );
		expect( bankDataLabels.at( 0 ).text() ).toMatch( 'donation_form_payment_bankdata_account_legacy_label' );
		expect( bankDataLabels.at( 1 ).text() ).toMatch( 'donation_form_payment_bankdata_bank_legacy_label' );
	} );

	it( 'puts initial values form the store in the fields', async () => {
		const store = createStore();
		await store.dispatch( action( 'bankdata', 'initializeBankData' ), {
			accountNumber: 'DE12345605171238489890',
			bankCode: 'ABCDDEFFXXX',
			bankName: 'Cool Bank',
		} );

		const { wrapper } = getWrapper( store );

		const iban = wrapper.find<HTMLInputElement>( '#iban' );
		const bic = wrapper.find<HTMLInputElement>( '#bic' );
		const bankName = wrapper.find<HTMLElement>( '#bank-name-iban' );

		expect( iban.element.value ).toMatch( 'DE12 3456 0517 1238 4898 90' );
		expect( bic.element.value ).toMatch( 'ABCDDEFFXXX' );
		expect( bankName.element.textContent ).toMatch( 'Cool Bank' );
	} );
} );
