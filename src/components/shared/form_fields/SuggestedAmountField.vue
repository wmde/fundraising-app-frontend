<template>
	<div class="field-container field-container__radio-grid flow" :data-error="isValid ? null : true">
		<div class="grid" data-layout="halves">
			<div class="flow">
				<label for="suggested-amount">{{ suggestedAmountLabel }}</label>
				<RadioFormInput
					id="suggested-amount"
					v-model="isSuggestedAmount"
					:native-value="true"
					name="amount"
				>
					<template #label>
						{{ $n( suggestedAmountInCents / 100, 'euros' ) }}
					</template>
				</RadioFormInput>
			</div>
			<div class="flow">
				<label for="custom-amount">{{ customAmountLabel }}</label>
				<TextRadioFormInput
					name="customFeeAmount"
					radioName = "amount"
					v-model="customAmount"
					input-id="custom-amount"
					:placeholder="customAmountPlaceholder"
					:has-message="false"
					class="membership-fee-change-custom-euro-symbol"
					:show-error="isValid"
					@blur.prevent="onBlurCustomAmount"
					@input.prevent="onCustomAmountInput"
					@update:model-value="updateAmountFromCustom"
					@radio-clicked="() => updateAmountFromCustom( '0' )"
					:radio-checked="!isSuggestedAmount"
				/>
			</div>
		</div>
		<p class="field-container__error-text">{{ errorMessage }}</p>
	</div>
</template>

<script setup lang="ts">
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
	modelValue: number;
	isValid: boolean;
	suggestedAmountInCents: number;
	suggestedAmountLabel: string;
	customAmountLabel: string;
	customAmountPlaceholder: string;
	errorMessage: string;
}

const props = withDefaults( defineProps<Props>(), {
	isValid: true,
} );
const emit = defineEmits( [ 'update:modelValue', 'custom-amount-changed', 'suggested-selected' ] );

const { n } = useI18n();
const isSuggestedAmount = ref<boolean>( true );
const customAmount = ref<string>( '' );

watch( isSuggestedAmount, ( newValue: boolean ) => {
	if ( newValue ) {
		emit( 'update:modelValue', props.suggestedAmountInCents );
		emit( 'suggested-selected' );
		customAmount.value = '';
	}
} );

const onBlurCustomAmount = (): void => {
	if ( isSuggestedAmount.value ) {
		return;
	}
	emit( 'custom-amount-changed' );
	customAmount.value = n( props.modelValue / 100, 'decimal' );
};

const getNumericalCustomAmount = ( amount: string ): number => {
	amount = amount.trim();
	if ( amount === '' ) {
		return 0;
	}

	const numericalAmount = Number( amount.replace( /,/, '.' ) );
	if ( isNaN( numericalAmount ) ) {
		return 0;
	}

	return numericalAmount * 100;
};

const onCustomAmountInput = (): void => {
	emit( 'update:modelValue', getNumericalCustomAmount( customAmount.value ) );
	if ( !props.isValid ) {
		emit( 'custom-amount-changed' );
	}
};

const updateAmountFromCustom = ( newAmount: string ) => {
	isSuggestedAmount.value = false;
	emit( 'update:modelValue', getNumericalCustomAmount( newAmount ) );
};

</script>
