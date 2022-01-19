<template>
    <div class="form-input">
		<label for="email" class="subtitle">{{ $t( 'donation_form_email_label' ) }}</label>
		<b-field :type="{ 'is-danger': showError }">
			<b-input type="text"
				id="email"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_email_placeholder' ) } )"
				autocomplete="email"
				v-model="formData.email.value"
				@blur="$emit('field-changed', 'email')">
			</b-input>
		</b-field>
		<span v-if="suggestedProvider" class="help has-text-dark-lighter"> Meinten Sie '{{ suggestedProvider }}'?</span>
		<span v-if="showError" class="help is-danger">{{ $t( 'donation_form_email_error' ) }}</span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { distance, closest } from 'fastest-levenshtein';
import { AddressFormData } from '@/view_models/Address';

export default Vue.extend( {
	name: 'Email',
	props: {
		formData: Object as () => AddressFormData,
		showError: Boolean,
		commonMailProviders: Array,
	},
	computed: {
		suggestedProvider: function () {
			const mailUserInput = this.formData.email.value;
			if ( mailUserInput.indexOf( '@' ) === -1 ) {
				return '';
			}
			const mailHost = mailUserInput.substring( mailUserInput.lastIndexOf( '@' ) + 1 );
			const closestFit = closest( mailHost,
				[ 'gmail.com', 'yahoo.com', 't-online.de', 'abracadabza.ac', 'gmx.net', 'ab.c', 'web.de' ] );
			const calculatedDistance = distance( mailHost, closestFit );
			if ( calculatedDistance > 0 && calculatedDistance <= 2 ) {
				return closestFit;
			}
			return '';
		},
	},
} );
</script>
