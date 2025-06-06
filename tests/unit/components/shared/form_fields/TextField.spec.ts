import { mount, VueWrapper } from '@vue/test-utils';
import TextField from '@src/components/shared/form_fields/TextField.vue';

describe( 'TextField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( TextField, {
			props: {
				label: 'textField',
				name: 'textField',
				inputId: 'textField',
				inputType: 'text',
				placeholder: 'textField',
				modelValue: 'Garfield',
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

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const input = wrapper.find<HTMLInputElement>( 'input' );

		expect( input.element.value ).toStrictEqual( 'Garfield' );

		await wrapper.setProps( { modelValue: 'Odie' } );

		expect( input.element.value ).toStrictEqual( 'Odie' );
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).setValue( 'Odie' );
		await wrapper.find( 'input' ).trigger( 'blur' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'Odie' );
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

	it( 'revalidates on input when invalid', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ) ).toBeUndefined();

		await wrapper.setProps( { showError: true } );
		await wrapper.find( 'input' ).trigger( 'input' );

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'textField' );
	} );

} );
