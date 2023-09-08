import { computed, ComputedRef, ref, watch } from 'vue';

export function useInputModel(
	modelValue: () => string | number,
	initialValue: string | number,
	emit: ( event: string, value: string|number ) => void
): ComputedRef<string | number> {
	const backingValue = ref<string | number>( initialValue );

	const inputModel = computed( {
		get: () => backingValue.value,
		set: ( newValue: string|number ): void => {
			backingValue.value = newValue;
			emit( 'update:modelValue', newValue );
		},
	} );

	watch( modelValue, ( newModelValue: string | number ) => {
		backingValue.value = newModelValue;
	} );

	return inputModel as ComputedRef<string | number>;
}
