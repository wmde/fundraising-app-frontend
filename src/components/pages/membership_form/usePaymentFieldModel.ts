import { computed, Ref, ref, watch } from 'vue';
import { NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { action } from '@src/store/util';
import { Store } from 'vuex';
import { GenericValuePayload } from '@src/view_models/MembershipFee';

/**
 * This composable provides a `ref` that can be used as local state for `v-model`
 * in the Payment component. The `ref` is synchronized with the respective field in the store.
 *
 * @param {Store<any>} store The Vuex store
 * @param {string} fieldNameInStore Name of the value field in the payment store
 * @param {string} setterAction Name of the store action that changes the value field in the store
 * @param validateFeeUrl URL that checks the integrity of the fee
 */
export function usePaymentFieldModel( store: Store<any>, fieldNameInStore: string, setterAction: string, validateFeeUrl: string ): Ref<string> {

	// TODO storeValue is initially empty string for memberships, this needs to be handled

	const storeValue = computed<string>( () => store.state[ NS_MEMBERSHIP_FEE ].values[ fieldNameInStore ] ?? '' );
	const modelValue = ref<string>( store.state[ NS_MEMBERSHIP_FEE ].values[ fieldNameInStore ] ?? '' );

	watch( modelValue, ( newValue: string ): void => {
		const newValuePayload :GenericValuePayload = {
			selectedValue: newValue,
			validateFeeUrl: validateFeeUrl,
		};
		store.dispatch( action( NS_MEMBERSHIP_FEE, setterAction ), newValuePayload );
	} );

	watch( storeValue, ( newValue: string ): void => {
		modelValue.value = newValue;
	} );

	return modelValue;
}
