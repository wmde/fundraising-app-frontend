<template>
	<label>
		<slot/>
		<input
			v-model="inputModel"
			:value="inputModel"
			type="checkbox"
			class="toggle"
			:name="name"
			:id="inputId"
			:disabled="disabled"
			:required="required"
			:aria-describedby="describedBy"
		/>
	</label>
</template>

<script setup lang="ts">
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: boolean | null;
	name: string;
	inputId: string;
	disabled?: boolean;
	required?: boolean;
	describedBy?: string;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const inputModel = useInputModel<boolean>( () => props.modelValue, props.modelValue, emit );

</script>
