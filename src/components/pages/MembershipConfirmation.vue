<template>
	<div class="flow">
		<ContentCard>
			<template #content>
				<IconText>
					<template #icon><SuccessIcon/></template>
					<template #content><h1>{{ $t( 'membership_confirmation_thanks_text' ) }}</h1></template>
				</IconText>

				<p v-html="$t( 'membership_confirmation_payment_data_text', summaryData )"/>

				<p v-if="hasIncentives">{{ $t( 'membership_confirmation_success_text_incentive' ) }}</p>
				<p v-else>{{ $t( 'membership_confirmation_success_text' ) }}</p>

				<p v-if="showBankTransferContent">{{ $t( 'membership_confirmation_success_text_bank_transfer' ) }}</p>
			</template>
		</ContentCard>

		<div class="switcher">
			<div class="flow">
				<ContentCard>
					<template #content v-if="!confirmationData.membershipApplication.isExported">
						<AddressKnown
							:modal-is-visible="isAddressModalOpen"
							:membership-application="membershipApplication"
							:address="currentAddress"
							:countries="countries"
							:salutations="salutations"
							@show-address-modal="showAddressModal"
							/>
					</template>
					<template #content v-else>
						<IconText>
							<template #icon><WarningIcon/></template>
							<template #content><h2>{{ $t( 'membership_confirmation_exported_title' ) }}</h2></template>
						</IconText>
						<p>
							{{ $t( 'membership_confirmation_exported_content' ) }}
						</p>
					</template>
				</ContentCard>
			</div>
			<div class="flow">
				<MembershipSurvey
					v-if="$t( 'membership_confirmation_survey_link') !== ''"
					:tracking="confirmationData.tracking ?? ''"
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
				:membershipApplication="confirmationData.membershipApplication"
				:member-resource="membershipApplicantResource"
				:salutations="salutations"
				:validate-address-url="validateAddressUrl"
				:validate-email-url="validateEmailUrl"
				@address-updated="updateAddress( $event )"
				@close="isAddressModalOpen = false"
			/>
		</ModalDialogue>
	</div>
	<MembershipConfirmationBannerNotifier/>
</template>

<script setup lang="ts">
import MembershipSurvey from '@src/components/pages/membership_confirmation/MembershipSurvey.vue';
import MembershipConfirmationBannerNotifier
	from '@src/components/pages/membership_confirmation/MembershipConfirmationBannerNotifier.vue';
import type { Salutation } from '@src/view_models/Salutation';
import type { MembershipApplicationConfirmationData } from '@src/Domain/Membership/MembershipApplicationConfirmationData';
import type { Country } from '@src/view_models/Country';
import { computed, ref } from 'vue';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { useI18n } from 'vue-i18n';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import ModalDialogue from '@src/components/shared/ModalDialogue.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import AddressUpdateForm from '@src/components/pages/membership_confirmation/AddressUpdateForm.vue';
import AddressKnown from '@src/components/pages/membership_confirmation/AddressKnown.vue';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { AddressValidation } from '@src/view_models/Validation';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
// import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import type { MembershipApplicantResource } from '@src/api/MembershipApplicantResource';

interface Props {
	confirmationData: MembershipApplicationConfirmationData;
	salutations: Salutation[];
	countries: Country[];

	membershipAddress: MembershipAddress;
	membershipApplication: MembershipApplication;
	addressValidationPatterns: AddressValidation;
	membershipApplicantResource: MembershipApplicantResource;

	// not sure if following three are relevant
	tracking: string;
	validateAddressUrl: string;
	validateEmailUrl: string;
}

const { t, n } = useI18n();

const props = defineProps<Props>();

const isAddressModalOpen = ref<boolean>( false );
const currentAddress = ref( props.confirmationData.address );
const currentAddressType = ref<string>( props.confirmationData.address.applicantType );

const hasIncentives = props.confirmationData.membershipApplication.incentives?.length > 0;

const showAddressModal = (): void => {
	isAddressModalOpen.value = true;
};

const updateAddress = ( submittedAddress: { addressData: MembershipAddress; addressType: string } ): void => {
	currentAddress.value = submittedAddress.addressData;
	currentAddressType.value = submittedAddress.addressType;
	isAddressModalOpen.value = false;
};

const showBankTransferContent = props.confirmationData.membershipApplication.paymentType === 'UEB';

const geYearlyAmountForSmallIntervals = ( amount: number, interval: number, intervalTranslation: String ): string => {
	if ( interval === 12 ) {
		return '';
	}
	const formattedAmount = n( amount, { key: 'currency', currencyDisplay: 'name' } );
	return `(${formattedAmount} ${intervalTranslation})`;
};

// const address = props.confirmationData.address;
/*
// Following const is unnecessary as a 'member' will always have an address
const showAddress = computed<boolean>( () => {
	return ![
		addressTypeName( AddressTypeModel.ANON ),
		addressTypeName( AddressTypeModel.EMAIL ),
	].includes( currentAddressType.value );
} );
*/

// !confirmationData.membershipApplication.isExported

const salutation = computed( () => {
	// if ( !address.salutation ) {
	if ( !currentAddress.value.salutation ) {
		return '';
	}

	// const salutationObject = props.salutations.find( s => s.label === address.salutation );
	const salutationObject = props.salutations.find(
		s => s.label === currentAddress.value.salutation
	);
	if ( salutationObject === undefined ) {
		return '';
	}
	return salutationObject?.display + ' ';
} );

const countryName = computed( () => {
	// const countryObject = props.countries.find( c => ( c.countryCode === address.countryCode ) );
	const countryObject = props.countries.find(
		c => ( c.countryCode === currentAddress.value.countryCode )
	);
	return countryObject ? countryObject.countryFullName : '';
} );

const summaryData = computed( () => {
	const membership = props.confirmationData.membershipApplication;
	const yearlyFee = new YearlyMembershipFee(
		membership.paymentIntervalInMonths,
		membership.membershipFee
	);
	return {
		paymentInterval: t( 'donation_form_payment_interval_' + membership.paymentIntervalInMonths ),
		membershipType: t( membership.membershipType === 'active' ? 'membership_type_active' : 'membership_type_sustaining' ),
		membershipFeeFormatted: n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } ),
		membershipFeeYearlyFormatted: geYearlyAmountForSmallIntervals(
			yearlyFee.yearlyFee,
			yearlyFee.paymentIntervalInMonths,
			t( 'donation_form_payment_interval_12' )
		),
		paymentType: t( membership.paymentType ),
	};
} );

/* Unncessary
const membershipApplicationResource = new ApiMembershipApplicantResource(
	props.confirmationData.api.updateMembershipUrl
); */

/*
const updateAddress1 = ( updatedAddress: MembershipAddress ): void => {
	currentAddress.value = updatedAddress;
	isAddressModalOpen.value = false;
};
*/

</script>
