import { shallowMount } from '@vue/test-utils';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';

const modalState = useModalState();

describe( 'ModalDialogue.vue', () => {
	it( 'shows the modal', async () => {
		const wrapper = shallowMount( ModalDialogue, {
			props: {
				title: '',
				visible: false,
			},
			global: {
				stubs: {
					teleport: true,
				},
			},
		} );

		expect( wrapper.find( '.modal-dialogue' ).classes() ).not.toContain( 'active' );

		await wrapper.setProps( { visible: true } );

		expect( wrapper.find( '.modal-dialogue' ).classes() ).toContain( 'active' );
	} );

	it( 'set the modalState', async () => {
		modalState.value = ModalStates.Closed;
		const wrapper = shallowMount( ModalDialogue, {
			props: {
				title: '',
				visible: false,
			},
			global: {
				stubs: {
					teleport: true,
				},
			},
		} );

		await wrapper.setProps( { visible: true } );

		expect( modalState.value ).toStrictEqual( ModalStates.Open );

		await wrapper.setProps( { visible: false } );

		expect( modalState.value ).toStrictEqual( ModalStates.Closed );
	} );
} );
