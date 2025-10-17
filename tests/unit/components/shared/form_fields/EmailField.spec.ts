import { mount, VueWrapper } from '@vue/test-utils';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import mockAxios from 'jest-mock-axios';

describe( 'EmailField.vue', () => {

	const getWrapper = ( slots: { message?: string } = {} ): VueWrapper<any> => {
		return mount( EmailField, {
			props: {
				modelValue: '',
				showError: false,
			},
			slots,
		} );
	};

	afterEach( function () {
		mockAxios.reset();
	} );

	describe( 'functionality tests', () => {
		it( 'shows the error message', async () => {
			const wrapper = getWrapper();

			expect( wrapper.attributes( 'data-error' ) ).toBeFalsy();

			await wrapper.setProps( { showError: true } );

			expect( wrapper.attributes( 'data-error' ) ).toBeTruthy();
			expect( wrapper.find( '.field-container__error-text' ).text() ).toStrictEqual( 'donation_form_email_error' );
			expect( wrapper.find( 'input' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'email-error' );
		} );

		it( 'shows the message the message slot', async () => {
			const wrapper = getWrapper( {
				message: `<span class="test-message">This could have been a meeting</span>`,
			} );

			expect( wrapper.find( '.field-container__message' ).text() ).toStrictEqual( 'This could have been a meeting' );
		} );

		it( 'updates value on model change', async () => {
			const wrapper = getWrapper();
			const input = wrapper.find<HTMLInputElement>( 'input' );

			expect( input.element.value ).toStrictEqual( '' );

			await wrapper.setProps( { modelValue: 'space@ghost.com' } );

			expect( input.element.value ).toStrictEqual( 'space@ghost.com' );
		} );

		it( 'emits events', async () => {
			const wrapper = getWrapper();

			await wrapper.find( 'input' ).setValue( 'space@ghost.com' );
			await wrapper.find( 'input' ).trigger( 'blur' );

			expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
			expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'space@ghost.com' );
			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
			expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'email' );
		} );

		it( 'shows suggested provider', async () => {
			const wrapper = getWrapper();

			mockAxios.mockResponse( {
				status: 200,
				data: [ 'gmail.com', 'gmx.de' ],
			} );

			await wrapper.find( 'input' ).setValue( 'space@gmaiil.com' );

			expect( wrapper.find( '.field-container__message' ).exists() ).toBeTruthy();
			expect( wrapper.find( '.field-container__message' ).text() ).toStrictEqual( 'donation_form_email_suggestion gmail.com?' );
		} );

		it( 'updates model on suggested provider click', async () => {
			const wrapper = getWrapper();

			mockAxios.mockResponse( {
				status: 200,
				data: [ 'gmail.com', 'gmx.de' ],
			} );

			await wrapper.find( 'input' ).setValue( 'space@gmaiil.com' );
			await wrapper.find( 'input' ).trigger( 'blur' );
			await wrapper.find( '.field-container__message button' ).trigger( 'click' );

			expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 2 );
			expect( wrapper.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toStrictEqual( 'space@gmail.com' );
			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 2 );
		} );

		it( 'revalidates on input when invalid', async () => {
			const wrapper = getWrapper();

			await wrapper.find( 'input' ).trigger( 'input' );

			expect( wrapper.emitted( 'field-changed' ) ).toBeUndefined();

			await wrapper.setProps( { showError: true } );
			await wrapper.find( 'input' ).trigger( 'input' );

			expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
			expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'email' );
		} );
	} );

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper();
			expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

			// Match the field value to the placeholder
			await wrapper.setProps( { modelValue: '{"key":"donation_form_email_placeholder"}' } );

			expect( wrapper.find( '#email' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'email-message' );

			await wrapper.setProps( { showError: true } );

			expect( wrapper.find( '#email' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'email-error' );
		} );

		it( 'sets aria-describedby when there is a message slot', async () => {
			const wrapper = getWrapper( {
				message: `<span class="test-message">This could have been a meeting</span>`,
			} );

			expect( wrapper.find( '#email' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'email-message' );

			await wrapper.setProps( { showError: true } );

			expect( wrapper.find( '#email' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'email-error' );
		} );
	} );
} );
