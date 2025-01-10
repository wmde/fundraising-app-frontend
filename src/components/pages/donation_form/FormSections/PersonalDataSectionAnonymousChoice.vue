<template>
	<div
		id="donation-page-form-section-personal-data"
		class="donation-page-form-section"
		aria-live="assertive"
		aria-labelledby="donation-form-subheading donation-form-tagline"
	>
		<h2 id="donation-form-subheading" class="form-subtitle">{{ $t( 'donation_form_address_subheading' ) }}</h2>
		<p id="donation-form-tagline">{{ $t( 'donation_form_section_address_tagline' ) }}</p>

		<form id="address-type-option" @submit="evt => evt.preventDefault()">
			<ScrollTarget target-id="address-opt-out-scroll-target"/>
			<RadioField
				v-model="addressOptOut.addressOptIn"
				name="address-opt-out"
				:options="[
						{ value: true, label: $t( 'yes' ), id: 'addressOptOut-0' },
						{ value: false, label: $t( 'no' ), id: 'addressOptOut-1' },
					]"
				:label="$t( 'donation_form_section_address_opt_out' )"
				:disabled="isDirectDebitPayment ? [ false ] : []"
				alignment="row"
				aria-describedby="donation-address-opt-out-help-text"
			>
				<template #intro-message>
				</template>
				<template #tooltip-false>
					<RadioFieldHelpText v-if="isDirectDebitPayment">
						{{ $t( 'donation_form_address_choice_direct_debit_disclaimer' ) }}
					</RadioFieldHelpText>
				</template>
			</RadioField>
		</form>

		<form id="address-type-selection" @submit="evt => evt.preventDefault()" v-if="addressOptOut.addressOptIn === true" >
			<ScrollTarget target-id="address-type-scroll-target"/>
			<AddressTypeNoAnon
				@address-type="$emit( 'set-address-type', $event )"
				:disabledAddressTypes="[]"
				:is-direct-debit="isDirectDebitPayment"
				:initial-address-type="addressType"
				:address-type-is-invalid="addressTypeIsInvalid"
			/>
		</form>

		<AddressForms
			v-if="addressOptOut.addressOptIn === true"
			:countries="countries"
			:salutations="salutations"
			:address-validation-patterns="addressValidationPatterns"
			:address-type="addressType"
			:tracking-data="trackingData"
			:campaign-values="campaignValues">
		</AddressForms>
	</div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import AddressTypeNoAnon from '@src/components/pages/donation_form/AddressTypeNoAnon.vue';
import AddressForms from '@src/components/pages/donation_form/AddressForms.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { AddressValidation } from '@src/view_models/Validation';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressOptOutModel } from '@src/components/pages/donation_form/AddressOptOut/useAddressOptOut';
import RadioFieldHelpText from '@src/components/shared/form_elements/RadioFieldTooltip.vue';

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
	addressOptOut: AddressOptOutModel;
}

const props = defineProps<Props>();
defineEmits( [ 'set-address-type' ] );

const addressOptOut = toRef( props.addressOptOut );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.address-type-anonymous-disclaimer {
	margin-top: map.get( units.$spacing, 'medium' );
}
</style>
