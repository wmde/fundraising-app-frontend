<template>
	<div class="payment-section">
		<amount-selection
			:payment-amounts="paymentAmounts"
			:amount="amount"
			:title="$t('donation_form_payment_amount_title')"
			:error="showErrorMessage"
			v-on:amount-selected="sendAmountToStore"
		/>
		<payment-interval
			class="has-margin-top-36"
			:payment-intervals="paymentIntervals"
			:current-interval="interval"
			:title="$t('donation_form_payment_interval_title')"
			:disabled-payment-intervals="disabledPaymentIntervals"
			v-on:interval-selected="sendIntervalToStore"
		/>
		<payment-type
			class="has-margin-top-36"
			:current-type="type"
			:payment-types="paymentTypes"
			:error="typeIsValid ? '' : $t('donation_form_payment_type_error')"
			:title="$t('donation_form_payment_type_title')"
			:disabled-payment-types="disabledPaymentTypes"
			v-on:payment-type-selected="sendTypeToStore"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AmountSelection from '@src/components/shared/AmountSelection.vue';
import PaymentInterval from '@src/components/shared/PaymentInterval.vue';
import PaymentType from '@src/components/pages/donation_form/PaymentType.vue';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { setAmount, setInterval, setType } from '@src/store/payment/actionTypes';
import { mapGetters, mapState } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';

export default defineComponent( {
	name: 'Payment',
	components: {
		AmountSelection,
		PaymentInterval,
		PaymentType,
	},
	props: [ 'paymentAmounts', 'paymentIntervals', 'paymentTypes' ],
	computed: {
		...mapState( {
			amount: ( state: any ) => state[ NS_PAYMENT ].values.amount,
			interval: ( state: any ) => state[ NS_PAYMENT ].values.interval,
			type: ( state: any ) => state[ NS_PAYMENT ].values.type,
			disabledPaymentTypes: ( state: any ) => {
				var disabledTypes : String[] = [];
				if ( state[ NS_ADDRESS ].addressType === AddressTypeModel.ANON ) {
					disabledTypes.push( 'BEZ' );
				}
				if ( state[ NS_PAYMENT ].values.interval !== '0' ) {
					disabledTypes.push( 'SUB' );
				}
				return disabledTypes;
			},
			emailOnlyDisabledPaymentTypes: ( state: any ) => {
				if ( state[ NS_PAYMENT ].values.interval !== '0' ) {
					return [ 'SUB' ];
				}
				return [];
			},
			disabledPaymentIntervals: function ( state: any ) {
				var disabledIntervals : String[] = [];
				if ( state[ NS_PAYMENT ].values.type === 'SUB' ) {
					disabledIntervals = ( this as any ).$props.paymentIntervals
						.filter( ( interval:Number ) => Number( interval ) > 0 )
						.map( ( interval:Number ) => String( interval ) );
				}
				return disabledIntervals;
			},
		} ),
		...mapGetters( NS_PAYMENT, [ 'amountValidity', 'typeIsValid' ] ),
		showErrorMessage(): String {
			const messages : { [ key:number ]:string; } = {
				[ AmountValidity.AMOUNT_VALID ]: '',
				[ AmountValidity.AMOUNT_TOO_LOW ]: this.$t( 'donation_form_payment_amount_error' ) as string,
				[ AmountValidity.AMOUNT_TOO_HIGH ]: this.$t( 'donation_form_payment_amount_too_high' ) as string,
			};
			return messages[ this.$store.getters[ NS_PAYMENT + '/amountValidity' ] ];
		},
	},
	methods: {
		sendAmountToStore( amountValue: string ): void {
			this.$store.dispatch( action( NS_PAYMENT, setAmount ), amountValue );
		},
		sendIntervalToStore( interval: string ): void {
			this.$store.dispatch( action( NS_PAYMENT, setInterval ), interval );
		},
		sendTypeToStore( paymentType: string ): void {
			this.$store.dispatch( action( NS_PAYMENT, setType ), paymentType );
		},
	},
} );
</script>
