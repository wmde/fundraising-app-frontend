import { createLocalVue, mount } from '@vue/test-utils';
import AutocompleteCity from '@/components/shared/AutocompleteCity.vue';
import Buefy from 'buefy';
import CompositionAPI from '@vue/composition-api';
import { FakeAutocompleteResource } from '../../TestDoubles/FakeAutocompleteResource';
// @ts-ignore
import { BAutocomplete } from 'buefy/dist/cjs/autocomplete';

const localVue = createLocalVue();
localVue.use( Buefy );
localVue.use( CompositionAPI );

const cityAutocompleteResource = new FakeAutocompleteResource();
const placeholderKey = 'form_for_example';
const placeholderKeyWhenSuggestionsExist = 'form_autocomplete_prompt';

describe( 'AutocompleteCity.vue', () => {

	it( 'searches for cities when given a valid German postcode on mount', async () => {
		const wrapper = mount( AutocompleteCity, {
			localVue,
			mocks: {
				$t: () => { },
			},
			provide: {
				cityAutocompleteResource,
			},
			propsData: {
				examplePlaceholder: '',
				city: { value: '' },
				showError: false,
				postcode: '12345',
			},
		} );

		await wrapper.vm.$nextTick();

		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );
	} );

	it( 'searches for cities when postcode prop changes and is a valid German postcode', async () => {
		const wrapper = mount( AutocompleteCity, {
			localVue,
			mocks: {
				$t: () => { },
			},
			provide: {
				cityAutocompleteResource,
			},
			propsData: {
				examplePlaceholder: '',
				city: { value: '' },
				showError: false,
				postcode: '',
			},
		} );

		await wrapper.vm.$nextTick();
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );
	} );

	it( 'only searches for cities when given a valid German postcode', async () => {
		const wrapper = mount( AutocompleteCity, {
			localVue,
			mocks: {
				$t: () => { },
			},
			provide: {
				cityAutocompleteResource,
			},
			propsData: {
				examplePlaceholder: '',
				city: { value: '' },
				showError: false,
				postcode: '1234',
			},
		} );

		await wrapper.vm.$nextTick();
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).cities.length ).toBeGreaterThan( 0 );

		await wrapper.setProps( { postcode: 'This is not a valid postcode' } );
		expect( ( wrapper.vm as any ).cities.length ).toBe( 0 );
	} );

	it( 'sets correct placeholder when suggestions are available', async () => {
		const wrapper = mount( AutocompleteCity, {
			localVue,
			mocks: {
				$t: () => {},
			},
			provide: {
				cityAutocompleteResource,
			},
			propsData: {
				examplePlaceholder: '',
				city: { value: '' },
				showError: false,
				postcode: '',
			},
		} );

		await wrapper.vm.$nextTick();
		expect( ( wrapper.vm as any ).placeholder ).toBe( placeholderKey );

		await wrapper.setProps( { postcode: '12345' } );
		expect( ( wrapper.vm as any ).placeholder ).toBe( placeholderKeyWhenSuggestionsExist );
	} );

	describe( 'Buefy Autocomplete', () => {
		// We use an undocumented method in Buefy Autocomplete to fix an issue with
		// some browser autofill usability. This test ensures the method still exists
		it( 'has undocumented method clickedOutside', async () => {
			const wrapper = mount( BAutocomplete, {
				localVue,
				mocks: {
					$t: () => {},
				},
				provide: {
					cityAutocompleteResource,
				},
				propsData: {
					examplePlaceholder: '',
					city: { value: '' },
					showError: false,
					postcode: '',
				},
			} );

			const buefyAutocomplete = wrapper.findComponent( BAutocomplete );
			expect( ( buefyAutocomplete.selector as any ).methods.clickedOutside ).not.toBeUndefined();
		} );
	} );
} );
