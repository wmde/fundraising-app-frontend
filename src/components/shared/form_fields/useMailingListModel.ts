import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

export function useMailingListModel( store: Store<any> ): Ref<boolean> {
	const mailingList = ref<boolean>( store.state.address.newsletter );

	watch( mailingList, ( newValue: boolean ) => {
		store.dispatch( action( 'address', 'setNewsletterChoice' ), newValue );
	} );

	return mailingList;
}
