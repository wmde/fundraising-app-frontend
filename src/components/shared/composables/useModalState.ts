import { Ref, ref } from 'vue';

export enum ModalStates {
	Open,
	Closed,
}

const modalState = ref<ModalStates>( ModalStates.Closed );

export function useModalState(): Ref<ModalStates> {
	return modalState;
}
