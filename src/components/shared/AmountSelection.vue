<template>
	<fieldset>
		<legend class="title is-size-5">{{ title }}</legend>
		<legend class="form-caption has-margin-bottom-18" v-if="caption">{{ caption }}</legend>
		<div class="amount-wrapper">
			<div v-for="amount in paymentAmounts"
				:key="'amount-' + toCents( amount )"
				:class="['amount-selector', 'is-form-input', amount < minimumAmount ? 'inactive' : '']"
				>
				<input type="radio"
					:id="'amount-' + amount "
					name="amount-grp"
					:value="amount"
					:checked="amount === selectedAmount && amount >= minimumAmount"
					:disabled="amount < minimumAmount"
					@change="amountSelected( amount )"
					class="is-sr-only">
				<label class="has-border-rounded" :for="'amount-' + amount ">
					<span>{{ $n( amount / 100, 'euros' ) }}</span>
				</label>
			</div>
			<div class="amount-custom-wrapper">
				<div class="amount-custom is-form-input">
					<input :class="[customAmount ? 'is-valid' : '', 'input', 'is-large', 'input-amount', 'has-border-rounded' ]"
							type="text"
							id="amount-custom"
							@keydown.enter="catchEnter"
							@blur="customAmountEntered"
							maxlength="9"
							:value="customAmount"
							:placeholder="$t('donation_form_custom_placeholder')">
					<label for="amount-custom" class="is-sr-only">{{ $t('donation_form_payment_amount_legend') }}</label>
				</div>
			</div>
		</div>
		<span class="help is-danger" v-if="error !== ''">{{ error }}</span>
	</fieldset>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'AmountSelection',
	props: {
		amount: String,
		minimumAmount: {
			type: Number,
			default: 0,
		},
		paymentAmounts: Array,
		title: String,
		error: {
			type: String,
			default: '',
		},
		caption: {
			type: String,
			default: '',
		},
	},
	computed: {
		hasErrors: {
			get: function (): boolean {
				return !this.$store.getters[ 'payment/amountIsValid' ];
			},
		},
		selectedAmount: {
			get: function (): number {
				const amount = this.$props.amount;
				const amountFound = this.$props.paymentAmounts.indexOf( Number( amount ) );
				return amountFound > -1 ? Number( amount ) : 0;
			},
		},
		customAmount: {
			get: function (): string {
				const amount = this.$props.amount;
				const amountFound = this.$props.paymentAmounts.indexOf( Number( amount ) );
				if ( amountFound > -1 || amount === '0' || amount === '' ) {
					return '';
				}
				return this.$n( Number( amount ) / 100, 'decimal' );
			},
		},
	},
	methods: {
		toCents: ( amount: string ): number => Math.trunc( Number( amount ) * 100 ),
		amountSelected( amount: number ) {
			this.$emit( 'amount-selected', String( amount ) );
		},
		customAmountEntered( evt: Event ) {
			const amount = ( evt.target as HTMLInputElement ).value.trim();
			if ( amount === '' ) {
				// can't access computed props through this.$props here
				if ( ( this as any ).selectedAmount !== 0 ) {
					return;
				}

				this.$emit( 'amount-selected', '' );
				return;
			}
			const englishDecimalAmount = Number( amount.replace( /,/, '.' ) );
			if ( isNaN( englishDecimalAmount ) ) {
				this.$emit( 'amount-selected', '' );
				return;
			}
			this.$emit( 'amount-selected', String( Math.trunc( englishDecimalAmount * 100 ) ) );
		},
		catchEnter( evt: Event ) {
			// Stop enter from submitting if there is only one field, because we need the validation code to run
			evt.preventDefault();
			this.customAmountEntered( evt );
		},
	},
} );
</script>
