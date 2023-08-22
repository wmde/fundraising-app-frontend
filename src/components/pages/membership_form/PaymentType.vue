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
					@change.native="setType"
				>
					{{ $t( paymentType ) }}
				</RadioInput>
			</div>
		</div>
		<span class="help is-danger" v-if="error">{{ error }}</span>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
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
	},
	setup( props, { emit } ) {
		const { currentType } = toRefs( props );
		return usePaymentType( currentType, emit );
	},
} );
</script>
