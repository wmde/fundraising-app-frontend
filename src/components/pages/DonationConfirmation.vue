<template>
	<div class="donation-confirmation">
		<div class="columns is-multiline is-variable is-2">
			<div class="column is-full pt-0 pb-0">
				<success-message v-if="!showBankTransferContent" :donation="donation"/>
				<success-message-bank-transfer v-if="showBankTransferContent" :donation="donation"/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<address-known
					v-if="!showAddressChangeContent"
					v-on:show-address-modal="showAddressModal()"
					:donation="donation"
					:address="currentAddress"
					:address-type="currentAddressType"
					:countries="countries"
					:salutations="salutations"
				/>
				<address-anonymous
					v-if="showAddressChangeContent"
					v-on:show-address-modal="showAddressModal()"
				/>

				<survey/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<membership-info :donation="donation"></membership-info>
			</div>
		</div>

		<b-modal :active.sync="isAddressModalOpen" scroll="keep" class="address-modal" has-modal-card>
			<address-modal
				:countries="countries"
				:salutations="salutations"
				:donation="donation"
				:updateDonorUrl="updateDonorUrl"
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:has-errored="addressChangeHasErrored"
				:has-succeeded="addressChangeHasSucceeded"
				:address-validation-patterns="addressValidationPatterns"
				v-on:address-update-failed="addressChangeHasErrored = true"
				v-on:address-updated="updateAddress( $event )"
			>
			</address-modal>
		</b-modal>
		<donation-confirmation-banner-notifier :cookieDuration="donation.cookieDuration"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import BankData from '@/components/BankData.vue';
import DonationSummary from '@/components/pages/donation_confirmation/DonationSummary.vue';
import MembershipInfo from '@/components/pages/donation_confirmation/MembershipInfo.vue';
import PaymentNotice from '@/components/pages/donation_confirmation/PaymentNotice.vue';
import SummaryLinks from '@/components/pages/donation_confirmation/SummaryLinks.vue';
import AddressUsageToggle from '@/components/pages/donation_confirmation/AddressUsageToggle.vue';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';
import AddressModal from '@/components/pages/donation_confirmation/AddressModal.vue';
import { Country } from '@/view_models/Country';
import { SubmittedAddress } from '@/view_models/Address';
import { Donation } from '@/view_models/Donation';
import { AddressValidation } from '@/view_models/Validation';
import { Salutation } from '@/view_models/Salutation';
import SuccessMessage from '@/components/pages/donation_confirmation/SuccessMessage.vue';
import SuccessMessageBankTransfer from '@/components/pages/donation_confirmation/SuccessMessageBankTransfer.vue';
import AddressKnown from '@/components/pages/donation_confirmation/AddressKnown.vue';
import AddressAnonymous from '@/components/pages/donation_confirmation/AddressAnonymous.vue';
import Survey from '@/components/pages/donation_confirmation/Survey.vue';
import DonationConfirmationBannerNotifier
	from '@/components/pages/donation_confirmation/DonationConfirmationBannerNotifier.vue';

export default Vue.extend( {
	name: 'DonationConfirmation',
	components: {
		Survey,
		SuccessMessageBankTransfer,
		SuccessMessage,
		DonationConfirmationBannerNotifier,
		BankData,
		DonationSummary,
		MembershipInfo,
		PaymentNotice,
		SummaryLinks,
		AddressUsageToggle,
		AddressModal,
		AddressKnown,
		AddressAnonymous,
	},
	data: function () {
		return {
			isAddressModalOpen: false,
			addressChangeHasErrored: false,
			addressChangeHasSucceeded: false,
			currentAddress: this.$props.address,
			currentAddressType: this.$props.addressType,
		};
	},
	props: {
		donation: Object as () => Donation,
		address: Object,
		addressType: String,
		updateDonorUrl: String,
		cancelMembershipUrl: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		cancelDonationUrl: String,
		postCommentUrl: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		addressValidationPatterns: Object as () => AddressValidation,
	},
	methods: {
		showAddressModal: function () {
			this.$data.isAddressModalOpen = true;
		},
		updateAddress: function ( submittedAddress: SubmittedAddress ) {
			this.$data.addressChangeHasSucceeded = true;
			this.$data.currentAddress = submittedAddress.addressData;
			this.$data.currentAddressType = submittedAddress.addressType;
		},
		getEmail: function () {
			if ( this.$data.currentAddressType === 'anonym' ) {
				return '';
			}
			if ( this.$data.currentAddress.email ) {
				return this.$t( 'donation_confirmation_topbox_email', { email: this.$data.currentAddress.email } );
			}
			return this.$t( 'donation_confirmation_review_email_missing' );
		},
	},
	computed: {
		showBankTransferContent: function () {
			return this.$props.donation.paymentType === 'UEB';
		},
		showAddressChangeContent: function () {
			return this.$props.addressType === addressTypeName( AddressTypeModel.ANON ) &&
					!this.$data.addressChangeHasErrored && !this.$data.addressChangeHasSucceeded;
		},
		inlineSummaryLanguageItem: function () {
			switch ( this.$props.addressType ) {
				case AddressTypeModel.ANON:
				case AddressTypeModel.UNSET:
					return 'donation_confirmation_inline_summary_anonymous';
				case AddressTypeModel.EMAIL:
					return 'donation_confirmation_inline_summary_email';
				case AddressTypeModel.COMPANY:
				case AddressTypeModel.PERSON:
				default:
					return 'donation_confirmation_inline_summary_address';
			}
		},
	},
} );
</script>

<style lang="scss">
	@import "../../scss/variables";

	.donation-confirmation {
		margin-left: -18px;
		margin-right: -18px;

		&-card {
			border: 1px solid $fun-color-gray-mid;
			border-radius: 2px;
		}
	}

	.donation {
		&-summary {
			&-wrapper {
				border: 1px solid $fun-color-gray-mid;
				border-radius: 2px;

				.address-change-button {
					width: 100%;
					white-space: normal;
				}
			}

			.bank-data-content {
				p {
					line-height: 2em;
				}
			}
		}
	}
</style>
