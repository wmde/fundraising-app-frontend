import { Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

export function useIsCompanyModel( store: Store<any> ): Ref<boolean> {
	const isCompany = ref<boolean>( store.state.address.isCompany );

	watch( isCompany, ( newValue: boolean ) => {
		store.dispatch( action( 'address', 'setIsCompany' ), newValue );
	} );

	return isCompany;
}
