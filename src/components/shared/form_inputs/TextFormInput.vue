<template>
	<div class="control" :class="{ 'has-icons-right': hasError || hasMessage, 'is-disabled': disabled }">
		<input
			v-if="inputType === 'text'"
			:name="name"
			v-model="inputModel"
			class="input"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			type="text"
			:autocomplete="autocomplete"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			@blur="$emit( 'blur' )"
			@focus="$emit( 'focus' )"
		/>
		<textarea
			v-if="inputType === 'textarea'"
			:name="name"
			v-model="inputModel"
			class="textarea"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			:autocomplete="autocomplete"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			@blur="$emit( 'blur' )"
			@focus="$emit( 'focus' )"
		/>
		<span v-if="hasError" class="icon is-right has-text-danger">
			<i class="mdi mdi-alert-circle mdi-24px"></i>
		</span>
		<span v-if="hasMessage" class="icon is-right has-text-warning">
			<i class="mdi mdi-alert mdi-24px"></i>
		</span>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_inputs/useInputModel';

interface Props {
	inputType: 'text'|'textarea';
	name: string;
	modelValue: string|number;
	autocomplete?: string;
	inputId: string;
	placeholder: string;
	hasMessage: boolean;
	hasError: boolean;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	autocomplete: 'on',
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur' ] );

const inputModel = useInputModel( () => props.modelValue, props.modelValue, emit );

</script>

<style scoped lang="scss">

</style>
