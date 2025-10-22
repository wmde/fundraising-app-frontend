import { mount, VueWrapper } from '@vue/test-utils';
import IbanField from '@src/components/shared/form_fields/IbanField.vue';

const IBAN = 'DE12500105170648489890';
const formattedIBAN = 'DE12 5001 0517 0648 4898 90';
const BIC = 'INGDDEFFXXX';
const bankName = 'ING-DiBa';

describe( 'IbanField.vue', () => {
	const getWrapper = ( modelValue: string = '' ): VueWrapper<any> => {
		return mount( IbanField, {
			props: {
				modelValue,
				showError: false,
				bankName: '',
				bic: '',
			},
		} );
	};

	it( 'formats the field value when mounted', () => {
		const wrapper = getWrapper( IBAN );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toStrictEqual( formattedIBAN );
	} );

	it( 'formats the field value when blurred', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toStrictEqual( formattedIBAN );
	} );

	it( 'formats the field value when model is updated and different', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { modelValue: IBAN } );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toStrictEqual( formattedIBAN );
	} );

	it( 'Does not format the field value when model is updated and the same', async () => {
		const wrapper = getWrapper( IBAN );

		// Change the value without triggering the event to make sure the fieldModel isn't changed
		wrapper.find<HTMLInputElement>( '#iban' ).element.value = '';
		await wrapper.setProps( { modelValue: IBAN } );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toStrictEqual( '' );
	} );

	/**
	 * It would be nice to test that it handles the cursor position properly, but when we
	 * call setValue on the input the cursor gets set to the end and the @input event handler
	 * is run meaning there's nowhere to manually set a new cursor position to test it. We need
	 * to rely on acceptance testing for it.
	 */
	it( 'formats the value when receives input', async () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '#iban' );

		await input.setValue( 'DE1250010517R 0648 4898 90' );

		expect( input.element.value ).toStrictEqual( 'DE12 5001 0517 R064 8489 890' );
	} );

	it( 'does not format the value when the donor is deleting', async () => {
		const wrapper = getWrapper();

		const input = wrapper.find<HTMLInputElement>( '#iban' );

		await input.setValue( 'DE12 5001 0517 0648 4898 90' );

		expect( input.element.value ).toStrictEqual( 'DE12 5001 0517 0648 4898 90' );

		await input.setValue( 'DE1245' );

		expect( input.element.value ).toStrictEqual( 'DE1245' );
	} );

	it( 'shows the error message', async () => {
		const wrapper = getWrapper();

		expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();

		await wrapper.setProps( { showError: true } );

		expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();
	} );

	it( 'shows the bank name when it exists and IBAN is not blank', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.field-container__message' ).exists() ).toBeFalsy();

		await wrapper.setProps( { bankName, bic: BIC } );

		expect( wrapper.find( '.field-container__message' ).exists() ).toBeFalsy();

		await wrapper.setProps( { modelValue: IBAN } );

		expect( wrapper.find( '.field-container__message' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.field-container__message' ).text() ).toStrictEqual( `${ bankName } (${ BIC })` );
	} );

	it( 'emits change events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ] ).toStrictEqual( [ IBAN ] );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ] ).toStrictEqual( [ 'iban' ] );
	} );

	it( 'revalidates on input when invalid', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#iban' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ) ).toBeUndefined();

		await wrapper.setProps( { showError: true } );
		await wrapper.find( '#iban' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'iban' );
	} );
} );
