import { Ref, ref, UnwrapRef, watch } from 'vue';

type VueRefReturnType<T> = Ref<any, any> | Ref<T, T> | Ref<UnwrapRef<T>, T | UnwrapRef<T>>;

export function useFieldModel<T>( modelValue: () => UnwrapRef<T>, initialValue: T ): VueRefReturnType<T> {
	const fieldModel = ref<T>( initialValue );

	watch( modelValue, ( newValue: UnwrapRef<T> ) => {
		fieldModel.value = newValue;
	} );

	return fieldModel;
}
