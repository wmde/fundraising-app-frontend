<template>
	<ContentCard>
		<template #heading>
			<h2>{{ startIndex }}. {{ $t( 'compact_donation_form_name_heading' ) }}</h2>
		</template>

		<template #content>

			<p>{{ $t( 'compact_donation_form_name_blurb' ) }}</p>

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

	<ContentCard>
		<template #heading>
			<h2>{{ startIndex + 1 }}. {{ $t( 'compact_donation_form_other_info_heading' ) }}</h2>
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
					v-if="receiptModel"
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
					@field-changed="onFieldChange"
				/>
			</form>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import AddressFields from '@src/components/pages/donation_form/PersonalData/AddressFields.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';
import NameFields from '@src/components/pages/donation_form/PersonalData/NameFields.vue';
import type { AddressValidation } from '@src/view_models/Validation';
import type { CampaignValues } from '@src/view_models/CampaignValues';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import type { TrackingData } from '@src/view_models/TrackingData';
import { useAddressFunctions } from '@src/components/pages/donation_form/composables/useAddressFunctions';
import { useMailingListModel } from '@src/components/shared/composables/useMailingListModel';
import { useStore } from 'vuex';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import CheckboxToggle from '@src/components/shared/form_elements/CheckboxToggle.vue';
import { useReceiptModel } from '@src/components/shared/composables/useReceiptModel';

interface Props {
	startIndex: number;
	countries: Country[];
	salutations: Salutation[];
	trackingData: TrackingData;
	campaignValues: CampaignValues;
	addressValidationPatterns: AddressValidation;
	isDirectDebitPayment: boolean;
}

const props = defineProps<Props>();
const store = useStore();

const mailingList = useMailingListModel( store );
const receiptModel = useReceiptModel( store );

const {
	formData,
	fieldErrors,
	initializeDataFromStore,
	onFieldChange,
	onAutofill,
} = useAddressFunctions( { addressValidationPatterns: props.addressValidationPatterns }, store );

onBeforeMount( initializeDataFromStore );

</script>
