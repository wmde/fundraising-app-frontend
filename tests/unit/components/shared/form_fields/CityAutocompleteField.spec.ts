import { nextTick } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import CityAutocompleteField from '@src/components/shared/form_fields/CityAutocompleteField.vue';
import { FakeCityAutocompleteResource } from '@test/unit/TestDoubles/FakeCityAutocompleteResource';
import runAllTimersAsync = jest.runAllTimersAsync;

const cityAutocompleteResource = new FakeCityAutocompleteResource();
const placeholderKey = 'form_for_example';
const placeholderKeyWhenSuggestionsExist = 'form_autocomplete_prompt';

describe( 'CityAutocompleteField.vue', () => {
	let scrollElement: { scrollIntoView: jest.Mock };

	const getWrapper = ( postcode: string = '' ): VueWrapper<any> => {
		const currentElement = { clientHeight: 0, offsetTop: 0 };
		Object.defineProperty( document, 'querySelector', { writable: true, configurable: true, value: () => currentElement } );

		scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		return mount( CityAutocompleteField, {
			props: {
				modelValue: '',
				label: '',
				inputId: 'city',
				scrollTargetId: 'scroll',
				examplePlaceholder: '',
				showError: false,
				errorMessage: 'I haz error',
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
		jest.useFakeTimers();

		const wrapper = getWrapper( '12345' );
		await nextTick();
		await nextTick();

		await wrapper.find( '.dropdown-item:nth-child( 6 )' ).trigger( 'click' );
		await runAllTimersAsync();

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toBe( 'Satan City' );
		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );

		jest.clearAllMocks();
	} );

	it( 'emits field changed event when text input is blurred', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#city' ).trigger( 'blur' );
		await runAllTimersAsync();

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
		jest.clearAllMocks();
	} );

	it( 'emits field changed event when an autocomplete item is selected', async () => {
		const wrapper = getWrapper( '12345' );
		await nextTick();
		await nextTick();

		await wrapper.find( '.dropdown-item:nth-child( 1 )' ).trigger( 'click' );

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
	} );

	it( 'shows error', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( '.help.is-danger' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.help.is-danger' ).text() ).toStrictEqual( 'I haz error' );
	} );

	it( 'highlights cities on the list on keyboard up and down', async () => {
		const wrapper = getWrapper( '12345' );

		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(1)' ).classes() ).toContain( 'is-active-item' );

		await field.trigger( 'keydown', { key: 'ArrowUp' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(1)' ).classes() ).toContain( 'is-active-item' );

		// Go to the bottom of the list
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(9)' ).classes() ).toContain( 'is-active-item' );

		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(9)' ).classes() ).toContain( 'is-active-item' );
	} );

	it( 'sets the field value when the donor presses submit while navigating the list', async () => {
		const wrapper = getWrapper( '12345' );
		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'Enter' } );

		expect( field.element.value ).toStrictEqual( 'Mushroom Kingdom City' );
	} );

	it( 'sets the field when the donor presses tab while navigating the list', async () => {
		const wrapper = getWrapper( '12345' );
		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'Tab' } );

		expect( field.element.value ).toStrictEqual( 'Mushroom Kingdom City' );
	} );

	it( 'does not set the field value when the donor presses submit while navigating the list', async () => {
		const wrapper = getWrapper( '12345' );
		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'u' } );
		await field.trigger( 'keydown', { key: 'Enter' } );

		expect( field.element.value ).toStrictEqual( '' );
	} );

	it( 'does not set the field value when the donor presses tab while navigating the list', async () => {
		const wrapper = getWrapper( '12345' );
		const field = wrapper.find<HTMLInputElement>( '#city' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'u' } );
		await field.trigger( 'keydown', { key: 'Tab' } );

		expect( field.element.value ).toStrictEqual( '' );
	} );

	it( 'sets aria-describedby', async () => {
		const wrapper = getWrapper( '12345' );
		const field = wrapper.find<HTMLInputElement>( '#city' );

		expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'city-selected' );

		await wrapper.setProps( { showError: true } );

		expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'city-selected city-error' );
	} );

	it( 'scrolls field into view on small size when focused', async () => {
		const wrapper = getWrapper();
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 769 } );

		await wrapper.find<HTMLInputElement>( '#city' ).trigger( 'focus' );

		expect( scrollElement.scrollIntoView ).toHaveBeenCalled();
	} );

	it( 'does not scroll field into view on large size when focused', async () => {
		const wrapper = getWrapper();
		Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 770 } );

		await wrapper.find<HTMLInputElement>( '#city' ).trigger( 'focus' );

		expect( scrollElement.scrollIntoView ).not.toHaveBeenCalled();
	} );

	it( 'revalidates on input when invalid', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#city' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ) ).toBeUndefined();

		await wrapper.setProps( { showError: true } );
		await wrapper.find( '#city' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toBe( '' );

		await wrapper.setProps( { modelValue: 'Berlin' } );

		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toBe( 'Berlin' );
	} );
} );
