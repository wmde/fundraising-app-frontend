<template>
	<button
		class="button"
		:type="buttonType"
		v-bind="$attrs"
	>
		{{dynamicButtonText}}
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
	paymentType: 'PPL' | 'UEB' | 'MCP' | 'SUB';
	buttonType?: 'button'|'submit'|'reset';
}

const { t } = useI18n();
const props = withDefaults( defineProps<Props>(), {
	buttonType: 'button',
} );

const dynamicButtonText = computed( () => {
	switch ( props.paymentType ) {
		case 'PPL':
			return t( 'donation_form_finalize_paypal' );
		case 'UEB':
			return t( 'donation_form_finalize_bank_transfer' );
		case 'MCP':
			return t( 'donation_form_finalize_credit_card' );
		case 'SUB':
			return t( 'donation_form_finalize_sofort' );
		default:
			return t( 'donation_form_finalize' );
	}
} );
</script>
