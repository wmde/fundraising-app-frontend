import { Ref, ref, UnwrapRef, watch } from 'vue';

export function useFieldModel<T>( modelValue: () => UnwrapRef<T>, initialValue: T ): Ref<UnwrapRef<T>> {
	const fieldModel = ref<T>( initialValue );

	watch( modelValue, ( newValue: UnwrapRef<T> ) => {
		fieldModel.value = newValue;
	} );

	return fieldModel;
}
