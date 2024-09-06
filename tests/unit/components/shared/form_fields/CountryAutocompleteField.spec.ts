import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import CountryAutocompleteField from '@src/components/shared/form_fields/CountryAutocompleteField.vue';
import countries from '@test/data/countries';

describe( 'CountryAutocompleteField.vue', () => {
	let scrollElement: { scrollIntoView: jest.Mock };

	const getWrapper = ( modelValue: string = '', wasRestored: boolean = false ): VueWrapper<any> => {
		const currentElement = { clientHeight: 0, offsetTop: 0 };
		Object.defineProperty( document, 'querySelector', { writable: true, configurable: true, value: () => currentElement } );

		scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		return mount( CountryAutocompleteField, {
			props: {
				modelValue,
				countries,
				label: '',
				inputId: 'country',
				scrollTargetId: 'scroll',
				placeholder: '',
				showError: false,
				errorMessage: 'I haz error',
				wasRestored,
			},
		} );
	};

	beforeEach( () => {
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'sets country on mount', async () => {
		const wrapper = getWrapper( countries[ 1 ].countryCode );
		const field = wrapper.find<HTMLInputElement>( '#country' );
		await nextTick();

		expect( field.element.value ).toBe( countries[ 1 ].countryFullName );
	} );

	it( 'emits empty string when the inputted name does not exist', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'NOT A COUNTRY' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( '' );
	} );

	it( 'emits country when the inputted name exists', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Ireland' );

		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( countries[ 2 ].countryCode );
	} );

	it( 'shows the autocomplete when the input field is focused', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );

		expect( wrapper.find( '.dropdown-menu' ).isVisible() ).toBeTruthy();
	} );

	it( 'hides the autocomplete when the input field is blurred', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.dropdown-menu' ).isVisible() ).toBeFalsy();
	} );

	it( 'emits the field changed event when the input field is blurred', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.emitted( 'field-changed' ).length ).toBe( 1 );
	} );

	it( 'clears the input value on focus when initialised with the default country', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );

		expect( field.element.value ).toBe( '' );
	} );

	it( 'selects the input text on focus when initialised with country code', async () => {
		const wrapper = getWrapper( 'IE', true );
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );

		expect( field.element.value ).toBe( countries[ 2 ].countryFullName );
		expect( field.element.selectionEnd ).toBe( 7 );
	} );

	it( 'set the input value when an autocomplete item is clicked', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await wrapper.find( '.dropdown-item:nth-of-type(3)' ).trigger( 'click' );

		expect( field.element.value ).toBe( countries[ 2 ].countryFullName );
	} );

	it( 'emits single field changed event when an autocomplete item is clicked', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await wrapper.find( '.dropdown-item:nth-of-type(3)' ).trigger( 'click' );

		await jest.runAllTimersAsync();

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );

		jest.clearAllMocks();
	} );

	it( 'emits field changed event when field is blurred', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );

		jest.clearAllMocks();
	} );

	it( 'selects the input text on second focus when initialised with default', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await wrapper.find( '.dropdown-item:nth-of-type(3)' ).trigger( 'click' );
		await field.trigger( 'blur' );
		await field.trigger( 'focus' );

		expect( field.element.selectionEnd ).toBe( 7 );
	} );

	it( 'sets the list divider at the correct place', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );

		expect( wrapper.find( '.dropdown-content > *:nth-child(3)' ).classes() ).toContain( 'dropdown-divider' );

		await field.setValue( 'Aus' );

		expect( wrapper.find( '.dropdown-content > *:nth-child(2)' ).classes() ).toContain( 'dropdown-divider' );
	} );

	it( 'hides the list divider when there are only frequent countries in the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Austria' );

		expect( wrapper.find( '.dropdown-content > .dropdown-divider' ).exists() ).toBeFalsy();
	} );

	it( 'hides the list divider when there are only infrequent countries in the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.setValue( 'Ireland' );

		expect( wrapper.find( '.dropdown-content > .dropdown-divider' ).exists() ).toBeFalsy();
	} );

	it( 'highlights countries on the list on keyboard up and down', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(1)' ).classes() ).toContain( 'is-active-item' );

		await field.trigger( 'keydown', { key: 'ArrowUp' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(1)' ).classes() ).toContain( 'is-active-item' );

		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(5)' ).classes() ).toContain( 'is-active-item' );

		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( wrapper.find( '.dropdown-content > *:nth-child(5)' ).classes() ).toContain( 'is-active-item' );
	} );

	it( 'sets the field value when the donor presses submit while navigating the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'Enter' } );

		expect( field.element.value ).toStrictEqual( 'Austria' );
	} );

	it( 'sets the field when the donor presses tab while navigating the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'Tab' } );

		expect( field.element.value ).toStrictEqual( 'Austria' );
	} );

	it( 'does not set the field value when the donor presses submit while navigating the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'u' } );
		await field.trigger( 'keydown', { key: 'Enter' } );

		expect( field.element.value ).toStrictEqual( '' );
	} );

	it( 'does not set the field value when the donor presses tab while navigating the list', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );
		await field.trigger( 'keydown', { key: 'u' } );
		await field.trigger( 'keydown', { key: 'Tab' } );

		expect( field.element.value ).toStrictEqual( '' );
	} );

	it( 'sets aria-describedby', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#country' );

		expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

		await field.trigger( 'focus' );
		await field.trigger( 'keydown', { key: 'ArrowDown' } );

		expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'country-selected' );

		await wrapper.setProps( { showError: true } );

		expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'country-selected country-error' );
	} );

	it( 'scrolls field into view when focused', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLInputElement>( '#country' ).trigger( 'focus' );

		expect( scrollElement.scrollIntoView ).toHaveBeenCalled();
	} );
} );
