<template>
	<div class="option-checkbox">
		<b-checkbox type="checkbox" class="is-inline-checkbox"
			id="donation_receipt"
			name="receipt"
			v-model="receiptNeeded"
			@change.native="setReceipt()">
			{{ message }}
		</b-checkbox>
	</div>

</template>

<script>
import Vue from 'vue';

export default Vue.extend( {
	name: 'ReceiptOption',
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
