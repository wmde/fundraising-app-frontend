import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

export function useMembershipTypeModel( store: Store<any> ): Ref<number> {
	const membershipType = ref<number>( store.state.membership_address.membershipType );

	watch( membershipType, ( newValue: number ) => {
		store.dispatch( action( 'membership_address', 'setMembershipType' ), newValue );
	} );

	return membershipType;
}
