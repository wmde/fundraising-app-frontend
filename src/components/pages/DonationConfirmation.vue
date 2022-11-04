<template>
	<div class="donation-confirmation">
		<a class="mobile-call-to-action is-primary button" href="#membership-application-url"
			v-on:click="scrollToCallToAction"
			v-if="isMobileCallToActionButtonVisible">
			Jetzt Fördermitglied werden
			<chevron-down-icon/>
		</a>

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

			</div>
			<div class="column is-half pt-0 pb-0" id="become-a-member" ref="becomeAMember">
				<membership-info
					v-on:membership-cta-button-shown="isMobileCallToActionButtonVisible = false"
					v-on:membership-cta-button-hidden="isMobileCallToActionButtonVisible = true"
					:donation="donation"
				/>
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

		<img
			:src="'https://de.wikipedia.org/wiki/Special:HideBanners?duration=' + donation.cookieDuration + '&reason=donate'"
			alt=""
			width="0"
			height="0"
		/>
		<img src="https://bruce.wikipedia.de/finish-donation?c=fundraising"
			alt=""
			width="0"
			height="0"
		/>
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
import ChevronDownIcon from '@/components/shared/icons/ChevronDown.vue';

export default Vue.extend( {
	name: 'DonationConfirmation',
	components: {
		ChevronDownIcon,
		Survey,
		SuccessMessageBankTransfer,
		SuccessMessage,
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
			isMobileCallToActionButtonVisible: true,
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
			this.$data.isAddressModalOpen = false;
		},
		showCommentModal(): void {
			if ( !this.$data.commentLinkIsDisabled ) {
				this.$data.openCommentPopUp = true;
			}
		},
		scrollToCallToAction( e: Event ): void {
			e.preventDefault();
			window.scrollTo( {
				left: 0,
				top: ( this.$refs.becomeAMember as any ).offsetTop,
				behavior: 'smooth',
			} );
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

.mobile-call-to-action {
	position: fixed;
	bottom: 0;
	height: 64px;
	width: 100%;
	padding: 0 10px;
	line-height: 64px;
	z-index: 1000;
	font-weight: bold;
	left: 0;

	svg {
		margin-left: 10px;
	}
}
</style>
