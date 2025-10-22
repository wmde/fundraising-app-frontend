<template>
	<label>
		<input
			v-model="inputModel"
			:value="inputModel"
			type="checkbox"
			:name="name"
			:id="inputId"
			:disabled="disabled ? true : null"
			:aria-describedby="describedBy"
		/>
		<span><slot/></span>
	</label>
</template>

<script setup lang="ts">
import { useInputModel } from '@src/components/shared/form_elements/useInputModel';

interface Props {
	modelValue: boolean | null;
	name: string;
	inputId: string;
	disabled?: boolean;
	describedBy?: string;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
} );
const emit = defineEmits( [ 'update:modelValue' ] );

const inputModel = useInputModel<boolean>( () => props.modelValue, props.modelValue, emit );

</script>
