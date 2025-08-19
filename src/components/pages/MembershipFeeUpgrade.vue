<template>
	<div v-if="showErrorPageInstead">
		<span>Die angeforderte Seite kann nicht angezeigt werden.</span>
	</div>
	<div v-else>
		<h1>Ich erhöhe meinen {{ $t( 'donation_form_payment_interval_' + currentInterval )}}en Mitgliedsbeitrag </h1>

		<FormSection>
			<RadioField
				name="newFeeAmount"
				model-value=""
				:options="suggestedFeeAmountFormOptions"
				alignment="twocolumnsperrow"
				label="Empfehlung:"
			/>
			<div class="form-field-amount-custom" :class="{ active: isCustomAmount }">
				<label class="form-field-amount-help-text" for="amount-custom">Anderer Betrag:</label>
				<div class="form-field-amount-custom-euro-symbol" :class="{ active: isCustomAmount }">
					<div class="radio radio-form-input">
						<input
							name="amount"
							type="radio"
							class="form-field-amount-custom-radio"
							@click="setCustomAmount"
							:checked="isCustomAmount"
							aria-hidden="true"
							tabindex="-1"
						/>
					</div>

					<TextFormInput
						v-model="customAmount"
						input-type="text"
						input-id="amount-custom"
						:has-message="false"
						name="custom-amount"
						:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_custom_placeholder' ) } )"
						@keydown.enter="setCustomAmount"
						@blur="setCustomAmount"
						@focus.prevent="resetErrorInput"
						@update:model-value="updateAmountFromCustom"
						:aria-invalid="showError"
					/>
				</div>
			</div>
		</FormSection>

		TODO show iban fields<br/>

		TODO show side bar info (external Member ID): {{ externalMemberId }}<br/>

		<button class="button" @click="validate">{{ $t('membership_fee_upgrade_submit_button') }}</button>
	</div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { useI18n } from 'vue-i18n';
import { usePaymentFieldModel } from '@src/components/pages/membership_form/usePaymentFieldModel';
import { computed, ref, watch } from 'vue';
import { FeeValidity } from '@src/view_models/MembershipFee';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';

interface Props {
	uuid: string;
	externalMemberId: number;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: number;
	showErrorPageInstead: boolean;
	validateFeeUrl: string;
}
const props = defineProps<Props>();
const store = useStore();
const { t } = useI18n();

const fee = usePaymentFieldModel( store, 'fee', 'setFee', props.validateFeeUrl );

const feeIsValid = computed( () => store.getters[ 'membership_fee/feeIsValid' ] );

const amount = ref<number>( Number( props.currentAmountInCents ) );

const showError = ref<boolean>( false );



//TODO isCustomAmount should be set to true if checkbox is ticked
const isCustomAmount = ref<boolean>( false );

const getFormattedCustomAmount = (): string => {
	if ( !isCustomAmount.value ) {
		return '';
	}
	return t( amount.value / 100, 'decimal' );
};

const customAmount = ref<string>( getFormattedCustomAmount() );

const minimumAmount = computed(
	() => store.getters[ 'membership_fee/minimumAmount' ]( store.state.membership_address.addressType )
);

const validate = (): void => {
	alert("validating");
};

const feeErrorMessage = computed<string>( () => {
	const messages: { [ key: number ]: string } = {
		[ FeeValidity.FEE_VALID ]: '',
		[ FeeValidity.FEE_TOO_LOW ]: t( 'membership_form_payment_amount_error' ),
		[ FeeValidity.FEE_TOO_HIGH ]: t( 'membership_form_payment_amount_too_high' ),
	};
	return messages[ store.getters.feeValidity ].toString();
} );

watch( minimumAmount, async ( newMinimumAmount ) => {
	if ( fee.value < newMinimumAmount ) {
		fee.value = '';
	}
} );

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

const resetErrorInput = (): void => {
	if ( showError.value ) {
		customAmount.value = '';
	}
};

const suggestedFeeAmountFormOptions: CheckboxFormOption[] = [
	{ value: props.suggestedAmountInCents, label: props.suggestedAmountInCents.toString(), id: 'suggestedAmount' },
];

</script>
