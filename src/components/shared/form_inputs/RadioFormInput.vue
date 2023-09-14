<template>
	<label
		ref="labelRef"
		class="radio radio-form-input"
		:class="{ 'is-disabled': disabled }"
		@click="focus"
		@keydown.prevent.enter="click"
	>
		<input
			v-model="inputModel"
			type="radio"
			ref="inputRef"
			:name="name"
			:value="nativeValue"
			:disabled="disabled"
			:required="required"
		/>
		<span class="check"/>
		<span class="control-label"><slot/></span>
	</label>
</template>

<script setup lang="ts">

import { useInputFocusing } from '@src/components/shared/form_inputs/useInputFocusing';
import { useInputModel } from '@src/components/shared/form_inputs/useInputModel';

interface Props {
	modelValue: string | number | boolean | null;
	nativeValue: string | number | boolean;
	name: string;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const { labelRef, inputRef, focus, click } = useInputFocusing();
const inputModel = useInputModel<string | number | boolean | null>( () => props.modelValue, props.modelValue, emit );

</script>

<style scoped lang="scss">

</style>
