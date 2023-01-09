<template>
	<div class="payment-page">
		<h1 class="title is-size-1">{{ $t('membership_form_headline' ) }}</h1>
    <membership-type v-if="showMembershipTypeOption"></membership-type>
		<div class="has-margin-top-36">
			<address-type :initial-value="addressType" v-on:address-type="setAddressType( $event )" />
		</div>
		<payment class="has-margin-top-36" v-bind="$props"></payment>
		<div class="level has-margin-top-18">
			<div class="level-left">
				<b-button id="next" :class="[ 'is-form-input-width', $store.getters.isValidating ? 'is-loading' : '', 'level-item']"
          @click="next()"
          type="is-primary is-main">
					{{ $t('donation_form_section_continue') }}
				</b-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import MembershipType from '@/components/pages/membership_form//MembershipType.vue';
import Payment from '@/components/pages/membership_form/Payment.vue';
import AddressType from '@/components/pages/membership_form/AddressType.vue';
import { NS_BANKDATA, NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@/store/namespaces';
import { action } from '@/store/util';
import { markEmptyValuesAsInvalid as markEmptyFeeValuesAsInvalid } from '@/store/membership_fee/actionTypes';
import { markEmptyValuesAsInvalid as markemptyBankDataValuesAsInvalid } from '@/store/bankdata/actionTypes';
import { waitForServerValidationToFinish } from '@/wait_for_server_validation';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { setAddressType } from '@/store/membership_address/actionTypes';
import { mapGetters } from 'vuex';

export default Vue.extend( {
	name: 'PaymentPage',
	components: {
		AddressType,
		Payment,
		MembershipType,
	},
	props: {
		validateFeeUrl: String,
		paymentAmounts: Array as () => Array<String>,
		paymentIntervals: Array as () => Array<Number>,
		paymentTypes: Array as () => Array<String>,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		showMembershipTypeOption: Boolean,
	},
	methods: {
		next() {
			waitForServerValidationToFinish( this.$store ).then( () => {
				const storeCleanupActions = [ this.$store.dispatch( action( NS_MEMBERSHIP_FEE, markEmptyFeeValuesAsInvalid ) ) ];
				if ( this.$store.state[ NS_MEMBERSHIP_FEE ].values.type === 'BEZ' ) {
					storeCleanupActions.push( this.$store.dispatch( action( NS_BANKDATA, markemptyBankDataValuesAsInvalid ) ) );
				}
				return Promise.all( storeCleanupActions ).then( () => {
					if ( this.$store.getters.paymentDataIsValid && this.$store.getters[ NS_MEMBERSHIP_ADDRESS + '/membershipTypeIsValid' ] ) {
						this.$emit( 'next-page' );
					} else {
						document.getElementsByClassName( 'is-danger' )[ 0 ].scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
					}
				} );
			} );
		},
		setAddressType( addressType: AddressTypeModel ): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressType ), addressType );
		},
	},
	computed: {
		...mapGetters( NS_MEMBERSHIP_ADDRESS, [
			'addressType',
		] ),
	},
} );
</script>
