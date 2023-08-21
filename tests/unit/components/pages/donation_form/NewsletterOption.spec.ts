import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import NewsletterOption from '../../../../../src/components/pages/donation_form/NewsletterOption.vue';
import { createStore } from '@/store/donation_store';
import { action } from '@/store/util';
import { NS_ADDRESS } from '@/store/namespaces';
import { setNewsletterChoice } from '@/store/address/actionTypes';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'NewsletterOption', () => {
	it( 'renders the component with the checkbox unselected', () => {
		const wrapper = mount( NewsletterOption, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => { },
			},
		} );
		const checkbox = wrapper.find( '#newsletter' );
		expect( checkbox.props().value ).toBe( false );
	} );

	it( 'sends changed preference to store on change', () => {
		const wrapper = mount( NewsletterOption, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => { },
			},
		} );
		const store = wrapper.vm.$store;
		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setNewsletterChoice );
		const checkbox = wrapper.find( '#newsletter' );
		wrapper.setData( { newsletter: true } );
		checkbox.trigger( 'change' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, true );
	} );
} );
