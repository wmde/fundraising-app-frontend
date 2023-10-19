import { shallowMount } from '@vue/test-utils';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';

describe( 'ModalDialogue.vue', () => {
	it( 'shows the modal', async () => {
		const wrapper = shallowMount( ModalDialogue, {
			props: {
				visible: false,
			},
		} );

		expect( wrapper.classes() ).not.toContain( 'active' );

		await wrapper.setProps( { visible: true } );

		expect( wrapper.classes() ).toContain( 'active' );
	} );
} );
