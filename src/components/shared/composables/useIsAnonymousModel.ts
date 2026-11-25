import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

export function useIsAnonymousModel( store: Store<any> ): Ref<boolean> {
	const isAnonymous = ref<boolean>( store.state.address.isAnonymous );

	watch( isAnonymous, ( newValue: boolean ) => {
		store.dispatch( action( 'address', 'setIsAnonymous' ), newValue );
	} );

	return isAnonymous;
}
