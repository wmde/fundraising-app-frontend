<template>
	<div :class="`address-section address-type-${ addressTypeId }`">
		<form
			name="laika-donation-personal-data-person"
			id="laika-donation-personal-data-person"
			action="/donation/add"
			method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<NameFields
					:show-error="fieldErrors"
					:form-data="formData"
					:address-type="AddressTypeModel.PERSON"
					:salutations="salutations"
					field-id-namespace="person"
					v-on:field-changed="onFieldChange"
				/>
				<PostalAddressFields
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					:country-was-restored="countryWasRestored"
					field-id-namespace="person"
					v-on:field-changed="onFieldChange"
				/>
				<div class="form-field form-field-donation-receipt">
					<CheckboxSingleFormInput
						input-id="receipt-option-person"
						name="receipt-option"
						v-model="receiptNeeded"
					>
						{{ $t( 'receipt_needed_donation_page' ) }}
					</CheckboxSingleFormInput>
				</div>

				<ScrollTarget target-id="person-email-scroll-target"/>
				<EmailField
					:show-error="fieldErrors.email"
					v-model="formData.email.value"
					input-id="person-email"
					@field-changed="onFieldChange"
				>
					<template #message>
						<ValueEqualsPlaceholderWarning
							:value="formData.email.value"
							:placeholder="$t( 'donation_form_email_placeholder' )"
							warning="donation_form_email_placeholder_warning"
						/>
					</template>
				</EmailField>
				<MailingListField v-model="mailingList" input-id="person-newsletter"/>
			</AutofillHandler>
		</form>

		<form
			name="laika-donation-personal-data-company"
			id="laika-donation-personal-data-company"
			action="/donation/add"
			method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<NameFields
					:show-error="fieldErrors"
					:form-data="formData"
					:address-type="AddressTypeModel.COMPANY"
					:salutations="salutations"
					field-id-namespace="company"
					v-on:field-changed="onFieldChange"
				/>
				<PostalAddressFields
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					:country-was-restored="countryWasRestored"
					field-id-namespace="company"
					v-on:field-changed="onFieldChange"
				/>
				<div class="form-field form-field-donation-receipt">
					<CheckboxSingleFormInput
						input-id="receipt-option-company"
						name="receipt-option"
						v-model="receiptNeeded">
						{{ $t( 'receipt_needed_donation_page' ) }}
					</CheckboxSingleFormInput>
				</div>

				<ScrollTarget target-id="company-email-scroll-target"/>
				<EmailField
					:show-error="fieldErrors.email"
					v-model="formData.email.value"
					input-id="company-email"
					@field-changed="onFieldChange"
				>
					<template #message>
						<ValueEqualsPlaceholderWarning
							:value="formData.email.value"
							:placeholder="$t( 'donation_form_email_placeholder' )"
							warning="donation_form_email_placeholder_warning"
						/>
					</template>
				</EmailField>
				<MailingListField v-model="mailingList" input-id="company-newsletter"/>
			</AutofillHandler>
		</form>

		<form
			name="laika-donation-personal-data-email"
			id="laika-donation-personal-data-email"
			action="/donation/add"
			method="post"
		>
			<AutofillHandler @autofill="onAutofill">
				<NameFields
					:show-error="fieldErrors"
					:form-data="formData"
					:address-type="AddressTypeModel.PERSON"
					:salutations="salutations"
					field-id-namespace="email"
					v-on:field-changed="onFieldChange"
				/>

				<ScrollTarget target-id="email-email-scroll-target"/>
				<EmailField
					:show-error="fieldErrors.email"
					v-model="formData.email.value"
					input-id="email-email"
					@field-changed="onFieldChange"
				>
					<template #message>
						<ValueEqualsPlaceholderWarning
							:value="formData.email.value"
							:placeholder="$t( 'donation_form_email_placeholder' )"
							warning="donation_form_email_placeholder_warning"
						/>
					</template>
				</EmailField>
				<MailingListField v-model="mailingList" input-id="email-newsletter"/>
			</AutofillHandler>
		</form>

	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs } from 'vue';
import PostalAddressFields from '@src/components/pages/donation_form/PostalAddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/shared/NameFields.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { useAddressFunctions } from './AddressFunctions';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { CampaignValues } from '@src/view_models/CampaignValues';
import { AddressTypeIds } from '@src/components/pages/donation_form/AddressTypeIds';
import { Validity } from '@src/view_models/Validity';
import ValueEqualsPlaceholderWarning from '@src/components/shared/ValueEqualsPlaceholderWarning.vue';
import { useMailingListModel } from '@src/components/shared/form_fields/useMailingListModel';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { useStore } from 'vuex';
import { useReceiptModel } from '@src/components/shared/composables/useReceiptModel';

interface Props {
	countries: Country[],
	addressValidationPatterns: AddressValidation,
	addressType: AddressTypeModel,
	salutations: Salutation[],
	trackingData: TrackingData,
	campaignValues: CampaignValues,
}

const props = withDefaults( defineProps<Props>(), {
	addressType: AddressTypeModel.PERSON,
} );

const { addressType, addressValidationPatterns } = toRefs( props );
const store = useStore();
const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: addressValidationPatterns.value }, store );

const mailingList = useMailingListModel( store );

const { receiptNeeded } = useReceiptModel( store );

const addressTypeId = computed( () => {
	if ( addressType.value === AddressTypeModel.UNSET ) {
		return AddressTypeIds.get( AddressTypeModel.PERSON );
	}
	return AddressTypeIds.has( addressType.value ) ? AddressTypeIds.get( addressType.value ) : '';
} );

const countryWasRestored = ref<boolean>( false );

onBeforeMount( () => {
	countryWasRestored.value = store.state.address.validity.country === Validity.RESTORED;
	initializeDataFromStore();
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
