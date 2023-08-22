<template>
	<fieldset>
		<legend class="title is-size-5">{{ title }}</legend>
		<div>
			<div v-for="paymentType in paymentTypes" :key="paymentType">
				<RadioInput
					:class="{ 'is-active': selectedType === paymentType }"
					:id="'payment-' + paymentType.toLowerCase()"
					name="payment"
					v-model="selectedType"
					:native-value="paymentType"
					:disabled="paymentIsDisabled( paymentType )"
					@change.native="setType"
				>
					{{ $t( paymentType ) }}
					<div v-if="paymentIsDisabled( paymentType )" class="has-text-dark-lighter has-margin-top-18">
						{{ $t( disabledPaymentMessages[ paymentType ] ) }}
					</div>
				</RadioInput>
			</div>
		</div>
		<span class="help is-danger" v-if="error">{{ error }}</span>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, toRefs } from 'vue';
import { usePaymentType } from '@src/components/shared/usePaymentType';
import RadioInput from '@src/components/shared/form_inputs/RadioInput.vue';

export default defineComponent( {
	name: 'PaymentType',
	components: { RadioInput },
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
			SUB: 'donation_form_SUB_payment_type_info',
			BEZ: 'donation_form_address_choice_direct_debit_disclaimer',
		} ) );

		return {
			selectedType,
			setType,
			paymentIsDisabled,
			disabledPaymentMessages,
		};
	},
} );
</script>
