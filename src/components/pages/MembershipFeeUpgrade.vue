<template>
 	<h1>{{ $t('membership_fee_upgrade_page_headline') }}</h1>
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
			aria-describedby="cap-notice"
		>
			<template #info-message>
				<span id="cap-notice">{{ $t('membership_form_payment_amount_cap_notice') }}</span>
			</template>
		</AmountField>
	</FormSection>

	<button class="button">{{ $t('membership_fee_upgrade_submit_button') }}</button>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';
import { useI18n } from 'vue-i18n';
import { usePaymentFieldModel } from '@src/components/pages/membership_form/usePaymentFieldModel';
import { computed, watch } from 'vue';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import { FeeValidity } from '@src/view_models/MembershipFee';

interface Props {
	validateFeeUrl: string;
	paymentAmounts: number[];
	paymentIntervals: number[];
}
const props = defineProps<Props>();
const store = useStore();
const { t } = useI18n();

const fee = usePaymentFieldModel( store, 'fee', 'setFee', props.validateFeeUrl );
const interval = usePaymentFieldModel( store, 'interval', 'setInterval', props.validateFeeUrl );

const feeIsValid = computed( () => store.getters[ 'membership_fee/feeIsValid' ] );
const intervalIsValid = computed( () => store.getters[ 'membership_fee/intervalIsValid' ] );

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

const minimumAmount = computed(
	() => store.getters[ 'membership_fee/minimumAmount' ]( store.state.membership_address.addressType )
);

const feeErrorMessage = computed<string>( () => {
	const messages: { [ key: number ]: string } = {
		[ FeeValidity.FEE_VALID ]: '',
		[ FeeValidity.FEE_TOO_LOW ]: t( 'membership_form_payment_amount_error' ),
		[ FeeValidity.FEE_TOO_HIGH ]: t( 'membership_form_payment_amount_too_high' ),
	};
	return messages[ store.getters.feeValidity ].toString();
} );

watch( minimumAmount, async ( newMinimumAmount ) => {
	if ( fee.value < newMinimumAmount ) {
		fee.value = '';
	}
} );
</script>
