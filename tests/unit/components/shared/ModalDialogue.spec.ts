import { shallowMount } from '@vue/test-utils';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';

const modalState = useModalState();

describe( 'ModalDialogue.vue', () => {

	let showCallback: jest.Mock;
	let closeCallback: jest.Mock;

	beforeAll( () => {
		showCallback = jest.fn();
		closeCallback = jest.fn();
		HTMLDialogElement.prototype.showModal = showCallback;
		HTMLDialogElement.prototype.close = closeCallback;
	} );

	function getWrapper() {
		return shallowMount( ModalDialogue, {
			props: {
				title: '',
				visible: false,
			},
		} );
	}

	/**
	 * The 2 expects are explicitly commented here because jsdom doesn't support the open attribute yet
	 * If you're looking at this please uncomment them and check if support was added
	 *
	 * SEE: https://github.com/jsdom/jsdom/issues/3294
	 */
	it( 'opens and closes the modal', async () => {
		modalState.value = ModalStates.Closed;
		const wrapper = getWrapper();

		await wrapper.setProps( { visible: true } );

		// expect( wrapper.attributes( 'open' ) ).toBeUndefined();

		await wrapper.setProps( { visible: false } );

		// expect( wrapper.attributes( 'open' ) ).toStrictEqual( 'true' );

		expect( showCallback ).toHaveBeenCalled();
		expect( closeCallback ).toHaveBeenCalled();
	} );

	it( 'sets the modalState', async () => {
		modalState.value = ModalStates.Closed;
		const wrapper = getWrapper();

		await wrapper.setProps( { visible: true } );

		expect( modalState.value ).toStrictEqual( ModalStates.Open );

		await wrapper.setProps( { visible: false } );

		expect( modalState.value ).toStrictEqual( ModalStates.Closed );
	} );
} );
