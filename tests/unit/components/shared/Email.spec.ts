import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Email from '@/components/shared/Email.vue';
import { createStore } from '@/store/donation_store';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'Email', () => {

	it( 'shows an error if the entered email has an invalid format', () => {
		const wrapper = mount( Email, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				showError: true,
				formData: {
					email: {
						value: 'notanemail',
					},
				},
			},
		} );
		const errorElement = wrapper.find( '.help.is-danger' );
		expect( errorElement.text() ).toMatch( 'donation_form_email_error' );
	} );

	it( 'suggests a mail provider if the entered email address contains typos in that part', () => {
		const wrapper = mount( Email, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				commonMailProviders: [ 'gmail.com', 't-online.de', 'gmx.net' ],
				formData: {
					email: {
						value: 'i-missed-a-letter@gmail.co',
					},
				},
			},
		} );

		const infoElement = wrapper.find( '.help' );
		expect( infoElement.text() ).toMatch( 'donation_form_email_suggestion gmail.com?' );
	} );

	it( 'changes the email when the suggestion is clicked.', async () => {
		const wrapper = mount( Email, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				commonMailProviders: [ 'gmail.com', 't-online.de', 'gmx.net' ],
				formData: {
					email: {
						value: 'i-missed-a-letter@gmail.co',
					},
				},
			},
		} );

		const infoElement = wrapper.find( '.help' );
		await infoElement.trigger('click' )
		expect( ( wrapper.find('input' ).element as HTMLInputElement ).value ).toMatch( 'i-missed-a-letter@gmail.com' );
		expect( wrapper.find( '.help' ).exists() ).toBeFalsy();
	} );

	it( 'does not suggest mail provider if no typos are detectable', () => {
		const wrapper = mount( Email, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				commonMailProviders: [ 'gmail.com', 't-online.de', 'gmx.net' ],
				formData: {
					email: {
						value: 'fine@gmail.com',
					},
				},
			},
		} );
		const infoElement = wrapper.find( '.help' );
		expect( infoElement.exists() ).toBeFalsy();
	} );

	it( 'does not suggest mail provider if input is more than 2 steps away from nearest suggestion', () => {
		const wrapper = mount( Email, {
			localVue,
			store: createStore(),
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				commonMailProviders: [ 'gmail.com', 't-online.de', 'gmx.net' ],
				formData: {
					email: {
						value: 'totally-different_provider@gmail1234.com',
					},
				},
			},
		} );
		const infoElement = wrapper.find( '.help' );
		expect( infoElement.exists() ).toBeFalsy();
	} );
} );
