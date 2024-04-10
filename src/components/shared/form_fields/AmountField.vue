<template>
	<fieldset class="form-field form-field-amount" :class="`locale-${ $i18n.locale }`">
		<div v-if="minimumAmountMessage!=''" class="minimum-message">
			{{ minimumAmountMessage }}
		</div>
		<div class="control form-field-amount-radio-container">
			<div class="form-field-amount-radio" v-for="( paymentAmount, index ) in paymentAmounts" :key="index">
				<RadioFormInput
					:native-value="paymentAmount"
					name="amount"
					v-model="amount"
					:class="{ 'inactive': paymentAmount < minimumAmount }"
					:disabled="paymentAmount < minimumAmount"
					:id="`amount-${amount}`"
					@update:model-value="updateAmountFromRadio"
						:aria-invalid="showError"
						:aria-error-message="showError ? 'amount-error' : ''"
				>
					{{ $n( paymentAmount / 100, 'euros' ) }}
				</RadioFormInput>
			</div>
		</div>

		<div class="form-field-amount-custom" :class="{ active: isCustomAmount }">
			<TextFormInput
				v-model="customAmount"
				input-type="text"
				input-id="amount-custom"
				:has-message="false"
				name="custom-amount"
				:placeholder="$t('donation_form_custom_placeholder')"
				@keydown.enter="setCustomAmount"
				@blur="setCustomAmount"
				@focus.prevent="resetErrorInput"
				@update:model-value="updateAmountFromCustom"
				:aria-invalid="showError"
				:aria-error-message="showError ? 'amount-error' : ''"
			/>
			<!-- eslint-disable vuejs-accessibility/label-has-for -->
			<label for="amount-custom" class="is-sr-only">{{ $t('donation_form_payment_amount_legend') }}</label>
		</div>
		<span v-if="showError" class="help is-danger" id="amount-error" role="alert">{{ errorMessage }}</span>

		<slot name="info-message"/>
	</fieldset>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { useI18n } from 'vue-i18n';

interface Props {
	modelValue: string;
	paymentAmounts: number[];
	minimumAmount?: number;
	showError?: boolean;
	errorMessage?: String;
	minimumAmountMessage?: string;
}

const props = withDefaults( defineProps<Props>(), {
	minimumAmount: 0,
	minimumAmountMessage: '',
	showError: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const { n } = useI18n();
const amount = ref<number>( Number( props.modelValue ) );
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

const setCustomAmount = ( e: Event ): void => {
	e.preventDefault();

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
@use 'sass:map';

$max-width: 384px;
$input-height: 50px;

.form-field-amount {
	max-width: $max-width;

	.minimum-message {
		margin-bottom: map.get( units.$spacing, 'small' );
		line-height: 130%;
	}

	.input {
		max-width: $max-width;
	}

	&-radio-container {
		display: flex;
		flex-wrap: wrap;
		margin: 0 ( -( map.get( units.$spacing, 'small' ) ) );
	}

	&-radio {
		width: 25%;
		padding: 0 map.get( units.$spacing, 'small' ) map.get( units.$spacing, 'small' );
		font-size: 16px;

		.radio-form-input {
			padding: 0;
			margin: 0;
			width: 100%;
			min-width: auto;
			height: $input-height;
			line-height: $input-height;
			text-align: center;
			color: colors.$primary;
			transition: background 100ms global.$easing, color 100ms global.$easing;

			input {
				@include visibility.screen-reader-only;
			}

			label {
				padding: 0;
			}

			&.active {
				label {
					border: 1px solid colors.$primary;
					background: colors.$primary;
					color: colors.$white;
					font-weight: bold;
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

	&-custom {
		position: relative;

		&:after {
			color: colors.$dark;
			content: "€";
			font-size: 1.1em;
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY( -50% );
		}

		input {
			padding: 0 map.get( units.$spacing, 'medium' );
			text-align: right;
		}

		&.active {
			input {
				border-color: colors.$primary;
				box-shadow: 0 1px 0 0 colors.$primary;
			}
		}

		.text-form-input .input {
			height: $input-height;
		}
	}

	&.locale-en-GB {
		.form-field-amount-custom {
			input {
				text-align: left;
			}
			&:after {
				right: auto;
				left: 10px;
			}
		}
	}
}
</style>
