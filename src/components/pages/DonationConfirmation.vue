<template>
	<div class="donation-confirmation">
		<div class="columns is-multiline is-variable is-2">
			<div class="column is-full pt-0 pb-0">
				<success-message-bank-transfer v-if="showBankTransferContent" :donation="donation"/>
				<success-message
					v-else
					:donation="donation"
					:comment-link-is-disabled="commentLinkIsDisabled"
					v-on:show-comment-modal="showCommentModal()"
				/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<address-known
					v-if="showAddress"
					v-on:show-address-modal="showAddressModal()"
					:donation="donation"
					:address="currentAddress"
					:address-type="currentAddressType"
					:countries="countries"
					:salutations="salutations"
				/>
				<address-anonymous v-else v-on:show-address-modal="showAddressModal()"/>

				<survey/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<membership-info :donation="donation"></membership-info>
			</div>

			<div class="column is-half">
				<div class="donation-cta">
					<div v-if="showAddressChangeContent">
						<p class="has-margin-bottom-18"><strong>{{ $t( 'donation_confirmation_cta_title_alt' ) }}</strong></p>
						<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_cta_summary_alt' ) }}</p>
						<b-button
							id="address-change-button"
							class="address-change-button"
							@click="showAddressModal()"
							type="is-primary is-main"
						>
							{{ $t('donation_confirmation_address_update_button_alt') }}
						</b-button>
						<address-usage-toggle></address-usage-toggle>
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
					<div class="donation-summary-intro" v-if="!currentAddress.isAnonymous">
						<div><strong>{{ $t( 'donation_confirmation_summary_title_alt' ) }}</strong></div>
					</div>
					<div class="donation-summary">
						<donation-summary
							v-if="!showAddressChangeContent"
							:address="currentAddress"
							:address-type="currentAddressType"
							:payment="donation"
							:countries="countries"
							:salutations="salutations"
						/>
						<donation-summary
							v-if="!showAddressChangeContent"
							:address="currentAddress"
							:address-type="currentAddressType"
							:payment="donation"
							:countries="countries"
							:salutations="salutations"
							:language-item="inlineSummaryLanguageItem"
						/>
					</div>
					<div class="payment-email" v-html="getEmail()"></div>
				</div>
			</div>
		</div>
		<membership-info :donation="donation"></membership-info>
		<b-modal :active.sync="isAddressModalOpen" scroll="keep" class="address-modal" has-modal-card>
			<address-modal
				:countries="countries"
				:salutations="salutations"
				:donation="donation"
				:updateDonorUrl="updateDonorUrl"
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:address-validation-patterns="addressValidationPatterns"
				v-on:address-updated="updateAddress( $event )"
			>
			</address-modal>
		</b-modal>

		<b-modal :active.sync="openCommentPopUp" scroll="keep" has-modal-card>
			<donation-comment-pop-up
				v-on:disable-comment-link="commentLinkIsDisabled = true"
				v-if="openCommentPopUp"
				:donation="donation"
				:address-type="addressType"
				:post-comment-url="postCommentUrl"
			/>
		</b-modal>
		<donation-confirmation-banner-notifier :cookieDuration="donation.cookieDuration"/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import BankData from '@/components/BankData.vue';
import MembershipInfo from '@/components/pages/donation_confirmation/MembershipInfo.vue';
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
import DonationCommentPopUp from '@/components/DonationCommentPopUp.vue';
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
		DonationCommentPopUp,
		MembershipInfo,
		SummaryLinks,
		AddressUsageToggle,
		AddressModal,
		AddressKnown,
		AddressAnonymous,
	},
	data: function () {
		return {
			isAddressModalOpen: false,
			currentAddress: this.$props.address,
			currentAddressType: this.$props.addressType,
			openCommentPopUp: false,
			commentLinkIsDisabled: false,
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
			this.$data.currentAddress = submittedAddress.addressData;
			this.$data.currentAddressType = submittedAddress.addressType;
		},
		showCommentModal(): void {
			if ( !this.$data.commentLinkIsDisabled ) {
				this.$data.openCommentPopUp = true;
			}
		},
	},
	computed: {
		showBankTransferContent: function () {
			return this.$props.donation.paymentType === 'UEB';
		},
		showAddress: function () {
			return this.$data.currentAddressType !== addressTypeName( AddressTypeModel.ANON ) &&
				this.$data.currentAddressType !== addressTypeName( AddressTypeModel.EMAIL );
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

		h2 {
			line-height: 25px;
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
