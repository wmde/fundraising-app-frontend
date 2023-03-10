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
		<span v-if="suggestedProvider" @click="onSuggestionClicked(suggestedProvider)" class="help is-clickable">
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

<script lang="ts">
import Vue from 'vue';
import { computed } from 'vue';
import { distance, closest } from '@/util/fastest-levenshtein';
import { AddressFormData } from '@/view_models/Address';
import ValueEqualsPlaceholderWarning from '@/components/shared/ValueEqualsPlaceholderWarning.vue';

export default Vue.extend( {
	name: 'Email',
	components: { ValueEqualsPlaceholderWarning },
	props: {
		formData: Object as () => AddressFormData,
		showError: Boolean,
		commonMailProviders: { type: Array, default: () => { return []; } },
	},
	setup( props: any, { emit } ) {
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

		return { suggestedProvider, onSuggestionClicked };
	},
} );
</script>
