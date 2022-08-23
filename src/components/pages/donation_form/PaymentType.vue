<template>
	<fieldset>
		<legend class="title is-size-5">{{ title }}</legend>
		<div>
			<div v-for="paymentType in paymentTypes" :key="paymentType">
				<b-radio :class="{ 'is-active': selectedType === paymentType }"
						:id="'payment-' + paymentType.toLowerCase()"
						name="payment"
						v-model="selectedType"
						:native-value="paymentType"
						:disabled="disabledPaymentTypes.indexOf( paymentType ) > -1"
						@change.native="setType">
					{{ $t( paymentType ) }}
					<div v-show="disabledPaymentMessages[paymentType]" class="has-text-dark-lighter has-margin-top-18">
						{{ $t( disabledPaymentMessages[paymentType] ) }}
					</div>
				</b-radio>
			</div>
		</div>
		<span class="help is-danger" v-if="error">{{ error }}</span>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, toRefs } from 'vue';
import { usePaymentType } from '@/components/shared/usePaymentType';

export default defineComponent( {
	name: 'PaymentType',
	props: {
		currentType: String,
		error: {
			type: String,
			default: '',
		},
		paymentTypes: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		title: String,
		disabledPaymentTypes: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
	},
	setup( props, { emit } ) {
		const { currentType } = toRefs( props );
		const { selectedType, setType } = usePaymentType( currentType, emit );

		// Utility function
		const paymentIsDisabled = ( paymentName: string ): boolean =>
			props.disabledPaymentTypes.indexOf( paymentName ) > -1;

		// An object with i18n messages for each unavailable payment type, empty strings if the payment is available
		// We only need keys for payments that show messages when disabled
		const disabledPaymentMessages = computed( () => ( {
			SUB: paymentIsDisabled( 'SUB' ) ? 'donation_form_SUB_payment_type_info' : '',
			BEZ: paymentIsDisabled( 'BEZ' ) ? 'donation_form_address_choice_direct_debit_disclaimer' : '',
		} ) );

		return {
			selectedType,
			setType,
			disabledPaymentMessages,
		};
	},
} );
</script>
