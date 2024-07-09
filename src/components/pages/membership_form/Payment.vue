<template>
	<div class="payment-section">

		<FormSection>
			<ScrollTarget target-id="payment-form-interval-scroll-target"/>
			<RadioField
				name="interval"
				:label="$t('membership_form_payment_interval_title')"
				v-model="interval"
				:options="paymentIntervalsAsOptions"
				:required="true"
				:disabled="[]"
				:show-error="!intervalIsValid"
				:error-message="$t('membership_form_interval_error')"
				alignment="column"
			/>
		</FormSection>

		<FormSection>
			<AmountField
				v-model="fee"
				:label="getAmountTitle"
				:payment-amounts="paymentAmounts"
				:error-message="feeErrorMessage"
				:show-error="!feeIsValid"
				:minimum-amount="minimumAmount"
				:minimum-amount-message="$t('membership_form_payment_amount_description')"
				:aria-describedby="'cap-notice'"
			>
				<template #info-message>
					<span id="cap-notice">{{ $t('membership_form_payment_amount_cap_notice') }}</span>
				</template>
			</AmountField>
		</FormSection>

		<FormSection v-if="paymentTypes.length > 1">
			<RadioField
				name="paymentType"
				:label="$t('donation_form_payment_type_title')"
				v-model="paymentType"
				:options="paymentTypesAsOptions"
				:required="true"
				:disabled="[]"
				alignment="column"
				:show-error="!paymentTypeIsValid"
				:error-message="$t('membership_form_payment_type_error')"
			/>
		</FormSection>

		<PaymentBankData
			v-if="paymentType === 'BEZ'"
			:validateBankDataUrl="validateBankDataUrl.toString()"
			:validateLegacyBankDataUrl="validateLegacyBankDataUrl.toString()"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { usePaymentFieldModel } from '@src/components/pages/membership_form/usePaymentFieldModel';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import { FeeValidity } from '@src/view_models/MembershipFee';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

interface Props {
	validateFeeUrl: string,
	paymentAmounts: number[],
	paymentIntervals: number[];
	paymentTypes: string[],
	validateBankDataUrl: string,
	validateLegacyBankDataUrl: string,
}

const props = defineProps<Props>();
const store = useStore();
const { t } = useI18n();

const fee = usePaymentFieldModel( store, 'fee', 'setFee', props.validateFeeUrl );
const interval = usePaymentFieldModel( store, 'interval', 'setInterval', props.validateFeeUrl );
const paymentType = usePaymentFieldModel( store, 'type', 'setType', props.validateFeeUrl );

const paymentTypeIsValid = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/typeIsValid' ] );
const feeIsValid = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/feeIsValid' ] );
const intervalIsValid = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/intervalIsValid' ] );

const minimumAmount = computed(
	() => store.getters[ NS_MEMBERSHIP_FEE + '/minimumAmount' ]( store.state[ NS_MEMBERSHIP_ADDRESS ].addressType )
);
const getAmountTitle = computed( () => {
	if ( interval.value === '' ) {
		return t( 'membership_form_payment_amount_title' );
	}
	return t( `membership_form_payment_amount_title_interval_${interval.value}` );
} );

const paymentIntervalsAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number, index: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ), id: `interval-${ index }` }
		) );
} );

const paymentTypesAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentTypes.map(
		( paymentTypeValue: string, index: number ) => (
			{ value: paymentTypeValue, label: t( paymentTypeValue ), id: `paymentType-${ index }` }
		) );
} );

watch( minimumAmount, async ( newMinimumAmount ) => {
	if ( fee.value < newMinimumAmount ) {
		fee.value = '';
	}
} );

const feeErrorMessage = computed<string>( () => {
	const messages: { [ key: number ]: string; } = {
		[ FeeValidity.FEE_VALID ]: '',
		[ FeeValidity.FEE_TOO_LOW ]: t( 'membership_form_payment_amount_error' ),
		[ FeeValidity.FEE_TOO_HIGH ]: t( 'membership_form_payment_amount_too_high' ),
	};
	return messages[ store.getters.feeValidity ].toString();
} );

</script>
