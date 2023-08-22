import { mount, VueWrapper } from '@vue/test-utils';
import NewsletterOption from '../../../../../src/components/pages/donation_form/NewsletterOption.vue';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setNewsletterChoice } from '@src/store/address/actionTypes';
import { Store } from 'vuex';

describe( 'NewsletterOption.vue', () => {
	const getWrapper = ( store: Store<any> ): VueWrapper<any> => {
		return mount( NewsletterOption, {
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'renders the component with the checkbox unselected', async () => {
		const store = createStore();
		await store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), false );

		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '#newsletter input' ).element.value ).toBe( 'false' );
	} );

	it( 'renders the component with the checkbox selected', async () => {
		const store = createStore();
		await store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), true );

		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '#newsletter input' ).element.value ).toBe( 'true' );
	} );

	it( 'sends changed preference to store on change', async () => {
		const store = createStore();
		store.dispatch = jest.fn();
		const wrapper = getWrapper( store );
		const expectedAction = action( NS_ADDRESS, setNewsletterChoice );

		await wrapper.find( '#newsletter input' ).trigger( 'change' );

		expect( store.dispatch ).toBeCalledWith( expectedAction, true );
	} );
} );
