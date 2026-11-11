<template>
	<div class="text-radio" :data-direction="$i18n.locale === 'de-DE' ? 'rtl' : null">
		<span class="text-radio__radio" :class="{ 'text-radio__radio--checked': radioChecked }" @click="onClickRadio" aria-hidden="true"></span>
		<input
			:name="name"
			v-model="inputModel"
			ref="customInput"
			class="text-radio__text"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			type="text"
			:autocomplete="autocomplete"
			:autofocus="autofocus"
			:placeholder="placeholder"
			:disabled="disabled ? true : null"
			:aria-invalid="hasError"
			:aria-describedby="ariaDescribedby"
			:aria-autocomplete="ariaAutocomplete"
			@blur="onBlur"
			@focus="onFocus"
			@input="onInput"
		/>
		<span class="text-radio__currency">€</span>
	</div>
</template>

<script setup lang="ts">

import { useInputModel } from '@src/components/shared/form_elements/useInputModel';
import { inject, ref } from 'vue';
import { trackFieldInteractionType } from '@src/util/tracking';

interface Props {
	name: string;
	modelValue: string | number;
	autocomplete?: string;
	autofocus?: boolean;
	inputId: string;
	placeholder: string;
	hasMessage: boolean;
	radioChecked: boolean;
	hasError?: boolean;
	disabled?: boolean;
	required?: boolean;
	ariaDescribedby?: string | undefined;
	ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
}

const props = withDefaults( defineProps<Props>(), {
	autocomplete: 'on',
	hasError: false,
	disabled: false,
	required: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'focus', 'blur', 'input', 'radioClicked' ] );
const customInput = ref<HTMLInputElement>( null );
const inputModel = useInputModel<string | number>( () => props.modelValue, props.modelValue, emit );
const trackFieldInteraction = inject<trackFieldInteractionType>( 'trackFieldInteraction' );

const onFocus = ( event: Event ): void => {
	trackFieldInteraction( props.name, 'focus' );
	emit( 'focus', event );
};
const onBlur = ( event: Event ): void => emit( 'blur', event );
const onInput = ( event: Event ): void => emit( 'input', event );
const onClickRadio = () => {
	customInput.value.focus();
	emit( 'radioClicked' );
};
</script>
