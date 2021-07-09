<template>
	<div class="address-section">
		<AutofillHandler @autofill="onAutofill">
			<name
					v-if="showName"
					:show-error="fieldErrors"
					:form-data="formData"
					:address-type="addressType"
					v-on:field-changed="onFieldChange"/>
			<postal
					v-if="showPostal"
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					v-on:field-changed="onFieldChange"/>
			<receipt-opt-out
					:message="$t( 'receipt_needed_donation_page' )"
					:initial-receipt-needed="receiptNeeded"
					v-if="showPostal"
					v-on:opted-out="setReceiptOptedOut( $event )"/>
			<email
					v-if="showEmail"
					:show-error="fieldErrors.email"
					:form-data="formData"
					v-on:field-changed="onFieldChange"/>
			<newsletter-opt-in v-if="showEmail"></newsletter-opt-in>
		</AutofillHandler>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, onMounted, PropType, ref } from '@vue/composition-api';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import Email from '@/components/shared/Email.vue';
import NewsletterOptIn from '@/components/pages/donation_form/NewsletterOptIn.vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { Country } from '@/view_models/Country';
import { AddressValidation } from '@/view_models/Validation';
import { useAddressFunctions } from './AddressFunctions';

export default Vue.extend( {
	name: 'Address',
	components: {
		Name,
		Postal,
		ReceiptOptOut,
		Email,
		NewsletterOptIn,
		AutofillHandler,
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		countries: Array as PropType<Array<Country>>,
		addressValidationPatterns: Object as PropType<AddressValidation>,
		isFullSelected: Boolean,
	},
	setup( props : any, { root: { $store } } ) {
		const addressFunctions = useAddressFunctions( props, $store );

		const showPostal = computed( () => {
			return props.isFullSelected || [ AddressTypeModel.COMPANY, AddressTypeModel.PERSON ].includes( $store.state.address.addressType );
		} );
		const showEmail = computed( () => {
			return props.isFullSelected || [ AddressTypeModel.EMAIL, AddressTypeModel.COMPANY, AddressTypeModel.PERSON ].includes( $store.state.address.addressType );
		} );
		const showName = computed( () => {
			return props.isFullSelected || [ AddressTypeModel.EMAIL, AddressTypeModel.COMPANY, AddressTypeModel.PERSON ].includes( $store.state.address.addressType );
		} );

		onMounted( addressFunctions.initializeDataFromStore );

		return { ...addressFunctions,
			showName,
			showPostal,
			showEmail,
		};
	},
} );
</script>
