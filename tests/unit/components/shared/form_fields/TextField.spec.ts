import { mount, VueWrapper } from '@vue/test-utils';
import TextField from '@src/components/shared/form_fields/TextField.vue';

describe( 'TextField.vue', () => {

	const getWrapper = ( slots: { message?: string } = {} ): VueWrapper<any> => {
		return mount( TextField, {
			props: {
				label: 'textField',
				name: 'textField',
				inputId: 'textField',
				inputType: 'text',
				placeholder: 'textField',
				placeholderWarning: 'I hate Mondays {value}',
				modelValue: 'Garfield',
				errorMessage: '404 Lasagne not found',
				showError: false,
				disabled: false,
				autocomplete: 'on',
			},
			slots,
		} );
	};

	describe( 'functionality tests', () => {

		it( 'shows the error message', async () => {
			const wrapper = getWrapper();

			await wrapper.setProps( { showError: true } );

			expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();
		} );

		it( 'shows the value equals placeholder message', async () => {
			const wrapper = getWrapper();
			await wrapper.setProps( { modelValue: 'textField' } );

			expect( wrapper.find( '.field-container__message' ).exists() ).toBeTruthy();
			expect( wrapper.find( '.field-container__message' ).text() ).toContain( 'I hate Mondays' );
			expect( wrapper.find( '.field-container__message' ).text() ).toContain( 'textField' );
		} );

		it( 'shows the message slot', async () => {
			const wrapper = getWrapper( {
				message: `<span class="test-message">I hate Mondays</span>`,
			} );

			expect( wrapper.find( '.test-message' ).exists() ).toBeTruthy();
			expect( wrapper.find( '.test-message' ).text() ).toStrictEqual( 'I hate Mondays' );
		} );

		it( 'shows the value equals placeholder message before the message slot', async () => {
			const wrapper = getWrapper( {
				message: `<span class="test-message">I hate Mondays</span>`,
			} );

			await wrapper.setProps( { modelValue: 'textField' } );

			expect( wrapper.find( '.test-message' ).exists() ).toBeFalsy();
			expect( wrapper.find( '.field-container__message' ).exists() ).toBeTruthy();
			expect( wrapper.find( '.field-container__message' ).text() ).toContain( 'I hate Mondays' );
			expect( wrapper.find( '.field-container__message' ).text() ).toContain( 'textField' );
		} );

		it( 'shows the help text', async () => {
			const wrapper = getWrapper();

			expect( wrapper.find( '.field-container__help-text' ).exists() ).toBeFalsy();

			await wrapper.setProps( { helpText: 'help-text' } );

			expect( wrapper.find( '#textField-help-text' ).exists() ).toBeTruthy();
			expect( wrapper.find( '#textField-help-text' ).text() ).toStrictEqual( 'help-text' );
		} );

		it( 'shows the label help text', async () => {
			const wrapper = getWrapper();

			expect( wrapper.find( '.field-container__help-text' ).exists() ).toBeFalsy();

			await wrapper.setProps( { labelHelpText: 'label-help-text' } );

			expect( wrapper.find( 'label' ).text() ).toContain( 'label-help-text' );
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

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper();
			expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

			await wrapper.setProps( { helpText: 'help-text' } );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text' );

			await wrapper.setProps( { modelValue: 'textField' } );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text textField-message' );

			await wrapper.setProps( { showError: true } );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text textField-error' );

			await wrapper.setProps( { ariaDescribedby: 'extra-label' } );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-help-text textField-error extra-label' );
		} );

		it( 'sets aria-describedby when there is a message slot', async () => {
			const wrapper = getWrapper( {
				message: `<span class="test-message">I hate Mondays</span>`,
			} );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-message' );

			await wrapper.setProps( { showError: true } );

			expect( wrapper.find( '#textField' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'textField-error' );
		} );
	} );

} );
