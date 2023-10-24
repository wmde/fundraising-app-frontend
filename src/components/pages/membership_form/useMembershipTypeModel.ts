import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { Store } from 'vuex';
import { setMembershipType } from '@src/store/membership_address/actionTypes';

export function useMembershipTypeModel( store: Store<any> ): Ref<number> {
	const membershipType = ref<number>( store.state.membership_address.membershipType );

	watch( membershipType, ( newValue: number ) => {
		store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setMembershipType ), newValue );
	} );

	return membershipType;
}
