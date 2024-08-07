import { mount, VueWrapper } from '@vue/test-utils';
import StreetAutocompleteField from '@src/components/shared/form_fields/StreetAutocompleteField.vue';
import { separator } from '@src/util/street_and_building_number_tools';
import { nextTick } from 'vue';

describe( 'StreetAutocompleteField.vue', () => {

	const getWrapper = ( value: string = '' ): VueWrapper<any> => {
		return mount( StreetAutocompleteField, {
			props: {
				inputIdStreetName: 'street',
				inputIdBuildingNumber: 'building-number',
				modelValue: value,
				showError: false,
			},
		} );
	};

	it( 'shows the street name error', async () => {
		const wrapper = getWrapper();
		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( '#street-error' ).exists() ).toBeTruthy();
	} );

	it( 'splits the value at the separator', async () => {
		const wrapper = getWrapper( `sesame street${ separator }42` );

		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#street' ).element.value ).toStrictEqual( 'sesame street' );
		expect( wrapper.find<HTMLInputElement>( '#building-number' ).element.value ).toStrictEqual( '42' );
	} );

	it( 'emits events and joins the internal values with the separator', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#street' ).setValue( 'sesame street' );
		await wrapper.find( '#building-number' ).setValue( '42' );
		await wrapper.find( '#building-number' ).trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toStrictEqual( `sesame street${ separator }42` );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'street' );
	} );

	it( 'shows and hides the street number help text', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.street-number-warning' ).exists() ).toBeFalsy();

		await wrapper.find( '#building-number' ).trigger( 'blur' );

		expect( wrapper.find( '.street-number-warning' ).exists() ).toBeTruthy();

		await wrapper.find( '#building-number' ).setValue( '42' );
		await wrapper.find( '#building-number' ).trigger( 'blur' );

		expect( wrapper.find( '.street-number-warning' ).exists() ).toBeFalsy();
	} );
} );
