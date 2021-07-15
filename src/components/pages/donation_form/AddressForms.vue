<template>
	<div :class="`address-section address-type-${ addressTypeId }`">
		<form
				name="laika-donation-personal-data-person"
        id="laika-donation-personal-data-person"
        action="/donation/add"
        method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<name
						:show-error="fieldErrors"
						:form-data="formData"
						:address-type="AddressTypeModel.PERSON"
						v-on:field-changed="onFieldChange"/>
				<postal
						:show-error="fieldErrors"
						:form-data="formData"
						:countries="countries"
						:post-code-validation="addressValidationPatterns.postcode"
						v-on:field-changed="onFieldChange"/>
				<receipt-opt-out
						:message="$t( 'receipt_needed_donation_page' )"
						:initial-receipt-needed="receiptNeeded"
						v-on:opted-out="setReceiptOptedOut( $event )"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"/>
				<newsletter-opt-in/>
			</AutofillHandler>
			<submit-values :tracking-data="{}"></submit-values>
		</form>

		<form
				name="laika-donation-personal-data-company"
				id="laika-donation-personal-data-company"
				action="/donation/add"
				method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<name
						:show-error="fieldErrors"
						:form-data="formData"
						:address-type="AddressTypeModel.COMPANY"
						v-on:field-changed="onFieldChange"/>
				<postal
						:show-error="fieldErrors"
						:form-data="formData"
						:countries="countries"
						:post-code-validation="addressValidationPatterns.postcode"
						v-on:field-changed="onFieldChange"/>
				<receipt-opt-out
						:message="$t( 'receipt_needed_donation_page' )"
						:initial-receipt-needed="receiptNeeded"
						v-on:opted-out="setReceiptOptedOut( $event )"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"/>
				<newsletter-opt-in/>
			</AutofillHandler>
			<submit-values :tracking-data="{}"></submit-values>
		</form>

		<form
				name="laika-donation-personal-data-email"
				id="laika-donation-personal-data-email"
				action="/donation/add"
				method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<name
						:show-error="fieldErrors"
						:form-data="formData"
						:address-type="AddressTypeModel.PERSON"
						v-on:field-changed="onFieldChange"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"/>
				<newsletter-opt-in />
			</AutofillHandler>
			<submit-values :tracking-data="{}"></submit-values>
		</form>

		<form
				id="laika-donation-personal-data-anonymous"
				action="/donation/add"
				method="post"
		>
			<submit-values :tracking-data="{}"></submit-values>
		</form>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, onMounted, PropType, toRefs } from '@vue/composition-api';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOptOut from '@/components/shared/ReceiptOptOut.vue';
import Email from '@/components/shared/Email.vue';
import NewsletterOptIn from '@/components/pages/donation_form/NewsletterOptIn.vue';
import SubmitValues from '@/components/pages/donation_form/SubmitValues.vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { Country } from '@/view_models/Country';
import { AddressValidation } from '@/view_models/Validation';
import { useAddressFunctions } from './AddressFunctions';

export const AddressTypeIds = new Map<number, string>( [
	[ AddressTypeModel.ANON, 'anonymous' ],
	[ AddressTypeModel.EMAIL, 'email' ],
	[ AddressTypeModel.PERSON, 'person' ],
	[ AddressTypeModel.COMPANY, 'company' ],
	[ AddressTypeModel.UNSET, 'unset' ],
] );

export default Vue.extend( {
	name: 'Address',
	components: {
		Name,
		Postal,
		ReceiptOptOut,
		Email,
		NewsletterOptIn,
		AutofillHandler,
		SubmitValues,
	},
	props: {
		countries: Array as PropType<Array<Country>>,
		addressValidationPatterns: Object as PropType<AddressValidation>,
		addressType: Number,
		isFullSelected: Boolean,
	},
	setup( props: any, { root: { $store } } ) {
		const { addressType, isFullSelected, addressValidationPatterns } = toRefs( props );
		const {
			formData,
			fieldErrors,
			receiptNeeded,

			initializeDataFromStore,
			onFieldChange,
			onAutofill,
			setReceiptOptedOut,
		} = useAddressFunctions( { addressValidationPatterns: addressValidationPatterns.value }, $store );

		const addressTypeId = computed( () => {
			if ( isFullSelected.value && addressType.value === AddressTypeModel.UNSET ) {
				return AddressTypeIds.get( AddressTypeModel.PERSON );
			}
			return AddressTypeIds.has( addressType.value ) ? AddressTypeIds.get( addressType.value ) : '';
		} );

		onMounted( initializeDataFromStore );

		return {
			formData,
			fieldErrors,
			receiptNeeded,
			AddressTypeModel,
			addressTypeId,

			onFieldChange,
			onAutofill,
			setReceiptOptedOut,
		};
	},
} );
</script>

<style lang="scss">
	.address-section {
		form {
			display: none;
		}
	}
	.address-type-person {
		#laika-donation-personal-data-person {
			display: block;
		}
	}
	.address-type-company {
		#laika-donation-personal-data-company {
			display: block;
		}
	}
	.address-type-email {
		#laika-donation-personal-data-email {
			display: block;
		}
	}
</style>
