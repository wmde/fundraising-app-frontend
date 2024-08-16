import { mount, VueWrapper } from '@vue/test-utils';
import DirectDebitField from '@src/components/shared/form_fields/DirectDebitField.vue';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import TextValueField from '@src/components/shared/form_fields/TextValueField.vue';
import { nextTick } from 'vue';
import { AccountNumberType } from '@src/view_models/BankAccount';

const IBAN = 'DE12500105170648489890';
const bankAccountNumber = '0648489890';
const bankCode = '50010517';
const bankName = 'ING-DiBa';

describe( 'DirectDebitField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( DirectDebitField, {
			props: {
				accountNumber: '',
				bankCode: '',
				bankName: '',
				bic: '',
				accountNumberType: AccountNumberType.None,
				showAccountNumberError: false,
				showBankCodeError: false,
				bankValidationResource: new FakeBankValidationResource(),
			},
		} );
	};

	it( 'sets correct account number labels', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'label[for="account-number"]' ).text() ).toStrictEqual( 'donation_form_payment_bankdata_account_default_label' );

		await wrapper.setProps( { accountNumberType: AccountNumberType.IBAN } );

		expect( wrapper.find( 'label[for="account-number"]' ).text() ).toStrictEqual( 'donation_form_payment_bankdata_account_iban_label' );

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );

		expect( wrapper.find( 'label[for="account-number"]' ).text() ).toStrictEqual( 'donation_form_payment_bankdata_account_legacy_label' );
	} );

	it( 'shows the bank code field', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.IBAN } );

		expect( wrapper.find( '#bank-code' ).exists() ).toBeFalsy();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );

		expect( wrapper.find( '#bank-code' ).exists() ).toBeTruthy();
	} );

	it( 'shows the IBAN bank name', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { bankName: bankName, bic: bankCode, accountNumberType: AccountNumberType.IBAN } );

		expect( wrapper.find( '.iban-bank-name' ).text() ).toContain( bankName );
		expect( wrapper.find( '.iban-bank-name' ).text() ).toContain( bankCode );
	} );

	it( 'shows the account number bank name', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );
		await wrapper.setProps( { bankName: bankName } );

		expect( wrapper.find( '.bank-name' ).text() ).toStrictEqual( bankName );
	} );

	it( 'updates the account number value when it is changed externally', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.value ).toStrictEqual( '' );

		await wrapper.setProps( { accountNumber: IBAN } );

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.value ).toStrictEqual( 'DE12 5001 0517 0648 4898 90' );
	} );

	it( 'updates the bank code value when it is changed externally', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );

		expect( wrapper.find<HTMLInputElement>( '#bank-code' ).element.value ).toStrictEqual( '' );

		await wrapper.setProps( { bankCode: bankCode } );

		expect( wrapper.find<HTMLInputElement>( '#bank-code' ).element.value ).toStrictEqual( bankCode );
	} );

	it( 'resets the cursor and value when the account number field is edited', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#account-number' ).setValue( IBAN );

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionStart ).toStrictEqual( 27 );
		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionEnd ).toStrictEqual( 27 );

		wrapper.findComponent( TextValueField ).vm.$emit( 'input', 'DE12 5001 0517R 0648 4898 90', 14 );

		await nextTick();
		await nextTick();
		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.value ).toStrictEqual( 'DE12 5001 0517 R064 8489 890' );
		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionStart ).toStrictEqual( 15 );
		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionEnd ).toStrictEqual( 15 );

		wrapper.findComponent( TextValueField ).vm.$emit( 'input', 'DE12 5001 0517 RG064 8489 890', 17 );

		await nextTick();
		await nextTick();
		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.value ).toStrictEqual( 'DE12 5001 0517 RG06 4848 9890' );
		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionStart ).toStrictEqual( 17 );
		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.selectionEnd ).toStrictEqual( 17 );
	} );

	it( 'emits field changed events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#account-number' ).setValue( IBAN );
		await wrapper.find( '#account-number' ).trigger( 'blur' );

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );

		await wrapper.find( '#account-number' ).setValue( bankAccountNumber );
		await wrapper.find( '#account-number' ).trigger( 'blur' );

		await wrapper.find( '#bank-code' ).setValue( bankCode );
		await wrapper.find( '#bank-code' ).trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 3 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'account-number' );
		expect( wrapper.emitted( 'field-changed' )[ 1 ][ 0 ] ).toStrictEqual( 'account-number' );
		expect( wrapper.emitted( 'field-changed' )[ 2 ][ 0 ] ).toStrictEqual( 'bank-code' );
	} );
} );
