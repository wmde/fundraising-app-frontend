import { mount } from '@vue/test-utils';
import AutocompleteCity from '../../../../../src/components/shared/form_inputs/AutocompleteCity.vue';
import { FakeAutocompleteResource } from '../../../TestDoubles/FakeAutocompleteResource';
import { nextTick } from 'vue';

const cityAutocompleteResource = new FakeAutocompleteResource();
const placeholderKey = 'form_for_example';
const placeholderKeyWhenSuggestionsExist = 'form_autocomplete_prompt';

describe( 'AutocompleteCity.vue', () => {

	const getWrapper = ( postcode: string = '' ) => {
		return mount( AutocompleteCity, {
			props: {
				examplePlaceholder: '',
				city: { value: '' },
				hasError: false,
				postcode,
			},
			global: {
				provide: {
					cityAutocompleteResource,
				},
			},
		} );
	};

	it( 'searches for cities on mount', async () => {
		const wrapper = getWrapper( '12345' );

		await nextTick();

		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );
	} );

	it( 'searches for cities when postcode prop changes', async () => {
		const wrapper = getWrapper();

		await nextTick();
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );
	} );

	it( 'only searches for cities when given a valid German postcode', async () => {
		const wrapper = getWrapper( '1234' );

		await nextTick();
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );

		await wrapper.setProps( { postcode: 'This is not a valid postcode' } );
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );
	} );

	it( 'sets correct placeholder when suggestions are available', async () => {
		const wrapper = getWrapper();

		await nextTick();
		expect( ( wrapper.vm as any ).placeholder ).toBe( placeholderKey );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).placeholder ).toBe( placeholderKeyWhenSuggestionsExist );
	} );

	it( 'emits input event when text input value changes', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.setValue( 'Berlin' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( 'Berlin' );
	} );

	it( 'emits input event when an autocomplete item is selected', async () => {
		const wrapper = getWrapper( '12345' );
		await nextTick();
		await nextTick();

		await wrapper.find( '.dropdown-item:nth-child( 6 )' ).trigger( 'click' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( 'Satan City' );
	} );

	it( 'emits field changed event when text input is blurred', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#city' ).trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
	} );

	it( 'emits field changed event when an autocomplete item is selected', async () => {
		const wrapper = getWrapper( '12345' );
		await nextTick();
		await nextTick();

		await wrapper.find( '.dropdown-item:nth-child( 1 )' ).trigger( 'click' );

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
	} );
} );
