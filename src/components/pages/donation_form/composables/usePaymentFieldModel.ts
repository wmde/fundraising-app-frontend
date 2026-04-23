import { computed, Ref, ref, watch } from 'vue';
import { action } from '@src/store/util';
import { Store } from 'vuex';

/**
 * This composable provides a `ref` that can be used as local state for `v-model`
 * in the Payment component. The `ref` is synchronized with the respective field in the store.
 *
 * @param {Store<any>} store The Vuex store
 * @param {string} fieldName Name of the value field in the payment store
 * @param {string} setterAction Name of the store action that changes the value field in the store
 */
export function usePaymentFieldModel( store: Store<any>, fieldName: string, setterAction: string ): Ref<string> {
	const storeValue = computed<string>( () => store.state.payment.values[ fieldName ] );
	const modelValue = ref<string>( storeValue.value );

	watch( modelValue, ( newAmount: string ): void => {
		store.dispatch( action( 'payment', setterAction ), newAmount );
	} );

	watch( storeValue, ( newValue: string ): void => {
		modelValue.value = newValue;
	} );

	return modelValue;
}
