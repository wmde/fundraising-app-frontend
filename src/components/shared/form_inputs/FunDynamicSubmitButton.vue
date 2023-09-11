<template>
	<button
		class="button"
		:type="buttonType"
		v-bind="$attrs"
	>
		{{ $t( dynamicButtonText ) }}
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	paymentType: 'PPL' | 'UEB' | 'MCP' | 'SUB';
	buttonType?: 'button'|'submit'|'reset';
}

const props = withDefaults( defineProps<Props>(), {
	buttonType: 'button',
} );

const dynamicButtonText = computed( () => {
	switch ( props.paymentType ) {
		case 'PPL':
			return 'donation_form_finalize_paypal';
		case 'UEB':
			return 'donation_form_finalize_bank_transfer';
		case 'MCP':
			return 'donation_form_finalize_credit_card';
		case 'SUB':
			return 'donation_form_finalize_sofort';
		default:
			return 'donation_form_finalize';
	}
} );
</script>
