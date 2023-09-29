<template>
	<div class="payment-section">

		<FormSection :title="$t('membership_form_payment_interval_title')" title-margin="x-small">
			<RadioField
				name="interval"
				v-model="interval"
				:options="paymentIntervalsAsOptions"
				:required="true"
				:disabled="[]"
				alignment="column"
			/>
		</FormSection>

		<FormSection :title="getAmountTitle" title-margin="small">
			<span>{{ $t('membership_form_payment_amount_description') }}</span>
			<AmountField
				v-model="fee"
				:payment-amounts="paymentAmounts"
				:error-message="$t('membership_form_payment_amount_error')"
				:show-error="!feeIsValid"
				:minimum-amount="minimumAmount"
			/>
			<div>{{ $t('membership_form_payment_amount_cap_notice') }}</div>
		</FormSection>

		<FormSection v-if="paymentTypes.length > 1"  :title="$t('donation_form_payment_type_title')" title-margin="x-small">
			<RadioField
				name="paymentType"
				v-model="paymentType"
				:options="paymentTypesAsOptions"
				:required="true"
				:disabled="[]"
				alignment="column"
				:show-error="!paymentTypeIsValid"
				:error-message="$t('membership_form_payment_type_error')"
			/>
		</FormSection>

		<payment-bank-data
			v-if="paymentType === 'BEZ'"
			class="has-margin-top-36"
			:validateBankDataUrl="validateBankDataUrl.toString()"
			:validateLegacyBankDataUrl="validateLegacyBankDataUrl.toString()"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { setFee, setInterval, setType } from '@src/store/membership_fee/actionTypes';
import { useI18n } from 'vue-i18n';
import { usePaymentFieldModel } from '@src/components/pages/membership_form/usePaymentFieldModel';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import { FormOption } from '@src/components/shared/form_fields/FormOption';
import { NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';

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

const fee = usePaymentFieldModel( store, 'fee', setFee, props.validateFeeUrl );
const interval = usePaymentFieldModel( store, 'interval', setInterval, props.validateFeeUrl );
const paymentType = usePaymentFieldModel( store, 'paymentType', setType, props.validateFeeUrl );

const paymentTypeIsValid = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/typeIsValid' ] );
const feeIsValid = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/feeIsValid' ] );

//TODO minimumamount needs to be a reactive number value
const minimumAmount = computed( () => store.getters[ NS_MEMBERSHIP_FEE + '/minimumAmount' ] );

const getAmountTitle = computed( () => {
	if ( interval.value === '' ) {
		return t( 'membership_form_payment_amount_title' );
	}
	return t( `membership_form_payment_amount_title_interval_${interval.value}` );
} );

const paymentIntervalsAsOptions = computed<FormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ) }
		) );
} );

const paymentTypesAsOptions = computed<FormOption[]>( () => {
	return props.paymentTypes.map(
		( paymentTypeValue: string ) => (
			{ value: paymentTypeValue, label: t( paymentTypeValue ) }
		) );
} );

</script>
