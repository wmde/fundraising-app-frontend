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
						@change.native="setType">
					{{ $t( paymentType ) }}
				</b-radio>
			</div>
		</div>
		<span class="help is-danger" v-if="error">{{ error }}</span>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

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
	},
	setup( props, { emit } ) {
		const selectedType = ref( props.currentType );
		const setType = () => emit( 'payment-type-selected', selectedType.value );

		watch( () => props.currentType, ( newType ) => {
			selectedType.value = newType;
		} );

		return {
			selectedType,
			setType,
		};
	},
} );
</script>
