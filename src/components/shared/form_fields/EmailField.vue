<template>
	<div class="form-field form-field-email" :class="{ 'is-invalid': showError }">
		<label :for="inputId ?? 'email'" class="form-field-label">{{ $t( 'donation_form_email_label' ) }}</label>
		<TextFormInput
			input-type="text"
			:input-id="inputId ?? 'email'"
			name="email"
			:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_email_placeholder' ) } )"
			autocomplete="email"
			v-model="fieldModel"
			:has-error="showError"
			:has-message="suggestedProvider !== ''"
			:aria-describedby="ariaDescribedby"
			@update:modelValue="onUpdateModel"
			@blur="$emit('field-changed', 'email')"
		/>
		<span v-if="suggestedProvider"
				class="help is-clickable"
				role="link"
				tabindex="0"
				@click="onSuggestionClicked( suggestedProvider )"
				@keyup.enter.space="onSuggestionClicked( suggestedProvider )"
		>
			{{ $t( 'donation_form_email_suggestion' ) }} <strong>{{ suggestedProvider }}</strong>?
		</span>
		<span v-if="showError" class="help is-danger error-email" :id="`${(inputId ?? 'email' )}-error`">{{ $t( 'donation_form_email_error' ) }}</span>
		<slot name="message"/>
	</div>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { useSuggestedEmailProvider } from '@src/components/shared/form_fields/useSuggestedEmailProvider';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';
import { computed } from 'vue';

interface Props {
	modelValue: string;
	showError: boolean;
	inputId?: string;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const mailHostList = useMailHostList();
const fieldModel = useFieldModel<string>( () => props.modelValue, props.modelValue );
const { suggestedProvider, onSuggestionClicked } = useSuggestedEmailProvider( fieldModel, mailHostList, emit );
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => props.ariaDescribedby ),
	`${( props.inputId ?? 'email' )}-error`,
	computed<boolean>( () => props.showError )
);

const onUpdateModel = ( newValue: string ): void => {
	emit( 'update:modelValue', newValue );
};

</script>

<style lang="scss">

</style>
