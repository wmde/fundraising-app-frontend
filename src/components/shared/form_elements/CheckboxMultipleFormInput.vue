<template>
	<label>
		<input
			v-model="inputModel"
			:value="nativeValue"
			type="checkbox"
			:name="name"
			:id="inputId"
			:disabled="disabled ? true : null"
			:aria-describedby="ariaDescribedby"
		/>
		<span><slot/></span>
	</label>
</template>

<script setup lang="ts">
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: Array<string | number>;
	nativeValue: string | number | boolean;
	name: string;
	inputId: string;
	disabled?: boolean;
	ariaDescribedby?: string | undefined;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const inputModel = useInputModel<Array<string | number>>( () => props.modelValue, props.modelValue, emit );

</script>
