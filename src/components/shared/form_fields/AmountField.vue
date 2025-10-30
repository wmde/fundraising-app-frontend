<template>
	<fieldset class="field-container flow" id="payment-form-amount" :class="[ `locale-${ $i18n.locale }` ]" :data-error="showError ? true : null" data-max-width>
		<legend v-if="label">{{ label }}</legend>
		<p>{{ $t( 'donation_form_payment_amount_help_text' ) }}</p>
		<p v-if="minimumAmountMessage!=''">{{ minimumAmountMessage }}</p>

		<div class="field-container__radio-grid">
			<div class="grid" data-layout="quarters">
				<RadioFormInput
					v-for="( paymentAmount, index ) in paymentAmounts" :key="index"
					:native-value="paymentAmount"
					name="amount"
					v-model="amount"
					:disabled="paymentAmount < minimumAmount"
					:id="`amount-${paymentAmount}`"
					@update:model-value="updateAmountFromRadio"
					:aria-invalid="showError"
					:aria-describedby="ariaDescribedby"
				>
					<template #label>
						{{ $n( paymentAmount / 100, 'euros' ) }}
					</template>
				</RadioFormInput>
			</div>
		</div>

		<div class="flow" :class="{ active: isCustomAmount }">
			<label for="amount-custom">{{ $t('donation_form_payment_amount_label') }}</label>
			<TextRadioFormInput
				v-model="customAmount"
				input-type="text"
				input-id="amount-custom"
				:has-message="false"
				:has-error="showError"
				name="custom-amount"
				:radio-clicked="setCustomAmount"
				:radio-checked="isCustomAmount"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_custom_placeholder' ) } )"
				@keydown.enter="setCustomAmount"
				@blur="setCustomAmount"
				@focus.prevent="resetErrorInput"
				@update:model-value="updateAmountFromCustom"
				:aria-invalid="showError"
				:aria-describedby="ariaDescribedby"
			/>
		</div>
		<p v-if="showError" class="field-container__error-text" id="amount-error">{{ errorMessage }}</p>
		<p v-if="!showError && $slots.message" class="field-container__message" id="amount-message"><slot name="message"/></p>
	</fieldset>
</template>

<script setup lang="ts">

import { computed, ref, useSlots, watch } from 'vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useI18n } from 'vue-i18n';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';

interface Props {
	modelValue: string;
	paymentAmounts: number[];
	minimumAmount?: number;
	showError?: boolean;
	label?: String;
	errorMessage?: String;
	minimumAmountMessage?: string;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	minimumAmount: 0,
	minimumAmountMessage: '',
	ariaDescribedby: '',
	showError: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );
const slots = useSlots();

const { n } = useI18n();
const amount = ref<number>( Number( props.modelValue ) );
const ariaDescribedby = useAriaDescribedby(
	'amount',
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => !!slots.message )
);
const isCustomAmount = computed<boolean>( () => amount.value > 0 && props.paymentAmounts.indexOf( amount.value ) === -1 );

const getFormattedCustomAmount = (): string => {
	if ( !isCustomAmount.value ) {
		return '';
	}
	return n( amount.value / 100, 'decimal' );
};

const customAmount = ref<string>( getFormattedCustomAmount() );

const updateAmountFromRadio = ( newAmount: number ) => {
	customAmount.value = '';
	emit( 'update:modelValue', String( newAmount ) );
	emit( 'field-changed' );
};

const updateAmountFromCustom = ( newAmount: string ) => {
	newAmount = newAmount.trim();
	if ( newAmount === '' ) {
		amount.value = 0;
		return;
	}

	const numericalAmount = Number( newAmount.replace( /,/, '.' ) );
	if ( isNaN( numericalAmount ) ) {
		amount.value = 0;
		return;
	}

	amount.value = Math.trunc( numericalAmount * 100 );
};

const setCustomAmount = (): void => {
	customAmount.value = getFormattedCustomAmount();
	if ( amount.value > 0 ) {
		emit( 'update:modelValue', String( amount.value ) );
	} else {
		emit( 'update:modelValue', '' );
		emit( 'field-changed' );
	}
};

const resetErrorInput = (): void => {
	if ( props.showError ) {
		customAmount.value = '';
	}
};

watch( () => props.modelValue, ( newValue: string ) => {
	amount.value = Number( newValue );
	customAmount.value = getFormattedCustomAmount();
} );

</script>
