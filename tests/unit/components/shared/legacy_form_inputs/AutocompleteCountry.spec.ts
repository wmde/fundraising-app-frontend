import { DOMWrapper, mount } from '@vue/test-utils';
import AutocompleteCountry from '@src/components/shared/legacy_form_inputs/AutocompleteCountry.vue';
import countries from '@src/../tests/data/countries';
import { nextTick } from 'vue';

describe( 'AutocompleteCountry.vue', () => {

	const getWrapper = ( initialCountryCode: string = '' ) => {
		return mount( AutocompleteCountry, {
			props: {
				modelValue: undefined,
				countries,
				initialCountryCode,
			},
		} );
	};

	// TODO: Jest has a trigger focus bug
	//  Replace this with `await field.trigger( 'focus' )` when we move to vitest
	const focusField = ( field: DOMWrapper<HTMLInputElement> ): Promise<void> => {
		field.element.dispatchEvent( new FocusEvent( 'focus' ) );
		return nextTick();
	};

	it( 'sets default country on mount when there is no country code provided', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );
		await nextTick();

		expect( field.element.value ).toBe( countries[ 0 ].countryFullName );
		expect( wrapper.emitted( 'initialised' )[ 0 ][ 0 ] ).toStrictEqual( countries[ 0 ] );
	} );

	it( 'sets country on mount when a country code is provided', async () => {
		const wrapper = getWrapper( countries[ 1 ].countryCode );
		const field = wrapper.find<HTMLInputElement>( '#country' );
		await nextTick();

		expect( field.element.value ).toBe( countries[ 1 ].countryFullName );
		expect( wrapper.emitted( 'initialised' )[ 0 ][ 0 ] ).toStrictEqual( countries[ 1 ] );
	} );

	it( 'emits undefined when the inputted name does not exist', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'NOT A COUNTRY' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( undefined );
	} );

	it( 'emits country when the inputted name exists', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Ireland' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( countries[ 2 ] );
	} );

	it( 'shows the autocomplete when the input field is focused', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );

		expect( wrapper.find( '.dropdown-menu' ).isVisible() ).toBeTruthy();
	} );

	it( 'hides the autocomplete when the input field is blurred', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );
		await field.trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.dropdown-menu' ).isVisible() ).toBeFalsy();

		jest.resetAllMocks();
	} );

	it( 'emits the field changed event when the input field is blurred', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
	} );

	it( 'clears the input value on focus when initialised with the default country', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );

		expect( field.element.value ).toBe( '' );
	} );

	it( 'selects the input text on focus when initialised with country code', async () => {
		const wrapper = getWrapper( 'IE' );
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );

		expect( field.element.value ).toBe( countries[ 2 ].countryFullName );
		expect( field.element.selectionEnd ).toBe( 7 );
	} );

	it( 'set the input value when an autocomplete item is clicked', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );
		await wrapper.find( '.dropdown-item:nth-of-type(3)' ).trigger( 'click' );

		expect( field.element.value ).toBe( countries[ 2 ].countryFullName );
	} );

	it( 'selects the input text on second focus when initialised with default', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );
		await wrapper.find( '.dropdown-item:nth-of-type(3)' ).trigger( 'click' );
		await field.trigger( 'blur' );
		await focusField( field );

		expect( field.element.selectionEnd ).toBe( 7 );
	} );

	it( 'sets the list separator at the correct place', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await focusField( field );

		expect( wrapper.find( '.dropdown-content > *:nth-child(3)' ).classes() ).toContain( 'dropdown-separator' );

		await field.setValue( 'Aus' );

		expect( wrapper.find( '.dropdown-content > *:nth-child(2)' ).classes() ).toContain( 'dropdown-separator' );
	} );

	it( 'hides the list separator when there are only frequent countries in the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Austria' );

		expect( wrapper.find( '.dropdown-content > .dropdown-separator' ).exists() ).toBeFalsy();
	} );

	it( 'hides the list separator when there are only infrequent countries in the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Ireland' );

		expect( wrapper.find( '.dropdown-content > .dropdown-separator' ).exists() ).toBeFalsy();
	} );
} );
