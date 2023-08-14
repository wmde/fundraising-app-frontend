<template>
	<div class="option-checkbox">
		<FunCheckbox
			id="donation_receipt"
			class="is-inline-checkbox"
			name="receipt"
			v-model="receiptNeeded"
			@change.native="setReceipt()"
		>
			{{ message }}
		</FunCheckbox>
	</div>
</template>

<script>
import Vue from 'vue';
import FunCheckbox from '@/components/shared/form_inputs/FunCheckbox.vue';

export default Vue.extend( {
	name: 'ReceiptOption',
	components: { FunCheckbox },
	data: function () {
		return {
			receiptNeeded: this.$props.initialReceiptNeeded,
		};
	},
	props: {
		message: String,
		initialReceiptNeeded: Boolean,
	},
	methods: {
		setReceipt: function () {
			this.$emit( 'receipt-changed', this.receiptNeeded );
		},
	},
} );
</script>
