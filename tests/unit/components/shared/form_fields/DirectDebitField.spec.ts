import { mount, VueWrapper } from '@vue/test-utils';
import DirectDebitField from '@src/components/shared/form_fields/DirectDebitField.vue';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import { AccountNumberType } from '@src/view_models/BankAccount';

const IBAN = 'DE12500105170648489890';
const bankAccountNumber = '0648489890';
const bankCode = '50010517';
const bankName = 'ING-DiBa';

describe( 'DirectDebitField.vue', () => {

	const getWrapper = ( accountNumber = '' ): VueWrapper<any> => {
		return mount( DirectDebitField, {
			props: {
				accountNumber,
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

	it( 'sets the account number on mounted', async () => {
		const wrapper = getWrapper( '123456789' );

		expect( wrapper.find<HTMLInputElement>( '#account-number' ).element.value ).toStrictEqual( '1234 5678 9' );
	} );

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

	it( 'does not show the IBAN bank name when it is undefined', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { bankName: undefined, bic: bankCode, accountNumberType: AccountNumberType.IBAN } );

		expect( wrapper.find( '.iban-bank-name' ).exists() ).toBeFalsy();
	} );

	it( 'shows the account number bank name', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );
		await wrapper.setProps( { bankName: bankName } );

		expect( wrapper.find( '.bank-name' ).text() ).toStrictEqual( bankName );
	} );

	it( 'does not show the account number bank name when it is undefined', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );
		await wrapper.setProps( { bankName: undefined } );

		expect( wrapper.find( '.bank-name' ).exists() ).toBeFalsy();
	} );

	it( 'updates the bank code value when it is changed externally', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountNumberType: AccountNumberType.Account } );

		expect( wrapper.find<HTMLInputElement>( '#bank-code' ).element.value ).toStrictEqual( '' );

		await wrapper.setProps( { bankCode: bankCode } );

		expect( wrapper.find<HTMLInputElement>( '#bank-code' ).element.value ).toStrictEqual( bankCode );
	} );

	/**
	 * It would be nice to test that it handles the cursor position properly, but when we
	 * call setValue on the input the cursor gets set to the end and the @input event handler
	 * is run meaning there's nowhere to manually set a new cursor position to test it. We need
	 * to rely on acceptance testing for it.
	 */
	it( 'formats the value when the account number field receives input', async () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '#account-number' );

		await input.setValue( 'DE1250010517R 0648 4898 90' );

		expect( input.element.value ).toStrictEqual( 'DE12 5001 0517 R064 8489 890' );
	} );

	it( 'does not format the value when the donor is deleting', async () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '#account-number' );

		await input.setValue( 'DE12 5001 0517 0648 4898 90' );

		expect( input.element.value ).toStrictEqual( 'DE12 5001 0517 0648 4898 90' );

		await input.setValue( 'DE1245' );

		expect( input.element.value ).toStrictEqual( 'DE1245' );
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
