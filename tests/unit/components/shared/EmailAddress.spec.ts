import { mount, VueWrapper } from '@vue/test-utils';
import EmailAddress from '@src/components/shared/EmailAddress.vue';

describe( 'EmailAddress.vue', () => {

	const getWrapper = ( email: string, commonMailProviders: string[] = [], showError: boolean = false ): VueWrapper<any> => {
		return mount( EmailAddress, {
			props: {
				showError,
				commonMailProviders,
				formData: {
					email: {
						value: email,
					},
				},
			},
		} );
	};

	it( 'shows an error if the entered email has an invalid format', () => {
		const wrapper = getWrapper( 'notanemail', [], true );

		const errorElement = wrapper.find( '.help.is-danger' );

		expect( errorElement.text() ).toMatch( 'donation_form_email_error' );
	} );

	it( 'suggests a mail provider if the entered email address contains typos in that part', () => {
		const wrapper = getWrapper( 'i-missed-a-letter@gmail.co', [ 'gmail.com', 't-online.de', 'gmx.net' ] );

		const infoElement = wrapper.find( '.help' );

		expect( infoElement.text() ).toMatch( 'donation_form_email_suggestion gmail.com?' );
	} );

	it( 'changes the email when the suggestion is clicked.', async () => {
		const wrapper = getWrapper( 'i-missed-a-letter@gmail.co', [ 'gmail.com', 't-online.de', 'gmx.net' ] );

		const infoElement = wrapper.find( '.help' );
		await infoElement.trigger( 'click' );

		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toMatch( 'i-missed-a-letter@gmail.com' );
		expect( wrapper.find( '.help' ).exists() ).toBeFalsy();
	} );

	it( 'does not suggest mail provider if no typos are detectable', () => {
		const wrapper = getWrapper( 'fine@gmail.com', [ 'gmail.com', 't-online.de', 'gmx.net' ] );

		const infoElement = wrapper.find( '.help' );

		expect( infoElement.exists() ).toBeFalsy();
	} );

	it( 'does not suggest mail provider if input is more than 2 steps away from nearest suggestion', () => {
		const wrapper = getWrapper( 'totally-different_provider@gmail1234.com', [ 'gmail.com', 't-online.de', 'gmx.net' ] );

		const infoElement = wrapper.find( '.help' );

		expect( infoElement.exists() ).toBeFalsy();
	} );
} );
