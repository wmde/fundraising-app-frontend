<template>
	<div class="donation-confirmation">
		<a class="mobile-call-to-action is-primary button" href="#membership-application-url"
			v-if="isMobileCallToActionButtonVisible && !isAddressModalOpen"
			@click.prevent="scrollToCallToAction">
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
					@show-comment-modal="showCommentModal()"
				/>
			</div>
			<div class="column is-half pt-0 pb-0">
				<div v-if="!donation.isExported">
					<AddressKnown
						v-if="showAddress"
						:modal-is-visible="isAddressModalOpen"
						:donation="donation"
						:address="currentAddress"
						:address-type="currentAddressType"
						:countries="countries"
						:salutations="salutations"
						@show-address-modal="showAddressModal()"
					/>
					<AddressAnonymous v-else :modal-is-visible="isAddressModalOpen" @show-address-modal="showAddressModal()"/>
				</div>
				<DonationExported
					v-else-if="addressType === 'person' || addressType === 'firma'"
					:address-type="currentAddressType"
				/>
				<DonationSurvey v-if="$t( 'donation_confirmation_survey_link' ) !== ''" :tracking="tracking"/>
			</div>
			<div class="column is-half pt-0 pb-0" id="become-a-member" ref="becomeAMember">
				<MembershipInfo
					:donation="donation"
					@membership-cta-button-shown="isMobileCallToActionButtonVisible = false"
					@membership-cta-button-hidden="isMobileCallToActionButtonVisible = true"
				/>
			</div>
		</div>

		<ModalDialogue
			id="address-change-modal"
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
			id="donation-comment-modal"
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import MembershipInfo from '@src/components/pages/donation_confirmation/MembershipInfo.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import type { Country } from '@src/view_models/Country';
import type { Address } from '@src/view_models/Address';
import type { Donation } from '@src/view_models/Donation';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import SuccessMessage from '@src/components/pages/donation_confirmation/SuccessMessage.vue';
import SuccessMessageBankTransfer from '@src/components/pages/donation_confirmation/SuccessMessageBankTransfer.vue';
import AddressKnown from '@src/components/pages/donation_confirmation/AddressKnown.vue';
import AddressAnonymous from '@src/components/pages/donation_confirmation/AddressAnonymous.vue';
import DonationSurvey from '@src/components/pages/donation_confirmation/DonationSurvey.vue';
import DonationCommentPopUp from '@src/components/pages/donation_confirmation/DonationCommentPopUp.vue';
import ChevronDownIcon from '@src/components/shared/icons/ChevronDown.vue';
import DonationExported from '@src/components/pages/donation_confirmation/DonationExported.vue';
import type { DonorResource } from '@src/api/DonorResource';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import AddressUpdateForm from '@src/components/pages/donation_confirmation/AddressUpdateForm.vue';

interface Props {
	donation: Donation;
	address: Address;
	addressType: string;
	tracking: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
	postCommentUrl: string;
	countries: Country[];
	salutations: Salutation[];
	addressValidationPatterns: AddressValidation;
	donorResource: DonorResource;
}

const props = defineProps<Props>();

const becomeAMember = ref<HTMLElement>();
const isAddressModalOpen = ref<boolean>( false );
const currentAddress = ref<Address>( props.address );
const currentAddressType = ref<string>( props.addressType );
const openCommentPopUp = ref<boolean>( false );
const commentLinkIsDisabled = ref<boolean>( false );
const isMobileCallToActionButtonVisible = ref<boolean>( true );

const showAddressModal = (): void => {
	isAddressModalOpen.value = true;
};

const updateAddress = ( submittedAddress: { addressData: Address; addressType: string } ): void => {
	currentAddress.value = submittedAddress.addressData;
	currentAddressType.value = submittedAddress.addressType;
	isAddressModalOpen.value = false;
};

const showCommentModal = (): void => {
	if ( !commentLinkIsDisabled.value ) {
		openCommentPopUp.value = true;
	}
};
const scrollToCallToAction = (): void => {
	window.scrollTo( {
		left: 0,
		top: becomeAMember.value.offsetTop,
		behavior: 'smooth',
	} );
};

const showBankTransferContent = computed<boolean>( () => {
	return props.donation.paymentType === 'UEB';
} );

const showAddress = computed<boolean>( () => {
	return ![
		addressTypeName( AddressTypeModel.ANON ),
		addressTypeName( AddressTypeModel.EMAIL ),
	].includes( currentAddressType.value );
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
	--chevron-stroke: #{colors.$white};
	position: fixed;
	bottom: 0;
	height: 64px;
	width: 100%;
	padding: 0 10px;
	line-height: 64px;
	z-index: 1000;
	font-weight: bold;
	left: 0;

	background-color: colors.$primary;
	color: colors.$white;
	text-align: center;
	&:hover {
		color: colors.$white;
	}
	svg {
		margin-left: 10px;
	}
}
</style>
