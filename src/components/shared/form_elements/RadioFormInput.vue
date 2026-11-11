<template>
	<div>
		<label @blur="$emit( 'blur' )">
			<input
				v-model="inputModel"
				type="radio"
				:name="name"
				:id="id"
				:class="inputClass"
				:value="nativeValue"
				:disabled="disabled ? true : null"
				:readonly="disabled"
				:aria-describedby="ariaDescribedby"
				:aria-invalid="ariaInvalid"
				:aria-disabled="disabled"
				:autofocus="autofocus"
				@blur="$emit( 'blur' )"
				@focus="trackFieldInteraction( name, 'focus' )"
			/>
			<span>
			<slot name="label"/>
			<slot name="help-text"/>
		</span>
			<slot name="tooltip"/>
		</label>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';
import { inject } from 'vue';
import { trackFieldInteractionType } from '@src/util/tracking';

interface Props {
	modelValue: string | number | boolean | null;
	nativeValue: string | number | boolean;
	name: string;
	id: string;
	inputClass?: string;
	disabled?: boolean;
	ariaDescribedby?: string | undefined;
	ariaInvalid?: boolean;
	autofocus?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: false,
	required: false,
	ariaDescribedby: '',
	ariaInvalid: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'blur' ] );

const inputModel = useInputModel<string | number | boolean | null>( () => props.modelValue, props.modelValue, emit );
const trackFieldInteraction = inject<trackFieldInteractionType>( 'trackFieldInteraction' );

</script>
