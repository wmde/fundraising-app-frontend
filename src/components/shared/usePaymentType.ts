import { Ref, ref, watch } from 'vue';
import { EmitFn } from 'vue/types/v3-setup-context';

/**
 * Internal state of the payment type components
 *
 * We need to watch and synchronize the current type (a property from the parent of the component)
 * because it can change when the parent component changes properties (e.g. when reacting to store value changes).
 * This is less than ideal, because it mixes properties and state. But at the moment there doesn't seem a better way
 * to sync the Buefy with our store while keeping the payment type components independent of the store.
 */
export function usePaymentType( currentType: Ref<string|undefined>, emit: EmitFn ) {
	const selectedType = ref( currentType.value );
	const setType = () => emit( 'payment-type-selected', selectedType.value );

	watch( currentType, ( newType ) => {
		selectedType.value = newType;
	} );

	return {
		selectedType,
		setType,
	};
}
