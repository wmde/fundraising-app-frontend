import { shallowMount } from '@vue/test-utils';
import ServerMessage from '@src/components/shared/ServerMessage.vue';
import { nextTick } from 'vue';

describe( 'ServerMessage.vue', () => {
	it( 'focuses when becomes visible', async () => {
		const wrapper = shallowMount( ServerMessage, {
			props: {
				serverMessage: '',
			},
			attachTo: document.body,
		} );

		expect( wrapper.find( '.server-message' ).exists() ).toBeFalsy();

		await wrapper.setProps( { serverMessage: 'Oops' } );
		await nextTick();

		expect( document.activeElement ).toStrictEqual( wrapper.element );
		expect( wrapper.find( '.server-message' ).exists() ).toBeTruthy();
	} );
} );
