<template>
	<div class="donation-confirmation">
		<a class="mobile-call-to-action is-primary button" href="#membership-application-url"
			v-if="isMobileCallToActionButtonVisible && !isAddressModalOpen"
			v-on:click="scrollToCallToAction">
			Jetzt Fördermitglied werden
			<ChevronDownIcon/>
		</a>

		<div class="columns is-multiline is-variable is-2">
			<div class="column is-full pt-0 pb-0">
				<SuccessMessageBankTransfer v-if="showBankTransferContent" :donation="donation"/>
				<SuccessMessage
					v-else
					:donation="donation"
					:comment-link-is-disabled="commentLinkIsDisabled"
					v-on:show-comment-modal="showCommentModal()"
				/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<div v-if="!donation.isExported">
					<AddressKnown
						v-if="showAddress"
						:donation="donation"
						:address="currentAddress"
						:address-type="currentAddressType"
						:countries="countries"
						:salutations="salutations"
						v-on:show-address-modal="showAddressModal()"
					/>
					<AddressAnonymous v-else v-on:show-address-modal="showAddressModal()"/>
				</div>
				<DonationExported
					v-else-if="addressType === 'person' || addressType === 'firma'"
					:address-type="currentAddressType"
				/>
				<DonationSurvey v-if="false"/>
			</div>
			<div class="column is-half pt-0 pb-0" id="become-a-member" ref="becomeAMember">
				<MembershipInfo
					:donation="donation"
					v-on:membership-cta-button-shown="isMobileCallToActionButtonVisible = false"
					v-on:membership-cta-button-hidden="isMobileCallToActionButtonVisible = true"
				/>
			</div>
		</div>

		<ModalDialogue
			:visible="isAddressModalOpen"
			:title="$t( 'donation_confirmation_address_update_button_alt' )"
			@hide="isAddressModalOpen = false">
			<AddressUpdateForm
				:address-validation-patterns="addressValidationPatterns"
				:countries="countries"
				:donation="donation"
				:donorResource="donorResource"
				:salutations="salutations"
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				@address-updated="updateAddress( $event )"
				@close="isAddressModalOpen = false"
			/>
		</ModalDialogue>

		<ModalDialogue
			:visible="openCommentPopUp"
			:title="$t( 'donation_comment_popup_title' )"
			@hide="openCommentPopUp = false">
			<DonationCommentPopUp
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
import MembershipInfo from '@src/components/pages/donation_confirmation/MembershipInfo.vue';
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
import DonationSurvey from '@src/components/pages/donation_confirmation/DonationSurvey.vue';
import DonationCommentPopUp from '@src/components/pages/donation_confirmation/DonationCommentPopUp.vue';
import ChevronDownIcon from '@src/components/shared/icons/ChevronDown.vue';
import DonationExported from '@src/components/pages/donation_confirmation/DonationExported.vue';
import DonorResource from '@src/api/DonorResource';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import AddressUpdateForm from '@src/components/pages/donation_confirmation/AddressUpdateForm.vue';

export default defineComponent( {
	name: 'DonationConfirmation',
	components: {
		AddressAnonymous,
		AddressKnown,
		AddressUpdateForm,
		ChevronDownIcon,
		SuccessMessageBankTransfer,
		SuccessMessage,
		DonationCommentPopUp,
		DonationExported,
		DonationSurvey,
		MembershipInfo,
		ModalDialogue,
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
@use 'src/scss/settings/units';
@use 'src/scss/settings/colors';
@use 'sass:map';

.donation-confirmation {
	&-card {
		background: colors.$white;
		border: 1px solid colors.$gray-mid;
		border-radius: 2px;
		padding: map.get( units.$spacing, 'large' ) map.get( units.$spacing, 'small' );
		margin-bottom: map.get( units.$spacing, 'x-small' );
		line-height: 1.5;

		@media ( min-width: 400px ) {
			padding: map.get( units.$spacing, 'large' );
		}
	}

	h2 {
		line-height: 25px;
	}
}

.icon-title {
	padding-left: 2.5rem;
	svg {
		float: left;
		margin-left: -2.5rem;
	}
}

h1.icon-title svg {
	margin-top: 2px;
}

h2.icon-title {
	font-size: 1.3rem;
}

.donation {
	&-summary {
		&-wrapper {
			border: 1px solid colors.$gray-mid;
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
