import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';

export function useIncentivesModel( store: Store<any> ): Ref<string[]> {
	const incentives = ref<string[]>( store.state.membership_address.incentives );

	watch( incentives, ( newValue: string[] | null ) => {
		store.dispatch( action( 'membership_address', 'setIncentives' ), newValue );
	} );

	return incentives;
}
