import { mount, VueWrapper } from '@vue/test-utils';
import TextValueField from '@src/components/shared/form_fields/TextValueField.vue';
import { nextTick } from 'vue';

describe( 'TextValueField.vue', () => {
	const getWrapper = ():VueWrapper<any> => {
		return mount( TextValueField, {
			props: {
				label: 'textField',
				name: 'textField',
				inputId: 'textField',
				inputType: 'text',
				placeholder: 'textField',
				value: 'Garfield',
				errorMessage: '404 Lasagne not found',
				showError: false,
				disabled: false,
				required: false,
				autocomplete: 'on',
			},
			slots: {
				message: `<span class="test-message">I hate Mondays</span>`,
			},
		} );
	};

	it( 'shows the error message', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( 'span.help.is-danger' ).exists() ).toBeTruthy();
		expect( wrapper.find( 'span.help.is-danger' ).text() ).toStrictEqual( '404 Lasagne not found' );
		expect( wrapper.find( 'input' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-error' );
	} );

	it( 'shows the message slot', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.test-message' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.test-message' ).text() ).toStrictEqual( 'I hate Mondays' );
	} );

	it( 'updates the value when changed externally', async () => {
		const wrapper = getWrapper();
		const input = wrapper.find<HTMLInputElement>( 'input' );

		expect( input.element.value ).toStrictEqual( 'Garfield' );

		await wrapper.setProps( { value: 'Odie' } );

		expect( input.element.value ).toStrictEqual( 'Odie' );
	} );

	it( 'updates the cursor position when changed externally', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input' ).element.selectionStart ).toStrictEqual( 8 );
		expect( wrapper.find<HTMLInputElement>( 'input' ).element.selectionEnd ).toStrictEqual( 8 );

		// Set a long string to play with
		await wrapper.setProps( { value: 'Barmy Bazs Buttery Nubs! Barmy Bazs Buttery Nubs! Barmy Bazs Buttery Nubs!' } );
		await wrapper.setProps( { cursorPosition: 42 } );

		// The test browser takes a sec to update the values so we need to wait
		await nextTick();
		await nextTick();
		await nextTick();

		expect( wrapper.find<HTMLInputElement>( 'input' ).element.selectionStart ).toStrictEqual( 42 );
		expect( wrapper.find<HTMLInputElement>( 'input' ).element.selectionEnd ).toStrictEqual( 42 );
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).setValue( 'Odie' );
		await wrapper.find( 'input' ).trigger( 'blur' );
		await wrapper.find( 'input' ).trigger( 'paste' );

		expect( wrapper.emitted( 'input' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'input' )[ 0 ] ).toStrictEqual( [ 'Odie', 4 ] );
		expect( wrapper.emitted( 'input' )[ 1 ] ).toStrictEqual( [ 'Odie', 4 ] );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'textField' );
	} );

	it( 'sets aria-describedby', async () => {
		const wrapper = getWrapper();
		expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

		await wrapper.setProps( { helpText: 'help-text' } );

		expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text' );

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text textField-error' );
	} );

} );
