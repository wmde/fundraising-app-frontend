<template>
	<div class="payment-page">
		<h1 class="title is-size-1">{{ $t('membership_form_headline' ) }}</h1>
		<membership-type v-if="showMembershipTypeOption"/>
		<div class="has-margin-top-36">
			<AddressType :initial-value="addressTypeFromStore" v-on:address-type="sendAddressTypeToStore( $event )" />
		</div>
		<Payment
			class="has-margin-top-36"
			:payment-amounts="props.paymentAmounts"
			:payment-intervals="props.paymentIntervals"
			:payment-types="props.paymentTypes"
			:validate-fee-url="props.validateFeeUrl"
			:validate-bank-data-url="props.validateBankDataUrl"
			:validate-legacy-bank-data-url="props.validateLegacyBankDataUrl"
		/>
		<div class="level has-margin-top-18">
			<div class="level-left">
				<FunButton
					id="next"
					:class="[ 'is-form-input-width is-primary is-main level-item', { 'is-loading' : store.getters.isValidating } ]"
					@click="next()"
				>
					{{ $t('donation_form_section_continue') }}
				</FunButton>
			</div>
		</div>
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
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { setAddressType } from '@src/store/membership_address/actionTypes';
import { computed } from 'vue';

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

const addressTypeFromStore = computed( () => {
	return store.getters[ NS_MEMBERSHIP_ADDRESS + '/addressType' ];
} );

const next = async (): Promise<any> => {
	waitForServerValidationToFinish( store ).then( () => {
		const storeCleanupActions = [ store.dispatch( action( NS_MEMBERSHIP_FEE, markEmptyFeeValuesAsInvalid ) ) ];
		if ( store.state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' ) {
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

function sendAddressTypeToStore( newAddressType: AddressTypeModel ): void {
	store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressType ), newAddressType );
}

</script>
