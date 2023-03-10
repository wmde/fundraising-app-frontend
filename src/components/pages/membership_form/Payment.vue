<template>
	<div class="payment-section">
		<payment-interval
				:payment-intervals="paymentIntervals"
				:current-interval="interval"
				:title="$t( 'membership_form_payment_interval_title' )"
				v-on:interval-selected="sendIntervalToStore"
		></payment-interval>
		<amount-selection
				class="has-margin-top-36"
				:payment-amounts="paymentAmounts"
				:amount="fee"
				:minimum-amount="getMinimumAmount"
				:title="getAmountTitle"
				:caption="$t('membership_form_payment_amount_description')"
				:error="feeIsValid ? '' : $t('membership_form_payment_amount_error')"
				v-on:amount-selected="sendAmountToStore"
		></amount-selection>
		<div>{{ $t('membership_form_payment_amount_cap_notice') }}</div>

		<payment-type
			v-if="paymentTypes.length > 1"
			class="has-margin-top-36"
			:current-type="type"
			:payment-types="paymentTypes"
			:error="typeIsValid ? '' : $t('membership_form_payment_type_error')"
			:title="$t('membership_form_payment_type_title')"
			v-on:payment-type-selected="sendTypeToStore"
		></payment-type>

		<payment-bank-data
			v-if="type === 'BEZ'"
			class="has-margin-top-36"
			:validateBankDataUrl="validateBankDataUrl"
			:validateLegacyBankDataUrl="validateLegacyBankDataUrl"
		></payment-bank-data>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import AmountSelection from '@/components/shared/AmountSelection.vue';
import PaymentInterval from '@/components/shared/PaymentInterval.vue';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import PaymentType from '@/components/pages/membership_form/PaymentType.vue';

import { action } from '@/store/util';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@/store/namespaces';
import { mapGetters, mapState } from 'vuex';
import { setFee, setInterval } from '@/store/membership_fee/actionTypes';
import { IntervalData, SetFeePayload, TypeData } from '@/view_models/MembershipFee';
import { setType } from '@/store/payment/actionTypes';

export default Vue.extend( {
	name: 'Payment',
	components: {
		AmountSelection,
		PaymentInterval,
		PaymentBankData,
		PaymentType,
	},
	props: {
		validateFeeUrl: String,
		paymentAmounts: Array as () => Array<Number>,
		paymentIntervals: Array as () => Array<String>,
		paymentTypes: Array as () => Array<String>,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
	},
	computed: {
		...mapState( {
			fee: ( state: any ) => state[ NS_MEMBERSHIP_FEE ].values.fee,
			interval: ( state: any ) => state[ NS_MEMBERSHIP_FEE ].values.interval,
			type: ( state: any ) => state[ NS_MEMBERSHIP_FEE ].values.type,
		} ),
		...mapGetters( NS_MEMBERSHIP_FEE, {
			feeIsValid: 'feeIsValid',
			typeIsValid: 'typeIsValid',
			minimumAmount: 'minimumAmount',
		} ),
		getMinimumAmount: {
			get: function () {
				return ( this as any ).minimumAmount( this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/addressType' ] );
			},
		},
		getAmountTitle() {
			const interval = this.$store.state[ NS_MEMBERSHIP_FEE ].values.interval;
			if ( interval === '' ) {
				return this.$t( 'membership_form_payment_amount_title' );
			}
			return this.$t( `membership_form_payment_amount_title_interval_${interval}` );
		},
	},
	methods: {
		sendAmountToStore( amountValue: string ): Promise<null> {
			const payload = {
				feeValue: amountValue,
				validateFeeUrl: this.validateFeeUrl,
			} as SetFeePayload;
			return this.$store.dispatch( action( NS_MEMBERSHIP_FEE, setFee ), payload );
		},
		sendIntervalToStore( interval: string ): void {
			const payload = {
				selectedInterval: interval,
				validateFeeUrl: this.validateFeeUrl,
			} as IntervalData;
			this.$store.dispatch( action( NS_MEMBERSHIP_FEE, setInterval ), payload );
		},
		sendTypeToStore( paymentType: string ): void {
			const payload = {
				selectedType: paymentType,
				validateFeeUrl: this.validateFeeUrl,
			} as TypeData;
			this.$store.dispatch( action( NS_MEMBERSHIP_FEE, setType ), payload );
		},
	},
} );
</script>
