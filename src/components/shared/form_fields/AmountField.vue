<template>
	<fieldset class="form-field form-field-amount">
		<legend class="form-field-label">{{ title }}</legend>
		<legend class="form-field-description" v-if="description">{{ description }}</legend>
		<div class="control form-field-amounts-container">
			<RadioFormInput
				v-for="( paymentAmount, index ) in paymentAmounts"
				:key="index"
				:native-value="paymentAmount"
				name="amount"
				v-model="amount"
				:class="{ 'inactive': paymentAmount < minimumAmount }"
			>
				{{ $n( paymentAmount / 100, 'euros' ) }}
			</RadioFormInput>
		</div>

		<div class="form-field-amount-custom">
			<TextFormInput
				v-model="customAmount"
				input-type="text"
				input-id="form-field-amount-custom"
				:has-message="false"
				name="custom-amount"
				:placeholder="$t('donation_form_custom_placeholder')"
			/>
			<label for="form-field-amount-custom">{{ $t('donation_form_payment_amount_legend') }}</label>
		</div>
		<span v-if="showError" class="help is-danger">{{ errorMessage }}</span>
	</fieldset>
</template>

<script setup lang="ts">

import RadioFormInput from '@src/components/shared/form_inputs/RadioFormInput.vue';
import { ref, watch } from 'vue';
import TextFormInput from '@src/components/shared/form_inputs/TextFormInput.vue';

interface Props {
	modelValue: string;
	title: String;
	description?: string;
	paymentAmounts: number[];
	minimumAmount?: number;
	showError?: boolean;
	errorMessage?: String;
}

const props = withDefaults( defineProps<Props>(), {
	minimumAmount: 0,
	showError: false,
} );

const amount = ref<string>( props.modelValue );
const customAmount = ref<string>( props.modelValue );

watch( () => props.modelValue, ( newValue: string ) => {
	amount.value = newValue;
} );

</script>

<style scoped lang="scss">

</style>
