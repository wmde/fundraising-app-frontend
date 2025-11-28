<template>
	<select
		v-model="inputModel"
		:name="name"
		:id="selectId"
		:disabled="disabled"
		:class="{ 'is-danger': hasError }"
		:aria-invalid="hasError"
		:aria-describedby="ariaDescribedby"
	>
		<slot/>
	</select>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: string | number;
	name: string;
	selectId: string;
	hasError?: boolean;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string | undefined;
}

const props = withDefaults( defineProps<Props>(), {
	hasError: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

</script>
