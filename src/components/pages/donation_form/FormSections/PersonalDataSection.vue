<template>
	<ContentCard aria-live="assertive" aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2 id="donation-form-subheading">{{ $t( 'donation_form_address_subheading' ) }}</h2>
			<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>
		</template>
		<template #content>
			<form id="address-type-selection" @submit="evt => evt.preventDefault()">
				<ScrollTarget target-id="address-type-scroll-target"/>
				<AddressTypeBasic
					@address-type="$emit( 'set-address-type', $event )"
					:disabledAddressTypes="disabledAddressTypes"
					:is-direct-debit="isDirectDebitPayment"
					:initial-address-type="addressType"
					:address-type-is-invalid="addressTypeIsInvalid"
				/>
			</form>

			<AddressForms
				:countries="countries"
				:salutations="salutations"
				:address-validation-patterns="addressValidationPatterns"
				:address-type="addressType"
				:tracking-data="trackingData"
				:campaign-values="campaignValues">
			</AddressForms>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import AddressTypeBasic from '@src/components/pages/donation_form/AddressTypeBasic.vue';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import type { AddressValidation } from '@src/view_models/Validation';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
	isDirectDebitPayment: boolean;
	disabledAddressTypes: AddressTypeModel[];
	addressType: AddressTypeModel;
	addressTypeIsInvalid: boolean;
}

defineProps<Props>();
defineEmits( [ 'set-address-type' ] );

</script>
