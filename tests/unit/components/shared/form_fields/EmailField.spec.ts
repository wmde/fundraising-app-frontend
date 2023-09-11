import { mount, VueWrapper } from '@vue/test-utils';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import mockAxios from 'jest-mock-axios';

describe( 'EmailField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( EmailField, {
			props: {
				modelValue: '',
				showError: false,
			},
			slots: {
				message: `<span class="test-message">This could have been a meeting</span>`,
			},
		} );
	};

	afterEach( function () {
		mockAxios.reset();
	} );

	it( 'shows the error message', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'span.help.is-danger' ).exists() ).toBeFalsy();

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( 'span.help.is-danger' ).exists() ).toBeTruthy();
		expect( wrapper.find( 'span.help.is-danger' ).text() ).toStrictEqual( 'donation_form_email_error' );
	} );

	it( 'shows the message slot', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.test-message' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.test-message' ).text() ).toStrictEqual( 'This could have been a meeting' );
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

		expect( wrapper.find( '.help.is-clickable' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.help.is-clickable' ).text() ).toStrictEqual( 'donation_form_email_suggestion gmail.com?' );
	} );

	it( 'updates model on suggested provider click', async () => {
		const wrapper = getWrapper();

		mockAxios.mockResponse( {
			status: 200,
			data: [ 'gmail.com', 'gmx.de' ],
		} );

		await wrapper.find( 'input' ).setValue( 'space@gmaiil.com' );
		await wrapper.find( 'input' ).trigger( 'blur' );
		await wrapper.find( '.help.is-clickable' ).trigger( 'click' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'update:modelValue' )[ 1 ][ 0 ] ).toStrictEqual( 'space@gmail.com' );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 2 );
	} );
} );
