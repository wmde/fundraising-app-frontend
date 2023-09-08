<template>
    <div class="form-input">
		<label for="email" class="subtitle">{{ $t( 'donation_form_email_label' ) }}</label>
		<div class="field">
			<TextInput
				type="text"
				input-id="email"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_email_placeholder' ) } )"
				autocomplete="email"
				v-model="formData.email.value"
				:has-error="showError"
				:has-message="suggestedProvider !== ''"
				@blur="$emit('field-changed', 'email')"
			/>
		</div>
		<span v-if="suggestedProvider" @click="onSuggestionClicked( suggestedProvider )" class="help is-clickable">
			{{ $t( 'donation_form_email_suggestion' ) }} <strong>{{ suggestedProvider }}</strong>?
		</span>
		<span v-if="showError" class="help is-danger error-email">{{ $t( 'donation_form_email_error' ) }}</span>
		<ValueEqualsPlaceholderWarning
			:value="formData.email.value"
			:placeholder="$t( 'donation_form_email_placeholder' )"
			:warning="'donation_form_email_placeholder_warning'"
		/>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { closest, distance } from '@src/util/fastest-levenshtein';
import { AddressFormData } from '@src/view_models/Address';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';

interface Props {
	formData: AddressFormData,
	showError: boolean,
	commonMailProviders: string[],
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'field-changed' ] );

const suggestedProvider = computed( () => {
	if ( props.commonMailProviders.length === 0 ) {
		return '';
	}
	const mailUserInput = props.formData.email.value;
	if ( mailUserInput.indexOf( '@' ) === -1 ) {
		return '';
	}
	const mailHost = mailUserInput.slice( Math.max( 0, mailUserInput.lastIndexOf( '@' ) + 1 ) );
	if ( mailHost.match( /^\w+\.\w{2}/ ) ) {
		const closestFit = closest( mailHost, props.commonMailProviders );
		const calculatedDistance = distance( mailHost, closestFit );
		if ( calculatedDistance > 0 && calculatedDistance <= 3 ) {
			return closestFit;
		}
	}
	return '';
} );

const onSuggestionClicked = ( suggestion:string ) => {
	props.formData.email.value = props.formData.email.value.split( '@', 1 ).toString() + '@' + suggestion;
	emit( 'field-changed', 'email' );
};

</script>
