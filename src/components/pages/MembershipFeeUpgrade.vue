<template>
	<div v-if="feeChangeFrontendFlag === 'SHOW_ERROR_PAGE'">
		<ContentCard>
			<template #content>
				<IconText>
					<template #icon><WarningIcon/></template>
					<template #content>
						<div class="flow">
							<h2>{{ $t('membership_fee_upgrade_error_page_headline') }}</h2>
							<p>{{ $t('membership_fee_upgrade_error_page_text') }}</p>
						</div>
					</template>
				</IconText>
			</template>
		</ContentCard>
	</div>
	<div v-if="feeChangeFrontendFlag === 'SHOW_FEE_ALREADY_CHANGED_PAGE'">
		<ContentCard>
			<template #content>
				<IconText>
					<template #icon><SuccessIcon/></template>
					<template #content>
						<div class="flow">
							<h2>{{ $t('membership_fee_upgrade_returning_page_headline') }}</h2>
							<p>{{ $t('membership_fee_upgrade_returning_page_text') }}</p>
						</div>
					</template>
				</IconText>

			</template>
		</ContentCard>
	</div>
	<div v-if="feeChangeFrontendFlag === 'SHOW_FEE_CHANGE_FORM'">
		<div v-if="showSuccessPage">
			<ContentCard>
				<template #content>
					<IconText>
						<template #icon><SuccessIcon/></template>
						<template #content>
							<div class="flow">
								<h2>{{ $t('membership_fee_upgrade_confirmation_headline') }}</h2>
								<AlertBox data-neutral>
									<p>
										{{ $t('membership_fee_upgrade_confirmation_summary_box' ) }}
										{{ $t( 'donation_form_payment_interval_' + currentInterval ) }}
										<strong>{{ $n( newFee / 100, { key: 'currency', currencyDisplay: 'name' }  ) }}</strong>
									</p>
								</AlertBox>
								<p>{{ $t('membership_fee_upgrade_confirmation_text') }}</p>
							</div>
						</template>
					</IconText>
				</template>
			</ContentCard>
		</div>
		<div v-else>
			<ContentCard>
				<template #heading>
					<h1>
						{{ $t('membership_fee_upgrade_page_headline', {
	 						currentInterval: $t( 'donation_form_payment_interval_' + currentInterval )
 						} ) }}
					</h1>
				</template>
				<template #content>
					<div class="field-container field-container__radio-grid flow" :data-error="isFeeValid ? null : true">
						<div class="grid" data-layout="halves">
							<div class="flow">
								<label for="suggested-amount">{{ $t('membership_fee_upgrade_amount_suggestion_label') }}</label>
								<RadioFormInput
									id="suggested-amount"
									v-model="isSuggestedAmount"
									:native-value="true"
									name="suggestedFeeAmount"
								>
									<template #label>
										{{ $n( suggestedAmountInCents / 100, 'euros' ) }}
									</template>
								</RadioFormInput>
							</div>
							<div class="flow">
								<label for="custom-amount">{{ $t('membership_fee_upgrade_custom_amount_label') }}</label>
								<TextRadioFormInput
									name="customFeeAmount"
									v-model="customAmount"
									input-id="custom-amount"
									:placeholder="$t('membership_fee_upgrade_custom_amount_placeholder')"
									:has-message="false"
									class="membership-fee-change-custom-euro-symbol"
									:show-error="feeErrorMessage !== ''"
									@blur.prevent="onBlurCustomAmount"
									@update:model-value="updateAmountFromCustom"
									:radio-checked="!isSuggestedAmount"
								/>
							</div>
						</div>
						<p class="field-container__error-text">{{ feeErrorMessage }}</p>
					</div>

					<div class="field-container flow" :data-error="showMemberNameError ? true : null">
						<TextField
							:disabled="false"
							:label="$t('membership_fee_upgrade_member_name_label')"
							label-help-text=""
							help-text=""
							name="memberName"
							input-id="memberName"
							input-type="text"
							v-model="memberName"
							:error-message="$t('membership_fee_upgrade_member_name_error_message')"
							:show-error="showMemberNameError"
							:placeholder="$t( 'form_for_example', {
								example: $t( 'donation_form_firstname_placeholder') + ' ' + $t( 'donation_form_lastname_placeholder')
							} )"
							:required="true"
						/>
					</div>
				</template>
			</ContentCard>

			<ContentCard :is-collapsable="true" class="accordion">
				<template #content>
					<Accordion>
						<AccordionItem>
							<template #title>{{ $t('membership_fee_upgrade_iban_changed_headline') }}</template>
							<template #content>
								<div class="field-container">
									<IbanField
										v-model="iban"
										:label="$t('membership_fee_upgrade_iban_changed_label')"
										:show-error="!ibanFieldIsValid"
										:bank-name="bankName"
										:bic="bic"
										@blur="validateIban"
									/>
								</div>
							</template>
						</AccordionItem>
					</Accordion>
				</template>
			</ContentCard>

			<div class="button-outside-content">
				<button class="button" @click="validateAndSubmit">{{ $t('membership_fee_upgrade_submit_button') }}</button>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, inject, nextTick, ref, watch } from 'vue';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import axios, { AxiosResponse } from 'axios';
import {
	MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL,
} from '@src/store/membership_fee/constants';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';
import IbanField from '@src/components/shared/form_fields/IbanField.vue';
import AlertBox from '@src/components/patterns/AlertBox.vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import Accordion from '@src/components/patterns/Accordion.vue';
import AccordionItem from '@src/components/patterns/AccordionItem.vue';
import type { BankValidationResource } from '@src/api/BankValidationResource';
import type { BankAccountResponse } from '@src/view_models/BankAccount';

interface Props {
	uuid: string;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: number;
	feeChangeFrontendFlag: 'SHOW_FEE_CHANGE_FORM' | 'SHOW_FEE_ALREADY_CHANGED_PAGE' | 'SHOW_ERROR_PAGE';
}
const props = defineProps<Props>();
const { t, n } = useI18n();
const bankValidationResource = inject<BankValidationResource>( 'bankValidationResource' );

const newFee = ref<number>( props.suggestedAmountInCents );
const isSuggestedAmount = ref<boolean>( true );
const customAmount = ref<string>( '' );
const isCustomAmount = ref<boolean>( false );

const isFeeValid = ref<boolean>( true );

watch( isSuggestedAmount, ( newValue: boolean ) => {
	if ( newValue ) {
		customAmount.value = '';
		isFeeValid.value = true;
	}
} );

const getFormattedCustomAmount = (): string => {
	return n( newFee.value / 100, 'decimal' );
};

const minimumAmount = computed( () => {
	const interval = props.currentInterval;
	if ( isNaN( interval ) ) {
		return 0;
	}
	const yearlyIntervalMultiplier = interval / 12;
	return MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL * yearlyIntervalMultiplier;
} );

const feeIsBelowMinimumAmount = computed( () => {
	return newFee.value < minimumAmount.value;
} );

const maxCentAmount = 100_000_00;
const feeIsTooHigh = computed( () => newFee.value > maxCentAmount );

const feeErrorMessage = computed<string>( (): string => {
	if ( feeIsBelowMinimumAmount.value ) {
		return t( 'membership_form_payment_amount_error' );
	} else if ( feeIsTooHigh.value ) {
		return t( 'membership_form_payment_amount_too_high' );
	} else {
		return '';
	}
} );

const validateCustomAmount = (): void => {
	if ( feeErrorMessage.value !== '' ) {
		isFeeValid.value = false;
	}
};

const onBlurCustomAmount = (): void => {
	if ( isSuggestedAmount.value ) {
		return;
	}
	customAmount.value = getFormattedCustomAmount();
	validateCustomAmount();
};

const updateAmountFromCustom = ( newAmount: string ) => {
	newAmount = newAmount.trim();
	if ( newAmount === '' ) {
		newFee.value = 0;
		return;
	}

	const numericalAmount = Number( newAmount.replace( /,/, '.' ) );
	if ( isNaN( numericalAmount ) ) {
		newFee.value = 0;
		return;
	}

	newFee.value = Math.trunc( numericalAmount * 100 );
	isSuggestedAmount.value = false;
	console.log( newFee.value );
};

const memberName = ref<string>( '' );

const iban = ref<string>( '' );
const ibanWasEntered = computed( () => iban.value.length > 0 );
const ibanFieldIsValid = ref<boolean>( true );
const bic = ref<string>( '' );
const bankName = ref<string>( '' );
const isSearchingForIban = ref<boolean>( false );
const showCalculatorErrorSummary = ref<boolean>( false );

const validateIban = async () => {
	isSearchingForIban.value = true;
	bankValidationResource.validateIban( {
		iban: iban.value,
	} ).then( ( response: BankAccountResponse ) => {
		ibanFieldIsValid.value = true;
		isSearchingForIban.value = false;
		bic.value = response.bic;
		bankName.value = response.bankName;
	} ).catch( () => {
		ibanFieldIsValid.value = false;
		isSearchingForIban.value = false;
		showCalculatorErrorSummary.value = true;
	} );
};

const showSuccessPage = ref<boolean>( false );

const showMemberNameError = ref<boolean>( false );

export interface FeeChangeRequest {
	uuid: string;
	memberName: string;
	amountInEuroCents: number;
	paymentType: string;
	iban?: string;
	bic?: string;
}

const getFeeChangRequest = (): FeeChangeRequest => {
	const feeChangeRequest = {
		uuid: props.uuid,
		memberName: memberName.value,
		amountInEuroCents: newFee.value,
		paymentType: 'FCH',
	};

	if ( ibanWasEntered.value ) {
		return {
			...feeChangeRequest,
			iban: iban.value,
			bic: bic.value,
		};
	}
	return feeChangeRequest;
};

const validateAndSubmit = async (): void => {

	console.log( isCustomAmount.value );

	validateCustomAmount();
	if ( !isFeeValid.value ) {
		return;
	}

	if ( memberName.value === '' ) {
		console.log( 'member name invalid' );
		showMemberNameError.value = true;
		return;
	}
	showMemberNameError.value = false;

	if ( feeIsBelowMinimumAmount.value || feeIsTooHigh.value ) {
		console.log( 'new fee invalid:' );
		console.log( newFee.value );
		return;
	}

	if ( ibanWasEntered.value ) {
		console.log("iban had been entered ");

		//TODO await validateIban result before continuing
		await validateIban();
		await nextTick();
		if ( !ibanFieldIsValid.value ) {
			console.log( "iban is invalid, stopping " );
			return;
		}
	}

	axios.post(
		'/api/v1/membership/change-fee',
		getFeeChangRequest(),
		{ headers: { 'Content-Type': 'application/json' } }
	).then( ( response: AxiosResponse<any> ) => {
		console.log( response.data );
		showSuccessPage.value = true;
		// return Promise.resolve( response.data );
	} ).catch( ( error: any ) => {
		console.log( error.data.status );
		console.log( error.data.errors );
		// return Promise.reject( error.response.data.errors[ 0 ] );
	} );

	// TODO 3. evaluate if the JSONResponse was "status": "OK" or "status":"ERR"
	// depending on the output, show success content or show error content?
};

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
$input-height: 50px;

.membership-fee-change {

	&-custom-euro-symbol {
		&:after {
			color: colors.$dark;
			content: "€";
			font-size: 16px;
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

.button-outside-content {
	margin-bottom: 18px;
}
</style>
