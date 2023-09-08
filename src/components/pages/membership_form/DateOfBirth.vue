<template>
	<fieldset>
		<label for="birthDate" class="subtitle has-margin-top-36">{{ $t( 'membership_form_birth_date_label' ) }}</label>
		<div class="field">
			<TextInput
				input-id="birthDate"
				name="birthDate"
				:placeholder="$t( 'membership_form_birth_date_placeholder' )"
				v-model="formData.date.value"
				@blur="$emit('field-changed', 'date')"
				:has-error="showError"
			/>
		</div>
		<span v-if="!showError" class="help has-text-dark-lighter">{{ $t( 'membership_form_birth_date_help_text' ) }}</span>
		<span v-if="showError" class="help is-danger">{{ $t( 'membership_form_birth_date_error' ) }}</span>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';

export default defineComponent( {
	name: 'DateOfBirth',
	components: { TextInput },
	props: {
		formData: Object as () => FormData,
		showError: Boolean,
	},
} );
</script>
