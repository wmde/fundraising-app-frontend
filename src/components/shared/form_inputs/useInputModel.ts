import { computed, ref, UnwrapRef, watch, WritableComputedRef } from 'vue';

export function useInputModel<T>(
	modelValue: () => UnwrapRef<T>,
	initialValue: T,
	emit: ( event: string, value: UnwrapRef<T> ) => void
): WritableComputedRef<UnwrapRef<T>> {
	const backingValue = ref<T>( initialValue );

	const inputModel = computed<UnwrapRef<T>>( {
		get: () => backingValue.value,
		set: ( newValue: UnwrapRef<T> ): void => {
			backingValue.value = newValue;
			emit( 'update:modelValue', newValue );
		},
	} );

	watch( modelValue, ( newModelValue: UnwrapRef<T> ) => {
		backingValue.value = newModelValue;
	} );

	return inputModel;
}
