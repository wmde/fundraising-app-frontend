<template>
	<fieldset>
		<div class="field">
			<TextField
				name="birthDate"
				:error-message="$t( 'membership_form_birth_date_error' )"
				input-id="birthDate"
				:label="$t( 'membership_form_birth_date_label' )"
				v-model="formData.date.value"
				:placeholder="$t( 'membership_form_birth_date_placeholder' )"
				:show-error="showError"
			>
			</TextField>
		</div>
		<span v-if="!showError" class="help has-text-dark-lighter">{{ $t( 'membership_form_birth_date_help_text' ) }}</span>
	</fieldset>
</template>

<script setup lang="ts">
/**
 * @deprecated not used, TextField is used instead
 */
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { AddressFormData } from '@src/view_models/Address';

interface Props {
	formData: AddressFormData,
	showError: boolean,
}

defineProps<Props>();

</script>
