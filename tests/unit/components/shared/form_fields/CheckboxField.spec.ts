import { mount, VueWrapper } from '@vue/test-utils';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';

describe( 'CheckboxField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( CheckboxField, {
			props: {
				modelValue: false,
				inputId: 'animal',
				name: 'animal',
				errorMessage: 'error_message',
			},
			attachTo: document.body,
		} );
	};

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#animal' ).trigger( 'click' );
		await wrapper.find<HTMLInputElement>( '#animal' ).trigger( 'click' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( true );
		expect( wrapper.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toStrictEqual( false );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'animal' );
		expect( wrapper.emitted( 'field-changed' )[ 1 ][ 0 ] ).toStrictEqual( 'animal' );
	} );
} );
