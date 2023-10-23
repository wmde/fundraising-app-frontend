<template>
	<div class="payment-page">
		<h1 class="title is-size-1">{{ $t('membership_form_headline' ) }}</h1>
		<membership-type v-if="showMembershipTypeOption"/>

		<FormSection :title="$t('membership_form_section_address_header_type')" title-margin="small">
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
			<div class="level-left">
				<FunButton
					id="next"
					:class="[ 'is-form-input-width is-primary is-main level-item', { 'is-loading' : store.getters.isValidating } ]"
					@click="next()"
				>
					{{ $t('donation_form_section_continue') }}
				</FunButton>
			</div>
		</FormSection>
	</div>
</template>

<script setup lang="ts">
import MembershipType from '@src/components/pages/membership_form//MembershipType.vue';
import Payment from '@src/components/pages/membership_form/Payment.vue';
import AddressType from '@src/components/pages/membership_form/AddressType.vue';
import { NS_BANKDATA, NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { action } from '@src/store/util';
import { markEmptyValuesAsInvalid as markEmptyFeeValuesAsInvalid } from '@src/store/membership_fee/actionTypes';
import { markEmptyValuesAsInvalid as markemptyBankDataValuesAsInvalid } from '@src/store/bankdata/actionTypes';
import { useStore } from 'vuex';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import { waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { computed, onMounted } from 'vue';
import { trackDynamicForm } from '@src/util/tracking';
import { useAddressTypeFunctions } from '@src/components/pages/membership_form/AddressTypeFunctions';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';

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
