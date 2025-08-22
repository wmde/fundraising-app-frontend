<template>
	<div
		class="payment-page"
		aria-live="assertive"
		aria-labelledby="membership-form-heading membership-form-subheading"
		tabindex="-1"
		ref="pageRef"
	>
		<form>
			<ContentCard>

				<template #heading>
					<h1 id="membership-form-heading">{{ $t( 'membership_form_headline' ) }}</h1>
					<h2 id="membership-form-subheading">{{ $t( 'membership_form_payment_subheading' ) }}</h2>
				</template>

				<template #content>
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
								validity: store.state.bankdata.validity.iban,
								message: $t( 'donation_form_payment_iban_error' ),
								focusElement: 'iban',
								scrollElement: 'iban-scroll-target'
							},
						]"
					/>

					<MembershipTypeField
						v-if="showMembershipTypeOption"
						v-model="membershipTypeModel"
						:disabledMembershipTypes="disabledMembershipTypes"
					/>

					<AddressType
						@field-changed="setAddressType( $event )"
						:disabledAddressTypes="disabledAddressTypes"
						:is-direct-debit="isDirectDebitPayment"
						:initial-address-type="addressType"
						:address-type-is-invalid="false"
					/>

					<Payment
						:payment-amounts="props.paymentAmounts"
						:payment-intervals="props.paymentIntervals"
						:payment-types="props.paymentTypes"
						:validate-fee-url="props.validateFeeUrl.toString()"
						:validate-bank-data-url="props.validateBankDataUrl.toString()"
						:validate-legacy-bank-data-url="props.validateLegacyBankDataUrl.toString()"
					/>

					<FormButton
						@click="next()"
						id="next"
						:is-loading="store.getters.isValidating"
					>
						{{ $t('donation_form_section_continue') }}
					</FormButton>
				</template>
			</ContentCard>
		</form>
	</div>
</template>

<script setup lang="ts">
import Payment from '@src/components/pages/membership_form/Payment.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { action } from '@src/store/util';
import { useStore } from 'vuex';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, onMounted, ref, watch } from 'vue';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressTypeFunctions } from '@src/components/pages/membership_form/AddressTypeFunctions';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { useMembershipTypeModel } from '@src/components/pages/membership_form/useMembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { Validity } from '@src/view_models/Validity';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	validateFeeUrl: String;
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	validateBankDataUrl: String;
	validateLegacyBankDataUrl: String;
	showMembershipTypeOption: Boolean;
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

const membershipDataIsValid = ref<boolean>( true );
const paymentDataIsValid = ref<boolean>( true );
const bankDataIsValid = ref<boolean>( true );
const showErrorSummary = computed<boolean>( () => !membershipDataIsValid.value || !paymentDataIsValid.value || !bankDataIsValid.value );
const membershipTypeModel = useMembershipTypeModel( store );
const disabledMembershipTypes = computed(
	(): MembershipTypeModel[] => {
		return store.state.membership_address.addressType === AddressTypeModel.COMPANY ? [ MembershipTypeModel.ACTIVE ] : [];
	}
);

const isDirectDebitPayment = computed( (): boolean => store.state.membership_fee.values.type === 'BEZ' );

const next = async (): Promise<any> => {
	waitForServerValidationToFinish( store ).then( () => {
		membershipDataIsValid.value = true;
		paymentDataIsValid.value = true;
		bankDataIsValid.value = true;

		const validationActions = [ store.dispatch( action( 'membership_fee', 'markEmptyValuesAsInvalid' ) ) ];

		if ( isDirectDebitPayment.value ) {
			validationActions.push( store.dispatch( action( 'bankdata', 'markEmptyIbanAsInvalid' ) ) );
		}

		return Promise.all( validationActions ).then( () => {
			if ( !store.getters[ 'membership_address/membershipTypeIsValid' ] ) {
				membershipDataIsValid.value = false;
			}

			if ( !store.getters.paymentDataIsValid ) {
				paymentDataIsValid.value = false;
			}

			if ( store.state.bankdata.validity.iban !== Validity.VALID ) {
				bankDataIsValid.value = false;
			}

			if ( membershipDataIsValid.value && paymentDataIsValid.value && bankDataIsValid.value ) {
				emit( 'next-page' );
			}
		} );
	} );
};

store.watch( ( state, getters ) => getters[ 'membership_address/membershipTypeIsValid' ], ( isValid: boolean ) => {
	if ( !membershipDataIsValid.value && isValid ) {
		membershipDataIsValid.value = true;
	}
} );

store.watch( ( state, getters ) => getters.paymentDataIsValid, ( isValid: boolean ) => {
	if ( !paymentDataIsValid.value && isValid ) {
		paymentDataIsValid.value = true;
	}
} );

watch( () => store.state.bankdata.validity.iban, ( validity: Validity ) => {
	if ( !bankDataIsValid.value && validity === Validity.VALID ) {
		bankDataIsValid.value = true;
	}
} );

</script>
