<template>
	<template v-if="feeChangeFrontendFlag === 'SHOW_ERROR_PAGE'">
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
	</template>
	<template v-if="feeChangeFrontendFlag === 'SHOW_FEE_ALREADY_CHANGED_PAGE'">
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
	</template>
	<template v-if="feeChangeFrontendFlag === 'SHOW_FEE_CHANGE_FORM'">
		<template v-if="showSuccessPage">
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
		</template>
		<form v-else action="#" @submit.prevent="validateAndSubmit" class="flow">
			<ContentCard>
				<template #heading>
					<h1>
						{{ $t('membership_fee_upgrade_page_headline', {
	 						currentInterval: $t( 'donation_form_payment_interval_' + currentInterval )
 						} ) }}
					</h1>
				</template>
				<template #content>
					<ErrorSummary
						:is-visible="showErrorSummary"
						:items="[
							{
								validity: isFeeValid ? Validity.VALID : Validity.INVALID,
								message: $t( 'error_summary_amount' ),
								focusElement: 'custom-amount',
								scrollElement: 'custom-amount',
							},
							{
								validity: isMemberNameValid ? Validity.VALID : Validity.INVALID,
								message: $t('membership_fee_upgrade_member_name_error_message'),
								focusElement: 'member-name',
								scrollElement: 'member-name',
							},
							{
								validity: isIbanValid ? Validity.VALID : Validity.INVALID,
								message: $t('donation_form_payment_iban_error'),
								focusElement: 'iban',
								scrollElement: 'iban',
							},
						]"
					/>
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
									@input.prevent="onCustomAmountInput"
									@update:model-value="updateAmountFromCustom"
									:radio-checked="!isSuggestedAmount"
								/>
							</div>
						</div>
						<p class="field-container__error-text">{{ feeErrorMessage }}</p>
					</div>

					<div class="field-container flow" :data-error="isMemberNameValid ? null : true">
						<TextField
							:disabled="false"
							:label="$t('membership_fee_upgrade_member_name_label')"
							label-help-text=""
							help-text=""
							name="member-name"
							input-id="member-name"
							input-type="text"
							v-model="memberName"
							:error-message="$t('membership_fee_upgrade_member_name_error_message')"
							:show-error="!isMemberNameValid"
							:placeholder="$t( 'form_for_example', {
								example: $t( 'donation_form_firstname_placeholder') + ' ' + $t( 'donation_form_lastname_placeholder')
							} )"
							@field-changed="validateMemberName"
							@blur="validateMemberName"
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
										:show-error="!isIbanValid"
										:bank-name="bankName"
										:bic="bic"
										@blur="validateIban"
										@input="onIbanInput"
									/>
								</div>
							</template>
						</AccordionItem>
					</Accordion>
				</template>
			</ContentCard>

			<div class="button-outside-content">
				<FormButton
					:is-loading="isValidating"
					button-type="submit"
				>
					{{ $t( 'membership_fee_upgrade_submit_button' ) }}
				</FormButton>
			</div>
		</form>

	</template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, inject, nextTick, ref, watch } from 'vue';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL } from '@src/store/membership_fee/constants';
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
import { FeeChangeRequest } from '@src/Domain/MembershipFeeChange/FeeChangeRequest';
import { MembershipFeeChangeResource } from '@src/api/MembershipFeeChangeResource';
import { FeeChangeResponse } from '@src/Domain/MembershipFeeChange/FeeChangeResponse';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { Validity } from '@src/view_models/Validity';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';

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
const membershipFeeChangeResource = inject<MembershipFeeChangeResource>( 'membershipFeeChangeResource' );

const newFee = ref<number>( props.suggestedAmountInCents );
const memberName = ref<string>( '' );
const isSuggestedAmount = ref<boolean>( true );
const customAmount = ref<string>( '' );
const isFeeValid = ref<boolean>( true );
const isMemberNameValid = ref<boolean>( true );
const iban = ref<string>( '' );
const bic = ref<string>( '' );
const bankName = ref<string>( '' );
const isIbanValid = ref<boolean>( true );
const ibanWasEntered = computed( () => iban.value.length > 0 );
const isValidating = ref<boolean>( false );
const showSuccessPage = ref<boolean>( false );
const showErrorSummary = ref<boolean>( false );

watch( isSuggestedAmount, ( newValue: boolean ) => {
	if ( newValue ) {
		newFee.value = props.suggestedAmountInCents;
		customAmount.value = '';
		isFeeValid.value = true;
	}
} );

watch( [ isFeeValid, isMemberNameValid, isIbanValid ], () => {
	if ( !showErrorSummary.value ) {
		return;
	}
	if ( isFeeValid.value && isMemberNameValid.value && isIbanValid.value ) {
		showErrorSummary.value = false;
	}
} );

const minimumAmount = computed( () => {
	const interval = props.currentInterval;
	if ( isNaN( interval ) ) {
		return 0;
	}
	const yearlyIntervalMultiplier = interval / 12;
	return MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL * yearlyIntervalMultiplier;
} );

const maxCentAmount = 100_000_00;
const feeIsBelowMinimumAmount = computed( () => newFee.value < minimumAmount.value );
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
	if ( feeIsBelowMinimumAmount.value || feeIsTooHigh.value ) {
		isFeeValid.value = false;
	}
};

const onBlurCustomAmount = (): void => {
	if ( isSuggestedAmount.value ) {
		return;
	}
	customAmount.value = n( newFee.value / 100, 'decimal' );
	validateCustomAmount();
};

const onCustomAmountInput = (): void => {
	isFeeValid.value = true;
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
};

const validateMemberName = (): void => {
	isMemberNameValid.value = memberName.value !== '';
};

const onIbanInput = (): void => {
	isIbanValid.value = true;
};

const validateIban = async (): Promise<void> => {
	if ( iban.value === '' ) {
		return Promise.resolve();
	}

	return bankValidationResource.validateIban( {
		iban: iban.value,
	} ).then( ( response: BankAccountResponse ) => {
		isIbanValid.value = true;
		bic.value = response.bic;
		bankName.value = response.bankName;
		return Promise.resolve();
	} ).catch( () => {
		isIbanValid.value = false;
		return Promise.resolve();
	} );
};

const newFeeChangRequest = (): FeeChangeRequest => {
	const feeChangeRequest = {
		uuid: props.uuid,
		memberName: memberName.value,
		amountInEuroCents: newFee.value,
		paymentType: 'FCH',
	};

	if ( ibanWasEntered.value ) {
		return {
			...feeChangeRequest,
			paymentType: 'BEZ',
			iban: iban.value,
			bic: bic.value,
		};
	}
	return feeChangeRequest;
};

const validateAndSubmit = async (): Promise<void> => {
	isValidating.value = true;
	showErrorSummary.value = false;

	validateCustomAmount();
	if ( memberName.value === '' ) {
		isMemberNameValid.value = false;
	}

	if ( ibanWasEntered.value ) {
		await validateIban();
		await nextTick();
	}

	if ( !isFeeValid.value || !isMemberNameValid.value || !isIbanValid.value ) {
		showErrorSummary.value = true;
		isValidating.value = false;
		return;
	}

	membershipFeeChangeResource.put( newFeeChangRequest() ).then( ( response: FeeChangeResponse ) => {
		isValidating.value = false;
		if ( response.status === 'OK' ) {
			showSuccessPage.value = true;
		} else {
			// What do we do?
		}
	} ).catch( () => {
		isValidating.value = false;
	} );
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
