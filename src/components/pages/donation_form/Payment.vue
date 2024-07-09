<template>
	<div class="payment-form">
		<FormSection id="payment-form-amount">
			<ScrollTarget target-id="payment-form-amount-scroll-target"/>
			<AmountField
				v-model="amount"
				:label="$t('donation_form_payment_amount_title')"
				:payment-amounts="paymentAmounts"
				:error-message="amountErrorMessage"
				:show-error="amountErrorMessage !== ''"
			/>
		</FormSection>

		<FormSection>
			<RadioField
				name="interval"
				input-id="interval"
				v-model="interval"
				:label="$t('donation_form_payment_interval_title')"
				:options="paymentIntervalsAsOptions"
				:required="true"
				:disabled="disabledPaymentIntervals"
				alignment="column"
			/>
		</FormSection>

		<FormSection id="payment-form-type">
			<ScrollTarget target-id="payment-form-type-scroll-target"/>
			<RadioField
				name="paymentType"
				input-id="paymentType"
				v-model="paymentType"
				:label="$t('donation_form_payment_type_title')"
				:options="paymentTypesAsOptions"
				:required="true"
				:disabled="disabledPaymentTypes"
				alignment="column"
				:show-error="!paymentTypeIsValid"
				:error-message="$t('donation_form_payment_type_error')"
			>
				<template #message-BEZ>
					<div v-if="disabledPaymentTypes.includes( 'BEZ' )" class="option-info-message">
						{{ $t( 'donation_form_address_choice_direct_debit_disclaimer' ) }}
					</div>
				</template>
				<template #message-SUB>
					<div v-if="disabledPaymentTypes.includes( 'SUB' )" class="option-info-message">
						{{ $t( 'donation_form_SUB_payment_type_info' ) }}
					</div>
				</template>
			</RadioField>
		</FormSection>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NS_ADDRESS } from '@src/store/namespaces';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';
import { useI18n } from 'vue-i18n';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import { usePaymentFieldModel } from '@src/components/pages/donation_form/usePaymentFieldModel';
import { Validity } from '@src/view_models/Validity';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

const props = defineProps<Props>();

const store = useStore();
const { t } = useI18n();

const amount = usePaymentFieldModel( store, 'amount', 'setAmount' );
const interval = usePaymentFieldModel( store, 'interval', 'setInterval' );
const paymentType = usePaymentFieldModel( store, 'type', 'setType' );
const paymentTypeIsValid = computed<boolean>( () => store.state.payment.validity.type !== Validity.INVALID );

const paymentIntervalsAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number, index: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ), id: `interval-${ index }` }
		) );
} );

const paymentTypesAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentTypes.map(
		( paymentTypeValue: string, index: number ) => ( { value: paymentTypeValue, label: t( paymentTypeValue ), id: `paymentType-${ index }` } )
	);
} );

const disabledPaymentTypes = computed<string[]>( () => {
	let disabledTypes: string[] = [];
	if ( store.state[ NS_ADDRESS ].addressType === AddressTypeModel.ANON ) {
		disabledTypes.push( 'BEZ' );
	}
	if ( store.state.payment.values.interval !== '0' ) {
		disabledTypes.push( 'SUB' );
	}
	return disabledTypes;
} );

const disabledPaymentIntervals = computed<string[]>( () => {
	let disabledIntervals: string[] = [];
	if ( store.state.payment.values.type === 'SUB' ) {
		disabledIntervals = props.paymentIntervals
			.filter( ( x: number ) => Number( x ) > 0 )
			.map( ( x: number ) => String( x ) );
	}
	return disabledIntervals;
} );

const amountErrorMessage = computed<String>( () => {
	const messages: { [ key: number ]: string; } = {
		[ AmountValidity.AMOUNT_VALID ]: '',
		[ AmountValidity.AMOUNT_TOO_LOW ]: t( 'donation_form_payment_amount_error' ),
		[ AmountValidity.AMOUNT_TOO_HIGH ]: t( 'donation_form_payment_amount_too_high' ),
	};
	return messages[ store.getters[ 'payment/amountValidity' ] ];
} );

</script>
