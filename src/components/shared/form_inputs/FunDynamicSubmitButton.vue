<template>
	<button
		class="button"
		:type="buttonType"
		v-bind="$attrs"
	>
		{{ $t( dynamicButtonText ) }}
	</button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent( {
	name: 'FunDynamicTextButton',
	props: {
		paymentType: String,
		buttonType: {
			type: String as PropType<'button'|'submit'|'reset'>,
			default: 'button',
		},
	},
	setup( props: any ) {
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

		return {
			dynamicButtonText,
		};
	},
} );
</script>
