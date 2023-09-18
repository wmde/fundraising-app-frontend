<template>
	<div class="payment-section">
		<AmountField
			v-model="amount"
			:title="$t('donation_form_payment_amount_title')"
			:payment-amounts="paymentAmounts"
			:error-message="amountErrorMessage"
			:show-error="amountErrorMessage !== ''"
		/>

    <div class="title is-size-5">{{ $t('donation_form_payment_interval_title') }}</div>
		<RadioField
			name="interval"
			v-model="interval"
			:options="paymentIntervalsAsOptions"
			:required="true"
			:disabled="disabledPaymentIntervals"
			alignment="column"
			:label="$t('donation_form_payment_interval_title')">
		</RadioField>

		<PaymentType
			class="has-margin-top-36"
			:current-type="paymentType"
			:payment-types="paymentTypes"
			:error="paymentTypeIsValid ? '' : $t('donation_form_payment_type_error')"
			:title="$t('donation_form_payment_type_title')"
			:disabled-payment-types="disabledPaymentTypes"
			v-on:payment-type-selected="sendTypeToStore"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import PaymentType from '@src/components/pages/donation_form/PaymentType.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { setAmount, setInterval, setType } from '@src/store/payment/actionTypes';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';
import { useI18n } from 'vue-i18n';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { FormOption } from '@src/components/shared/form_fields/FormOption';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

const props = defineProps<Props>();

const store = useStore();
const { t } = useI18n();

const amountFromStore = computed<string>( () => store.state[ NS_PAYMENT ].values.amount );
const amount = ref<string>( amountFromStore.value );

const intervalFromStore = computed<string>( () => store.state[ NS_PAYMENT ].values.interval );
const interval = ref<string>( intervalFromStore.value );

const paymentType = computed<string>( () => store.state[ NS_PAYMENT ].values.type );
const paymentTypeIsValid = computed<boolean>( () => store.state[ NS_PAYMENT ].validity.type );
const disabledPaymentTypes = computed<string[]>( () => {
	let disabledTypes : string[] = [];
	if ( store.state[ NS_ADDRESS ].addressType === AddressTypeModel.ANON ) {
		disabledTypes.push( 'BEZ' );
	}
	if ( store.state[ NS_PAYMENT ].values.interval !== '0' ) {
		disabledTypes.push( 'SUB' );
	}
	return disabledTypes;
} );

const paymentIntervalsAsOptions = computed<FormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ) }
		) );
} );
const disabledPaymentIntervals = computed<string[]>( () => {
	let disabledIntervals : string[] = [];
	if ( store.state[ NS_PAYMENT ].values.type === 'SUB' ) {
		disabledIntervals = props.paymentIntervals
			.filter( ( x: number ) => Number( x ) > 0 )
			.map( ( x: number ) => String( x ) );
	}
	return disabledIntervals;
} );
const amountErrorMessage = computed<String>( () => {
	const messages : { [ key:number ]:string; } = {
		[ AmountValidity.AMOUNT_VALID ]: '',
		[ AmountValidity.AMOUNT_TOO_LOW ]: t( 'donation_form_payment_amount_error' ),
		[ AmountValidity.AMOUNT_TOO_HIGH ]: t( 'donation_form_payment_amount_too_high' ),
	};
	return messages[ store.getters[ NS_PAYMENT + '/amountValidity' ] ];
} );

const sendAmountToStore = ( newAmount: string ): void => {
	store.dispatch( action( NS_PAYMENT, setAmount ), newAmount );
};
const sendIntervalToStore = ( newInterval: string ): void => {
	store.dispatch( action( NS_PAYMENT, setInterval ), newInterval );
};
const sendTypeToStore = ( newPaymentType: string ): void => {
	store.dispatch( action( NS_PAYMENT, setType ), newPaymentType );
};

watch( amount, sendAmountToStore );
watch( amountFromStore, ( newValue ) => {
	amount.value = newValue;
} );

watch( interval, sendIntervalToStore );
watch( intervalFromStore, ( newValue ) => {
	interval.value = newValue;
} );
</script>
