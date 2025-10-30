<template>
	<ErrorMessage v-if="feeChangeFrontendFlag === 'SHOW_ERROR_PAGE'"/>
	<FeeAlreadyChangedMessage v-else-if="feeChangeFrontendFlag === 'SHOW_FEE_ALREADY_CHANGED_PAGE'"/>
	<SuccessMessage :new-fee="newFee" :current-interval="currentInterval" v-else-if="feeChangeFrontendFlag === 'SHOW_FEE_CHANGE_FORM' && showSuccessPage"/>
	<form v-else action="#" @submit.prevent="validateAndSubmit" class="flow">
		<ContentCard class="membership-fee-form-page">
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
							scrollElement: 'upgrade-form-custom-amount',
						},
						{
							validity: isMemberNameValid ? Validity.VALID : Validity.INVALID,
							message: $t('membership_fee_upgrade_member_name_error_message'),
							focusElement: 'member-name',
							scrollElement: 'upgrade-form-member-name',
						},
						{
							validity: isIbanValid ? Validity.VALID : Validity.INVALID,
							message: $t('donation_form_payment_iban_error'),
							focusElement: 'iban',
							scrollElement: 'payment-form-iban',
						},
					]"
				/>

				<SuggestedAmountField
					v-model="newFee"
					:is-valid="isFeeValid"
					:suggested-amount-in-cents="suggestedAmountInCents"
					:suggested-amount-label="$t('membership_fee_upgrade_amount_suggestion_label')"
					:custom-amount-label="$t('membership_fee_upgrade_custom_amount_label')"
					:custom-amount-placeholder="$t( 'form_for_example', { example: $n( suggestedAmountInCents / 100 * 1.25, 'integer' ) } )"
					:error-message="feeErrorMessage"
					id="upgrade-form-custom-amount"
					:is-max-width-field="true"
					@custom-amount-changed="validateAmount"
					@suggested-selected="isFeeValid = true"
				/>

				<TextField
					:disabled="false"
					:label="$t('membership_fee_upgrade_member_name_label')"
					label-help-text=""
					help-text=""
					name="member-name"
					id="upgrade-form-member-name"
					input-id="member-name"
					input-type="text"
					v-model="memberName"
					:error-message="$t('membership_fee_upgrade_member_name_error_message')"
					:show-error="!isMemberNameValid"
					:placeholder="$t( 'form_for_example', {
						example: $t( 'donation_form_firstname_placeholder') + ' ' + $t( 'donation_form_lastname_placeholder')
					} )"
					:is-max-width-field="true"
					@field-changed="validateMemberName"
					@blur="validateMemberName"
				/>
			</template>
		</ContentCard>

		<ContentCard :is-collapsable="true">
			<template #content>
				<Accordion>
					<AccordionItem>
						<template #title>{{ $t('membership_fee_upgrade_iban_changed_headline') }}</template>
						<template #content>
							<div class="field-container">
								<IbanField
									v-model="iban"
									:show-error="!isIbanValid"
									:bank-name="bankName"
									:bic="bic"
									:is-max-width-field="true"
									@blur="validateIban"
									@input="onIbanInput"
								>
									<template #label>
										{{ $t('membership_fee_upgrade_iban_changed_label') }}
									</template>
								</IbanField>
							</div>
						</template>
					</AccordionItem>
				</Accordion>
			</template>
		</ContentCard>

		<div>
			<FormButton
				:is-loading="isValidating"
				button-type="submit"
				id="fee-change-submit-button"
			>
				{{ $t( 'membership_fee_upgrade_submit_button' ) }}
			</FormButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, inject, nextTick, ref, watch } from 'vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import { MEMBERSHIP_MAXIMUM_CENTS, MEMBERSHIP_MINIMUM_CENTS_FEE_PERSONAL } from '@src/store/membership_fee/constants';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IbanField from '@src/components/shared/form_fields/IbanField.vue';
import Accordion from '@src/components/patterns/Accordion.vue';
import AccordionItem from '@src/components/patterns/AccordionItem.vue';
import type { BankValidationResource } from '@src/api/BankValidationResource';
import type { BankAccountResponse } from '@src/view_models/BankAccount';
import { FeeChangeRequest } from '@src/Domain/MembershipFeeChange/FeeChangeRequest';
import { MembershipFeeChangeResource } from '@src/api/MembershipFeeChangeResource';
import { FeeChangeResponse } from '@src/Domain/MembershipFeeChange/FeeChangeResponse';
import ErrorSummary from '@src/components/shared/ErrorSummary.vue';
import { Validity } from '@src/view_models/Validity';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import ErrorMessage from '@src/components/pages/membership_fee_change/ErrorMessage.vue';
import FeeAlreadyChangedMessage from '@src/components/pages/membership_fee_change/FeeAlreadyChangedMessage.vue';
import SuccessMessage from '@src/components/pages/membership_fee_change/SuccessMessage.vue';
import SuggestedAmountField from '@src/components/shared/form_fields/SuggestedAmountField.vue';

interface Props {
	uuid: string;
	currentAmountInCents: number;
	suggestedAmountInCents: number;
	currentInterval: number;
	feeChangeFrontendFlag: 'SHOW_FEE_CHANGE_FORM' | 'SHOW_FEE_ALREADY_CHANGED_PAGE' | 'SHOW_ERROR_PAGE';
}
const props = defineProps<Props>();
const { t } = useI18n();
const bankValidationResource = inject<BankValidationResource>( 'bankValidationResource' );
const membershipFeeChangeResource = inject<MembershipFeeChangeResource>( 'membershipFeeChangeResource' );

const newFee = ref<number>( props.suggestedAmountInCents );
const isFeeValid = ref<boolean>( true );
const memberName = ref<string>( '' );
const isMemberNameValid = ref<boolean>( true );
const iban = ref<string>( '' );
const bic = ref<string>( '' );
const bankName = ref<string>( '' );
const isIbanValid = ref<boolean>( true );
const ibanHasValue = computed( () => iban.value.length > 0 );
const isValidating = ref<boolean>( false );
const showSuccessPage = ref<boolean>( false );
const showErrorSummary = ref<boolean>( false );

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

const feeIsBelowMinimumAmount = computed( () => newFee.value < minimumAmount.value );
const feeIsTooHigh = computed( () => newFee.value > MEMBERSHIP_MAXIMUM_CENTS );

const feeErrorMessage = computed<string>( (): string => {
	if ( feeIsBelowMinimumAmount.value ) {
		return t( 'membership_form_payment_amount_error' );
	} else if ( feeIsTooHigh.value ) {
		return t( 'membership_form_payment_amount_too_high' );
	} else {
		return '';
	}
} );

const validateAmount = (): void => {
	isFeeValid.value = !feeIsBelowMinimumAmount.value && !feeIsTooHigh.value;
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

const newFeeChangeRequest = (): FeeChangeRequest => {
	const feeChangeRequest = {
		uuid: props.uuid,
		memberName: memberName.value,
		amountInEuroCents: newFee.value,
		paymentType: 'FCH',
	};

	if ( ibanHasValue.value ) {
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

	validateAmount();
	if ( memberName.value === '' ) {
		isMemberNameValid.value = false;
	}

	if ( ibanHasValue.value ) {
		await validateIban();
		await nextTick();
	}

	if ( !isFeeValid.value || !isMemberNameValid.value || !isIbanValid.value ) {
		showErrorSummary.value = true;
		isValidating.value = false;
		return;
	}

	membershipFeeChangeResource.put( newFeeChangeRequest() ).then( ( response: FeeChangeResponse ) => {
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
</style>
