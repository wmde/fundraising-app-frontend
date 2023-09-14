<template>
	<div class="control select-form-input" :class="{ 'is-disabled': disabled }">
		<span class="select">
			<select
				v-model="inputModel"
				:name="name"
				:id="selectId"
				:disabled="disabled"
				:required="required"
			>
                <slot/>
			</select>
		</span>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_inputs/useInputModel';

interface Props {
	modelValue: string | number;
	name: string;
	selectId: string;
	disabled?: boolean;
	required?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	multiple: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur' ] );

const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );

</script>

<style scoped lang="scss">

</style>
