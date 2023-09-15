<template>
	<fieldset>
		<legend class="title is-size-5">{{ title }}</legend>
		<RadioField
			name="interval"
			v-model="selectedInterval"
			:options="getPaymentIntervalOptions"
			@field-changed="setInterval"
			:required="true"
			:disabled="disabledPaymentIntervals"
			alignment="column"
			label=""
		/>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IntervalData } from '@src/view_models/Payment';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { FormOption } from '@src/components/shared/form_fields/FormOption';

export default defineComponent( {
	name: 'PaymentInterval',
	components: { RadioField, RadioInput },
	data: function (): IntervalData {
		return {
			selectedInterval: this.$props.currentInterval,
		};
	},
	props: {
		currentInterval: String,
		paymentIntervals: Array<number>,
		title: String,
		disabledPaymentIntervals: {
			type: Array<number>,
			default: () => [],
		},
	},
	methods: {
		setInterval(): void {
			this.$emit( 'interval-selected', this.$data.selectedInterval );
		},
	},
	computed: {
		getPaymentIntervalOptions(): Array<FormOption> {
			return this.$props.paymentIntervals.map( ( intervalValue: number ) => (
				{ value: intervalValue.toString(), label: this.$t( 'payment_interval_' + intervalValue ) }
			) );
		},
	},
	watch: {
		currentInterval: function ( newInterval: string ): void {
			this.selectedInterval = newInterval;
		},
	},
} );
</script>
