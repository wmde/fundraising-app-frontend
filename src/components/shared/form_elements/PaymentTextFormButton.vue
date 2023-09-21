<template>
	<FormButton
		:is-loading="isLoading"
		button-type="submit">
		{{ dynamicButtonText }}
	</FormButton>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';

interface Props {
	isLoading: boolean;
	paymentType: 'PPL' | 'UEB' | 'MCP' | 'SUB';
}

const props = defineProps<Props>();

const { t } = useI18n();

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
