<template>
	<div
		class="payment-page"
		aria-live="assertive"
		aria-labelledby="membership-form-heading membership-form-subheading"
		tabindex="-1"
		ref="pageRef"
	>

		<h1 id="membership-form-heading" class="form-title">{{ $t( 'membership_form_headline' ) }}</h1>
		<h2 id="membership-form-subheading" class="form-subtitle">{{ $t( 'membership_form_payment_subheading' ) }}</h2>

		<FormSection v-if="showMembershipTypeOption" title-margin="x-small">
			<MembershipTypeField
				v-model="membershipTypeModel"
				:disabledMembershipTypes="disabledMembershipTypes"
			/>
		</FormSection>

		<FormSection title-margin="small">
			<AddressType
				@field-changed="setAddressType( $event )"
				:disabledAddressTypes="disabledAddressTypes"
				:is-direct-debit="isDirectDebitPayment"
				:initial-address-type="addressType"
				:address-type-is-invalid="false"
			/>
		</FormSection>

		<Payment
			:payment-amounts="props.paymentAmounts"
			:payment-intervals="props.paymentIntervals"
			:payment-types="props.paymentTypes"
			:validate-fee-url="props.validateFeeUrl.toString()"
			:validate-bank-data-url="props.validateBankDataUrl.toString()"
			:validate-legacy-bank-data-url="props.validateLegacyBankDataUrl.toString()"
		/>

		<ErrorSummary
			:is-visible="showErrorSummary"
			:items="[
				{
					validity: store.state.membership_fee.validity.interval,
					message: $t( 'error_summary_interval' ),
					focusElement: 'interval-0',
					scrollElement: 'payment-form-interval-scroll-target'
				},
				{
					validity: store.state.membership_fee.validity.fee,
					message: $t( 'error_summary_amount' ),
					focusElement: 'amount-500',
					scrollElement: 'payment-form-amount-scroll-target'
				},
				{
					validity: store.state.bankdata.validity.bankdata,
					message: $t( 'error_summary_iban' ),
					focusElement: 'iban',
					scrollElement: 'payment-form-iban-scroll-target'
				}
			]"
		/>

		<FormSection title="" title-margin="small">
			<FormButton
				@click="next()"
				id="next"
				:is-loading="store.getters.isValidating"
			>
				{{ $t('donation_form_section_continue') }}
			</FormButton>
		</FormSection>
	</div>
</template>

<script setup lang="ts">
import Payment from '@src/components/pages/membership_form/Payment.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { NS_BANKDATA, NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { action } from '@src/store/util';
import { useStore } from 'vuex';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, onMounted, ref } from 'vue';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressTypeFunctions } from '@src/components/pages/membership_form/AddressTypeFunctions';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { useMembershipTypeModel } from '@src/components/pages/membership_form/useMembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';

interface Props {
	validateFeeUrl: String,
	paymentAmounts: number[],
	paymentIntervals: number[],
	paymentTypes: string[];
	validateBankDataUrl: String,
	validateLegacyBankDataUrl: String,
	showMembershipTypeOption: Boolean,
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'next-page' ] );
const store = useStore();
const pageRef = ref<HTMLElement>( null );
defineExpose( { focus: (): void => pageRef.value.focus() } );

onMounted( trackDynamicForm );

const {
	disabledAddressTypes,
	addressType,
	setAddressType,
} = useAddressTypeFunctions( store );

const showErrorSummary = ref<boolean>( false );
const membershipTypeModel = useMembershipTypeModel( store );
const disabledMembershipTypes = computed(
	(): MembershipTypeModel[] => {
		return store.state[ NS_MEMBERSHIP_ADDRESS ].addressType === AddressTypeModel.COMPANY ? [ MembershipTypeModel.ACTIVE ] : [];
	}
);

const isDirectDebitPayment = computed( (): boolean => store.state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' );

const next = async (): Promise<any> => {
	waitForServerValidationToFinish( store ).then( () => {
		const storeCleanupActions = [ store.dispatch( action( NS_MEMBERSHIP_FEE, 'markEmptyValuesAsInvalid' ) ) ];
		if ( isDirectDebitPayment ) {
			storeCleanupActions.push( store.dispatch( action( NS_BANKDATA, 'markEmptyFieldsAsInvalid' ) ) );
		}
		return Promise.all( storeCleanupActions ).then( () => {
			if ( store.getters.paymentDataIsValid && store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipTypeIsValid' ] ) {
				emit( 'next-page' );
			} else {
				showErrorSummary.value = true;
			}
		} );
	} );
};

store.watch( ( state, getters ) => getters.paymentDataIsValid, ( isValid: boolean ) => {
	if ( showErrorSummary.value && isValid ) {
		showErrorSummary.value = false;
	}
} );

</script>
