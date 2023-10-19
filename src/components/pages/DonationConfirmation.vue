<template>
	<div class="donation-confirmation">
		<a class="mobile-call-to-action is-primary button" href="#membership-application-url"
			v-on:click="scrollToCallToAction"
			v-if="isMobileCallToActionButtonVisible && !isAddressModalOpen">
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
			<div class="column is-half pt-0 pb-0" v-if="!donation.isExported">
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
			<div class="column is-half pt-0 pb-0" v-else-if="addressType === 'person' || addressType === 'firma'">
				<donation-exported :address-type="currentAddressType"/>
			</div>
			<div class="column is-half pt-0 pb-0" id="become-a-member" ref="becomeAMember">
				<membership-info
					v-on:membership-cta-button-shown="isMobileCallToActionButtonVisible = false"
					v-on:membership-cta-button-hidden="isMobileCallToActionButtonVisible = true"
					:donation="donation"
				/>
			</div>
		</div>

		<ModalDialogue :visible="isAddressModalOpen" @hide="isAddressModalOpen = false">
			<AddressUpdateForm
				:countries="countries"
				:salutations="salutations"
				:donation="donation"
				:donorResource="donorResource"
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				:address-validation-patterns="addressValidationPatterns"
				@address-updated="updateAddress( $event )"
				@close="isAddressModalOpen = false"
			/>
		</ModalDialogue>

		<ModalDialogue :visible="openCommentPopUp" @hide="openCommentPopUp = false">
			<donation-comment-pop-up
				:donation="donation"
				:address-type="addressType"
				:post-comment-url="postCommentUrl"
				@disable-comment-link="commentLinkIsDisabled = true"
				@close="openCommentPopUp = false"
			/>
		</ModalDialogue>

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
import { defineComponent } from 'vue';
import BankData from '@src/components/BankData.vue';
import MembershipInfo from '@src/components/pages/donation_confirmation/MembershipInfo.vue';
import AddressUsageToggle from '@src/components/pages/donation_confirmation/AddressUsageToggle.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { Country } from '@src/view_models/Country';
import { SubmittedAddress } from '@src/view_models/Address';
import { Donation } from '@src/view_models/Donation';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import SuccessMessage from '@src/components/pages/donation_confirmation/SuccessMessage.vue';
import SuccessMessageBankTransfer from '@src/components/pages/donation_confirmation/SuccessMessageBankTransfer.vue';
import AddressKnown from '@src/components/pages/donation_confirmation/AddressKnown.vue';
import AddressAnonymous from '@src/components/pages/donation_confirmation/AddressAnonymous.vue';
import Survey from '@src/components/pages/donation_confirmation/Survey.vue';
import DonationCommentPopUp from '@src/components/pages/donation_confirmation/DonationCommentPopUp.vue';
import ChevronDownIcon from '@src/components/shared/icons/ChevronDown.vue';
import DonationExported from '@src/components/pages/donation_confirmation/DonationExported.vue';
import DonorResource from '@src/api/DonorResource';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import AddressUpdateForm from '@src/components/pages/donation_confirmation/AddressUpdateForm.vue';

export default defineComponent( {
	name: 'DonationConfirmation',
	components: {
		AddressUpdateForm,
		ModalDialogue,
		DonationExported,
		ChevronDownIcon,
		Survey,
		SuccessMessageBankTransfer,
		SuccessMessage,
		BankData,
		DonationCommentPopUp,
		MembershipInfo,
		AddressUsageToggle,
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
		cancelMembershipUrl: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		cancelDonationUrl: String,
		postCommentUrl: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		addressValidationPatterns: Object as () => AddressValidation,
		donorResource: Object as () => DonorResource,
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
