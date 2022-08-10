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

		// Maps payment types to I18n message keys that describe why they are not available
		const disabledPaymentMessageMap = new Map( [
			[ 'SUB', 'donation_form_SUB_payment_type_info' ],
			[ 'BEZ', 'donation_form_address_choice_direct_debit_disclaimer' ],
		] );

		// An object with i18n messages for each unavailable payment type, empty strings if the payment is available
		const disabledPaymentMessages = computed( () => props.paymentTypes.reduce(
			( messages: Record<string, string>, paymentType: string ) => {
				messages[ paymentType ] = '';
				if ( props.disabledPaymentTypes.indexOf( paymentType ) > -1 ) {
					messages[ paymentType ] = disabledPaymentMessageMap.get( paymentType ) ?? '';
				}
				return messages;
			},
			{} as Record<string, string>
		) );

		return {
			selectedType,
			setType,
			disabledPaymentMessages,
		};
	},
} );
</script>
