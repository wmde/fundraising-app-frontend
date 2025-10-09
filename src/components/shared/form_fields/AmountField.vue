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
		<p v-if="!showError && $slots.message && $slots.message.toString() !== ''" class="field-container__message"><em><slot name="message"/></em></p>
	</fieldset>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useI18n } from 'vue-i18n';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';

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

const { n } = useI18n();
const amount = ref<number>( Number( props.modelValue ) );
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => props.ariaDescribedby ),
	'amount-error',
	computed<boolean>( () => props.showError )
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

<style lang="scss">
@use '@src/scss/settings/global';
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/forms';
@use '@src/scss/mixins/visibility';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

$max-width: 414px;
$input-height: 50px;

.form-field-amount {
	max-width: map.get( forms.$input, 'max-width' );

	.input {
		max-width: map.get( forms.$input, 'max-width' );
	}

	&-radio-container {
		display: flex;
		flex-wrap: wrap;
		margin: 0 ( -( map.get( units.$spacing, 'xx-small' ) ) );
	}

	&-radio {
		width: 50%;
		padding: 0 map.get( units.$spacing, 'xx-small' ) map.get( units.$spacing, 'small' );
		font-size: 16px;

		@include breakpoints.tablet-up {
			width: 25%;
		}

		.radio-form-input {
			padding: 0;
			margin: 0;
			width: 100%;
			min-width: auto;
			height: $input-height;
			line-height: $input-height;
			text-align: left;
			transition: background 100ms global.$easing, color 100ms global.$easing;

			label {
				padding: 0 0 0 36px;
			}

			&.is-active {
				label:hover,
				input:focus + label,
				input:hover + label {
					border-color: colors.$white;
					box-shadow: 0 0 0 2px colors.$primary;
				}
			}

			&.inactive {
				cursor: not-allowed;
				color: #b7b7b7;
			}

			&.is-disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}

	&-custom-euro-symbol {
		&:after {
			color: colors.$dark;
			content: "€";
			font-size: 1.1em;
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY( -50% );
		}

		&.active {
			input {
				border-color: colors.$primary;
			}
		}

		.text-form-input .input {
			height: $input-height;
		}
	}
}
</style>
