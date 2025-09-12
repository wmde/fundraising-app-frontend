<template>
	<div v-if=" feeChangeFrontendFlag === 'SHOW_ERROR_PAGE' ">
		<span>Die angeforderte Seite kann nicht angezeigt werden. Bitte überprüfen Sie die URL oder kontaktieren Sie uns.</span>
	</div>
	<div v-if=" feeChangeFrontendFlag === 'SHOW_FEE_ALREADY_CHANGED_PAGE' ">
		<span>Sie haben bereits einen großartigen Beitrag geleistet - vielen Dank!</span>
		<span>Eine weitere Erhöhung ist aktuell nicht möglich.</span>
	</div>
	<div v-if=" feeChangeFrontendFlag === 'SHOW_FEE_CHANGE_FORM' ">
		<h1>Ich erhöhe meinen {{ $t( 'donation_form_payment_interval_' + currentInterval )}}en Mitgliedsbeitrag </h1>

		<FormSection>
			<RadioField
				name="newFeeAmount"
				model-value=""
				:options="suggestedFeeAmountFormOptions"
				alignment="twocolumnsperrow"
				label="Empfehlung:"
			/>

			<TextRadioFormInput
				name=""
				v-model="customAmount"
				input-id=""
				placeholder=""
				has-message=""
				radio-checked=""
				class="form-field-amount-custom-euro-symbol"
				label="Anderer Betrag:"
			 >
			</TextRadioFormInput>

			<div>{{ feeErrorMessage }}</div>
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
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';

interface Props {
	uuid: string;
	externalMemberId: number;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: number;
	feeChangeFrontendFlag: 'SHOW_FEE_CHANGE_FORM' | 'SHOW_FEE_ALREADY_CHANGED_PAGE' | 'SHOW_ERROR_PAGE';
	validateFeeUrl: string;
}
const props = defineProps<Props>();
const store = useStore();
const { t } = useI18n();

const fee = usePaymentFieldModel( store, 'fee', 'setFee', props.validateFeeUrl );

// TODO implement ...  inputAmount >= minimumAmount
const feeIsValid = false;


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
	//TODO 1. do frontend validation (on the spot?)

	//TODO 2. send request to /api/v1/membership/change-fee
	// TODO 3. evaluate if the JSONResponse was "status": "OK" or "status":"ERR"
		// depending on the output, show success content or show error content?
};

//TODO implement proper checking of current values without store
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

<style lang="scss">
@use '@src/scss/settings/colors';
$input-height: 50px;

.membership-fee-change {

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