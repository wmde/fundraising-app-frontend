import { Store } from 'vuex';
import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setIncentives } from '@src/store/membership_address/actionTypes';

export function useIncentivesModel( store: Store<any> ): Ref<string[]> {
	const incentives = ref<string[]>( [ store.state[ NS_MEMBERSHIP_ADDRESS ].incentives ] );

	watch( incentives, ( newValue: string[] | null ) => {
		store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setIncentives ), newValue );
	} );

	return incentives;
}
