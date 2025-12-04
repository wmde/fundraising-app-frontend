<template>
	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2 id="donation-form-subheading">2. {{ $t( 'compact_donation_form_name_heading' ) }}</h2>
		</template>

		<template #content>

			<p id="donation-form-tagline">{{ $t( 'compact_donation_form_name_blurb' ) }}</p>

			<form class="compact" id="donation-form" action="/donation/add" method="post" @submit.prevent>
				<AutofillHandler @autofill="onAutofill">

					<NameFields
						:show-error="fieldErrors"
						:form-data="formData"
						:salutations="salutations"
						@field-changed="onFieldChange"
					/>

					<EmailField
						:show-error="fieldErrors.email"
						v-model="formData.email.value"
						@field-changed="onFieldChange"
					/>
					<MailingListField v-model="mailingList" input-id="newsletter"/>

				</AutofillHandler>
			</form>
		</template>
	</ContentCard>

	<ContentCard aria-labelledby="donation-form-subheading donation-form-tagline">
		<template #heading>
			<h2>3. {{ $t( 'compact_donation_form_other_info_heading' ) }}</h2>
		</template>

		<template #content>

			<form class="flow compact" @submit.prevent>

				<div class="repel">
					<p>{{  $t( 'compact_donation_form_other_info_blurb' ) }}</p>
					<CheckboxToggle
						v-model="receiptModel"
						name="donation-receipt"
						input-id="donation-receipt"
					>
						{{ $t( 'donation_confirmation_cta_title_alt' ) }}
					</CheckboxToggle>
				</div>

				<AddressFields
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					:receipt-needed="receiptNeeded"
					:address-type="addressType"
					v-model:is-company="isCompany"
					@field-changed="onAddressFieldChange"
					@clear-address="removeErrorsFromEmptyAddress"
				/>
			</form>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import AddressFields from '@src/components/pages/donation_form/Compact/AddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/pages/donation_form/Compact/NameFields.vue';
import type { AddressValidation } from '@src/view_models/Validation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import { useAddressFunctions } from '@src/components/pages/donation_form/AddressFunctions';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import CheckboxToggle from '@src/components/shared/form_elements/CheckboxToggle.vue';
import { useAddressTypeUpdater } from '@src/components/pages/donation_form/Compact/useAddressTypeUpdater';
import { action } from '@src/store/util';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import { Validity } from '@src/view_models/Validity';

interface Props {
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
	isDirectDebitPayment: boolean;
	disabledAddressTypes: AddressTypeModel[];
	addressType: AddressTypeModel;
	receiptNeeded: boolean;
	addressTypeIsInvalid: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'receipt-needed-toggled' ] );
const store = useStore();

const mailingList = useMailingListModel( store );
const receiptModel = ref<boolean>( props.receiptNeeded );
const isCompany = ref<boolean>( props.addressType === AddressTypeModel.COMPANY_WITH_CONTACT );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

const { updateAddressType } = useAddressTypeUpdater(
	computed<boolean>( () => props.receiptNeeded ),
	isCompany,
	computed<AddressTypeModel>( () => props.addressType ),
	formData,
	store
);

const removeErrorsFromEmptyAddress = (): void => {
	if ( formData.companyName.value === '' ) {
		store.dispatch( action( 'address', 'setFieldValidity' ), { field: formData.companyName, validity: Validity.INCOMPLETE } );
	}

	if ( clearStreetAndBuildingNumberSeparator( formData.street.value ) === '' ) {
		store.dispatch( action( 'address', 'setFieldValidity' ), { field: formData.street, validity: Validity.INCOMPLETE } );
	}

	if ( formData.postcode.value === '' ) {
		store.dispatch( action( 'address', 'setFieldValidity' ), { field: formData.postcode, validity: Validity.INCOMPLETE } );
	}

	if ( formData.city.value === '' ) {
		store.dispatch( action( 'address', 'setFieldValidity' ), { field: formData.city, validity: Validity.INCOMPLETE } );
	}
};

const onAddressFieldChange = async ( fieldName: string ): Promise<void> => {
	await updateAddressType();

	if ( props.addressType === AddressTypeModel.EMAIL ) {
		// if its email and there's an invalid field check all fields are empty and remove validation
		if ( fieldErrors.value[ fieldName ] ) {
			removeErrorsFromEmptyAddress();
		}

		// If the address type is email then address is optional and we don't want to live validate it,
		// for now just set the value and the validation will run on submit
		store.dispatch( action( 'address', 'setAddressField' ), formData[ fieldName ] );
	} else {
		// If it's not email validate as usual?
		onFieldChange( fieldName );
	}
};

onBeforeMount( initializeDataFromStore );
watch( isCompany, updateAddressType );
watch( receiptModel, () => emit( 'receipt-needed-toggled', receiptModel.value ) );

</script>
