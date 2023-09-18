<template>
	<div class="payment-section">
		<AmountSelection
			:payment-amounts="paymentAmounts"
			:amount="amount"
			:title="$t('donation_form_payment_amount_title')"
			:error="showAmountErrorMessage"
			v-on:amount-selected="sendAmountToStore"
		/>
		<PaymentInterval
			class="has-margin-top-36"
			:payment-intervals="paymentIntervals"
			:current-interval="interval"
			:title="$t('donation_form_payment_interval_title')"
			:disabled-payment-intervals="disabledPaymentIntervals"
			v-on:interval-selected="sendIntervalToStore"
		/>
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
import { computed } from 'vue';
import AmountSelection from '@src/components/shared/AmountSelection.vue';
import PaymentInterval from '@src/components/shared/PaymentInterval.vue';
import PaymentType from '@src/components/pages/donation_form/PaymentType.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { setAmount, setInterval, setType } from '@src/store/payment/actionTypes';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';
import { useI18n } from 'vue-i18n';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

defineProps<Props>();

const store = useStore();
const { t } = useI18n();

const amount = computed<number>( () => store.state[ NS_PAYMENT ].values.amount );
const interval = computed<string>( () => store.state[ NS_PAYMENT ].values.interval );
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
const disabledPaymentIntervals = computed<string[]>( () => {
	let disabledIntervals : string[] = [];
	if ( store.state[ NS_PAYMENT ].values.type === 'SUB' ) {
		disabledIntervals = ( this as any ).$props.paymentIntervals
			.filter( ( x: number ) => Number( x ) > 0 )
			.map( ( x: number ) => String( x ) );
	}
	return disabledIntervals;
} );
const showAmountErrorMessage = computed<String>( () => {
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
</script>
