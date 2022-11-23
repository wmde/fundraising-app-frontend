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
						:salutations="salutations"
						v-on:field-changed="onFieldChange"/>
				<postal
						:show-error="fieldErrors"
						:form-data="formData"
						:countries="countries"
						:post-code-validation="addressValidationPatterns.postcode"
						v-on:field-changed="onFieldChange"/>
				<receipt-option
						:message="$t( 'receipt_needed_donation_page' )"
						:initial-receipt-needed="receiptNeeded"
						v-on:receipt-changed="setReceipt( $event )"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"
						:common-mail-providers="mailHostList" />
				<newsletter-option/>
			</AutofillHandler>
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
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
						:salutations="salutations"
						v-on:field-changed="onFieldChange"/>
				<postal
						:show-error="fieldErrors"
						:form-data="formData"
						:countries="countries"
						:post-code-validation="addressValidationPatterns.postcode"
						v-on:field-changed="onFieldChange"/>
				<receipt-option
						:message="$t( 'receipt_needed_donation_page' )"
						:initial-receipt-needed="receiptNeeded"
						v-on:receipt-changed="setReceipt( $event )"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"
						:common-mail-providers="mailHostList" />
				<newsletter-option/>
			</AutofillHandler>
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
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
						:salutations="salutations"
						v-on:field-changed="onFieldChange"/>
				<email
						:show-error="fieldErrors.email"
						:form-data="formData"
						v-on:field-changed="onFieldChange"
						:common-mail-providers="mailHostList" />
				<newsletter-option />
			</AutofillHandler>
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
		</form>

		<form
				id="laika-donation-personal-data-anonymous"
				action="/donation/add"
				method="post"
		>
			<submit-values :tracking-data="trackingData" :campaign-values="campaignValues"></submit-values>
		</form>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, onBeforeMount, PropType, toRefs } from 'vue';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOption from '@/components/shared/ReceiptOption.vue';
import Email from '@/components/shared/Email.vue';
import NewsletterOption from '@/components/pages/donation_form/NewsletterOption.vue';
import SubmitValues from '@/components/pages/donation_form/SubmitValues.vue';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { Country } from '@/view_models/Country';
import { AddressValidation } from '@/view_models/Validation';
import { useAddressFunctions } from './AddressFunctions';
import { Salutation } from '@/view_models/Salutation';
import { TrackingData } from '@/view_models/TrackingData';
import { useMailHostList } from '@/components/shared/useMailHostList';
import { CampaignValues } from '@/view_models/CampaignValues';
import { StoreKey } from '@/store/donation_store';
import { injectStrict } from '@/util/injectStrict';

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
		ReceiptOption,
		Email,
		NewsletterOption,
		AutofillHandler,
		SubmitValues,
	},
	props: {
		countries: Array as PropType<Array<Country>>,
		addressValidationPatterns: Object as PropType<AddressValidation>,
		addressType: Number,
		isFullSelected: Boolean,
		salutations: Array as () => Array<Salutation>,
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
	},
	setup( props: any ) {
		const { addressType, isFullSelected, addressValidationPatterns } = toRefs( props );
		const $store = injectStrict( StoreKey );
		const {
			formData,
			fieldErrors,
			receiptNeeded,

			initializeDataFromStore,
			onFieldChange,
			onAutofill,
			setReceipt,
		} = useAddressFunctions( { addressValidationPatterns: addressValidationPatterns.value }, $store );

		const addressTypeId = computed( () => {
			if ( isFullSelected.value && addressType.value === AddressTypeModel.UNSET ) {
				return AddressTypeIds.get( AddressTypeModel.PERSON );
			}
			return AddressTypeIds.has( addressType.value ) ? AddressTypeIds.get( addressType.value ) : '';
		} );
		const { mailHostList } = useMailHostList();

		onBeforeMount( initializeDataFromStore );

		return {
			formData,
			fieldErrors,
			receiptNeeded,
			AddressTypeModel,
			addressTypeId,
			mailHostList,

			onFieldChange,
			onAutofill,
			setReceipt,
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
