<template>
	<fieldset>
		<label for="birthDate" class="subtitle has-margin-top-36">{{ $t( 'membership_form_birth_date_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError }">
			<b-input type="text"
				id="birthDate"
				:placeholder="$t( 'membership_form_birth_date_placeholder' )"
				v-model="formData.date.value"
				@blur="$emit('field-changed', 'date')">>
			</b-input>
		</b-field>
		<span v-if="showError" class="help is-danger">{{ $t( 'membership_form_birth_date_error' ) }}</span>
	</fieldset>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'DateOfBirth',
	props: {
		formData: Object as () => FormData,
		showError: Boolean,
	},
} );
</script>
