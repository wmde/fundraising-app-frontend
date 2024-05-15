<template>
	<div class="payment-page">
		<h1 class="title is-size-1">{{ $t('membership_form_headline' ) }}</h1>

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
		<FormSection title="" title-margin="small">
			<FormButton
				@click="next()"
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
import { markEmptyValuesAsInvalid as markEmptyFeeValuesAsInvalid } from '@src/store/membership_fee/actionTypes';
import { markEmptyValuesAsInvalid as markemptyBankDataValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { useStore } from 'vuex';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, onMounted } from 'vue';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressTypeFunctions } from '@src/components/pages/membership_form/AddressTypeFunctions';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import MembershipTypeField from '@src/components/pages/membership_form/MembershipTypeField.vue';
import { useMembershipTypeModel } from '@src/components/pages/membership_form/useMembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';

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

onMounted( trackDynamicForm );

const {
	disabledAddressTypes,
	addressType,
	setAddressType,
} = useAddressTypeFunctions( store );

const membershipTypeModel = useMembershipTypeModel( store );
const disabledMembershipTypes = computed(
	(): MembershipTypeModel[] => {
		return store.state[ NS_MEMBERSHIP_ADDRESS ].addressType === AddressTypeModel.COMPANY ? [ MembershipTypeModel.ACTIVE ] : [];
	}
);

const isDirectDebitPayment = computed( (): boolean => store.state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' );

const next = async (): Promise<any> => {
	waitForServerValidationToFinish( store ).then( () => {
		const storeCleanupActions = [ store.dispatch( action( NS_MEMBERSHIP_FEE, markEmptyFeeValuesAsInvalid ) ) ];
		if ( isDirectDebitPayment ) {
			storeCleanupActions.push( store.dispatch( action( NS_BANKDATA, markemptyBankDataValuesAsInvalid ) ) );
		}
		return Promise.all( storeCleanupActions ).then( () => {
			if ( store.getters.paymentDataIsValid && store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipTypeIsValid' ] ) {
				emit( 'next-page' );
			} else {
				document.getElementsByClassName( 'is-danger' )[ 0 ].scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
			}
		} );
	} );
};

</script>
