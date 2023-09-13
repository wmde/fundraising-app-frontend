<template>
	<div class="form-field form-field-email">
		<label for="email" class="form-field-label">{{ $t( 'donation_form_email_label' ) }}</label>
		<div class="field">
			<TextFormInput
				input-type="text"
				input-id="email"
				name="email"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_email_placeholder_vuei18n_v3' ) } )"
				autocomplete="email"
				v-model="fieldModel"
				:has-error="showError"
				:has-message="suggestedProvider !== ''"
				@update:modelValue="onUpdateModel"
				@blur="$emit('field-changed', 'email')"
			/>
		</div>
		<span v-if="suggestedProvider" @click="onSuggestionClicked( suggestedProvider )" class="help is-clickable">
			{{ $t( 'donation_form_email_suggestion' ) }} <strong>{{ suggestedProvider }}</strong>?
		</span>
		<span v-if="showError" class="help is-danger error-email">{{ $t( 'donation_form_email_error' ) }}</span>
		<slot name="message"/>
	</div>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { useSuggestedEmailProvider } from '@src/components/shared/form_fields/useSuggestedEmailProvider';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import TextFormInput from '@src/components/shared/form_inputs/TextFormInput.vue';

interface Props {
	modelValue: string;
	showError: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const mailHostList = useMailHostList();
const fieldModel = useFieldModel<string>( () => props.modelValue, props.modelValue );
const { suggestedProvider, onSuggestionClicked } = useSuggestedEmailProvider( fieldModel, mailHostList, emit );

const onUpdateModel = ( newValue: string ): void => {
	emit( 'update:modelValue', newValue );
};

</script>

<style scoped lang="scss">

</style>
