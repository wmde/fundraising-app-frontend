<template>
	<label
		ref="labelRef"
		class="radio"
		:class="{ 'is-disabled': disabled }"
		@click="focus"
		@keydown.prevent.enter="click"
	>
		<input
			v-model="inputModel"
			type="checkbox"
			ref="inputRef"
			:name="name"
			:id="inputId"
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
	modelValue: boolean;
	name: string;
	inputId: string;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const { labelRef, inputRef, focus, click } = useInputFocusing();
const inputModel = useInputModel<boolean>( () => props.modelValue, props.modelValue, emit );

</script>

<style scoped lang="scss">

</style>
