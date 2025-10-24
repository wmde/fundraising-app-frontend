import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import StreetAutocompleteField from '@src/components/shared/form_fields/StreetAutocompleteField.vue';
import { separator } from '@src/util/street_and_building_number_tools';
import { nextTick } from 'vue';
import { FakeStreetAutocompleteResource } from '@test/unit/TestDoubles/FakeStreetAutocompleteResource';

const streetAutocompleteResource = new FakeStreetAutocompleteResource();

describe( 'StreetAutocompleteField.vue', () => {
	let scrollElement: { scrollIntoView: jest.Mock };

	const getWrapper = ( value: string = '', postcode: string = '' ): VueWrapper<any> => {
		scrollElement = { scrollIntoView: jest.fn() };
		Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => scrollElement } );

		return mount( StreetAutocompleteField, {
			props: {
				inputIdStreetName: 'street',
				inputIdBuildingNumber: 'building-number',
				scrollTargetId: 'scroll-target',
				modelValue: value,
				showError: false,
				errorMessage: 'I haz error',
				postcode,
			},
			global: {
				provide: {
					streetAutocompleteResource,
				},
			},
			attachTo: document.body,
		} );
	};

	describe( 'functionality tests', () => {
		it( 'searches for streets on mount', async () => {
			const wrapper = getWrapper( '', '12345' );

			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 9 );
		} );

		it( 'filters streets', async () => {
			const wrapper = getWrapper( '', '12345' );

			await flushPromises();
			await wrapper.find( '#street' ).setValue( 's' );

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 2 );
		} );

		it( 'searches for streets when postcode prop changes', async () => {
			const wrapper = getWrapper();

			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 0 );

			await wrapper.setProps( { postcode: '12345' } );
			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 9 );
		} );

		it( 'only searches for streets when given a valid German postcode', async () => {
			const wrapper = getWrapper( '', '1234' );

			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 0 );

			await wrapper.setProps( { postcode: '12345' } );
			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 9 );

			await wrapper.setProps( { postcode: 'This is not a valid postcode' } );
			await flushPromises();

			expect( wrapper.findAll( '[role="listbox"] > *' ).length ).toStrictEqual( 0 );
		} );

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
		} );

		it( 'emits input event when an autocomplete item is selected', async () => {
			const wrapper = getWrapper( '', '12345' );

			await flushPromises();

			await wrapper.find( '#building-number' ).setValue( '42' );
			await wrapper.find( '[role="listbox"] :nth-child( 6 )' ).trigger( 'click' );

			expect( wrapper.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toBe( `Cobblestone Way${ separator }42` );
		} );

		it( 'emits single field changed event when an autocomplete item is clicked', async () => {
			jest.useFakeTimers();

			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await wrapper.find( '[role="listbox"] :nth-child(3)' ).trigger( 'click' );

			await jest.runAllTimersAsync();

			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );

			jest.clearAllMocks();
		} );

		it( 'emits field changed event when field is blurred', async () => {
			jest.useFakeTimers();

			const wrapper = getWrapper();
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'blur' );

			await jest.runAllTimersAsync();

			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );

			jest.clearAllMocks();
		} );

		it( 'shows and hides the street number help text', async () => {
			const wrapper = getWrapper();

			expect( wrapper.html() ).not.toContain( 'donation_form_street_number_warning' );

			await wrapper.find( '#building-number' ).trigger( 'blur' );

			expect( wrapper.html() ).toContain( 'donation_form_street_number_warning' );

			await wrapper.find( '#building-number' ).setValue( '42' );
			await wrapper.find( '#building-number' ).trigger( 'blur' );

			expect( wrapper.html() ).not.toContain( 'donation_form_street_number_warning' );
		} );

		it( 'highlights streets on the list on keyboard up and down', async () => {
			const wrapper = getWrapper( '', '12345' );

			await flushPromises();

			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );

			expect( wrapper.find( '[role="listbox"] > *:nth-child(1)' ).attributes( 'aria-selected' ) ).toBeTruthy();
			expect( wrapper.find( 'input' ).attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-0' );

			await field.trigger( 'keydown', { key: 'ArrowUp' } );

			expect( wrapper.find( '[role="listbox"] > *:nth-child(1)' ).attributes( 'aria-selected' ) ).toBeTruthy();
			expect( wrapper.find( 'input' ).attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-0' );

			// Go to the bottom of the list
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );

			expect( wrapper.find( '[role="listbox"] > *:nth-child(9)' ).attributes( 'aria-selected' ) ).toBeTruthy();
			expect( wrapper.find( 'input' ).attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-8' );

			await field.trigger( 'keydown', { key: 'ArrowDown' } );

			expect( wrapper.find( '[role="listbox"] > *:nth-child(9)' ).attributes( 'aria-selected' ) ).toBeTruthy();
			expect( wrapper.find( 'input' ).attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-8' );
		} );

		it( 'sets the field value when the donor presses submit while navigating the list', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'Enter' } );

			expect( field.element.value ).toStrictEqual( 'Jump Street' );
		} );

		it( 'sets the field when the donor presses tab while navigating the list', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'Tab' } );

			expect( field.element.value ).toStrictEqual( 'Jump Street' );
		} );

		it( 'does not set the field value when the donor presses submit while navigating the list', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'u' } );
			await field.trigger( 'keydown', { key: 'Enter' } );

			expect( field.element.value ).toStrictEqual( '' );
		} );

		it( 'does not set the field value when the donor presses tab while navigating the list', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );
			await field.trigger( 'keydown', { key: 'u' } );
			await field.trigger( 'keydown', { key: 'Tab' } );

			expect( field.element.value ).toStrictEqual( '' );
		} );

		it( 'scrolls field into view on small size when focused', async () => {
			const wrapper = getWrapper( '', '12345' );
			Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 769 } );

			await wrapper.find<HTMLInputElement>( '#street' ).trigger( 'focus' );

			expect( scrollElement.scrollIntoView ).toHaveBeenCalled();
		} );

		it( 'does not scroll field into view on large size when focused', async () => {
			const wrapper = getWrapper( '', '12345' );
			Object.defineProperty( window, 'innerWidth', { writable: true, configurable: true, value: 770 } );

			await wrapper.find<HTMLInputElement>( '#street' ).trigger( 'focus' );

			expect( scrollElement.scrollIntoView ).not.toHaveBeenCalled();
		} );

		it( 'revalidates on input when invalid', async () => {
			const wrapper = getWrapper();

			await wrapper.find( '#street' ).trigger( 'input' );

			expect( wrapper.emitted( 'field-changed' ) ).toBeUndefined();

			await wrapper.setProps( { showError: true } );
			await wrapper.find( '#street' ).trigger( 'input' );

			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		} );
	} );

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

			await wrapper.setProps( { modelValue: '{"key":"donation_form_street_name_placeholder"}' } );

			expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'street-message' );

			await wrapper.setProps( { showError: true } );

			expect( field.attributes( 'aria-describedby' ) ).toStrictEqual( 'street-error' );
		} );

		it( 'sets aria-activedescendant', async () => {
			const wrapper = getWrapper( '', '12345' );
			const field = wrapper.find<HTMLInputElement>( '#street' );

			expect( wrapper.find( '[aria-activedescendant]' ).exists() ).toBeFalsy();

			await field.trigger( 'focus' );
			await field.trigger( 'keydown', { key: 'ArrowDown' } );

			expect( field.attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-0' );

			await field.trigger( 'keydown', { key: 'ArrowDown' } );

			expect( field.attributes( 'aria-activedescendant' ) ).toStrictEqual( 'street-1' );
		} );
	} );
} );
