import { onBeforeUnmount, onMounted, Ref } from 'vue';

export function useDetectOutsideClick( component: Ref<HTMLElement>, callback: () => void ) {
	if ( !component ) {
		return;
	}

	const listener = ( event: Event ): void => {
		if ( event.target !== component.value && event.composedPath().includes( component.value ) ) {
			return;
		}
		if ( typeof callback === 'function' ) {
			callback();
		}
	};

	onMounted( () => {
		window.addEventListener( 'click', listener );
	} );

	onBeforeUnmount( () => {
		window.removeEventListener( 'click', listener );
	} );

	return { listener };
}
