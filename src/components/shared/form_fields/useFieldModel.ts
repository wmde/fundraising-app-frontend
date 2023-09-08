import { Ref, ref, watch } from 'vue';

export function useFieldModel( modelValue: () => string | number, initialValue: string | number ): Ref<string | number> {
	const fieldModel = ref<string | number>( initialValue );

	watch( modelValue, ( newValue: string | number ) => {
		fieldModel.value = newValue;
	} );

	return fieldModel;
}
