<template>
	<fieldset>
		<legend class="title is-size-5">{{ title }}</legend>
		<div>
			<div class="wrap-radio" v-for="interval in paymentIntervals" :key="'interval-' + interval">
				<RadioInput
					:class="{ 'is-active': selectedInterval === interval.toString() }"
					:id="'interval-' + interval"
					name="interval"
					v-model="selectedInterval"
					:native-value="interval.toString()"
					:disabled="disabledPaymentIntervals.indexOf( interval.toString() ) > -1"
					@change.native="setInterval"
				>
					{{ $t( 'donation_form_payment_interval_' + interval.toString() ) }}
					<div
						v-show="disabledPaymentIntervals.length && disabledPaymentIntervals.indexOf( interval.toString() ) === -1"
						class="has-text-dark-lighter has-margin-top-18">
						{{ $t( 'donation_form_SUB_payment_type_info' ) }}
					</div>
				</RadioInput>
			</div>
		</div>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IntervalData } from '@src/view_models/Payment';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';

export default defineComponent( {
	name: 'PaymentInterval',
	components: { RadioInput },
	data: function (): IntervalData {
		return {
			selectedInterval: this.$props.currentInterval,
		};
	},
	props: {
		currentInterval: String,
		paymentIntervals: Array,
		title: String,
		disabledPaymentIntervals: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		setInterval(): void {
			this.$emit( 'interval-selected', this.$data.selectedInterval );
		},
	},
	watch: {
		currentInterval: function ( newInterval: string ): void {
			this.selectedInterval = newInterval;
		},
	},
} );
</script>
