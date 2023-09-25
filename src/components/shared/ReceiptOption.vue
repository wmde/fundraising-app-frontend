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

<script setup lang="ts">
import { ref } from 'vue';
import FunCheckbox from '@src/components/shared/legacy_form_inputs/FunCheckbox.vue';

interface Props {
	message: String;
	initialReceiptNeeded: Boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'receipt-changed' ] );

const receiptNeeded = ref<Boolean>( props.initialReceiptNeeded );
const setReceipt = (): void => {
	emit( 'receipt-changed', receiptNeeded.value );
};

</script>
