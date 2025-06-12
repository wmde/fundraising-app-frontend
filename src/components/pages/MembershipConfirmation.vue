<template>
	<div class="membership-confirmation">
		<div class="membership-confirmation-summary membership-confirmation-card">
			<h1 class="icon-title"><SuccessIcon/> {{ $t( 'membership_confirmation_thanks_text' ) }}</h1>
			<p v-html="$t( 'membership_confirmation_payment_data_text', summaryData )"/>

			<p v-if="hasIncentives">{{ $t( 'membership_confirmation_success_text_incentive' ) }}</p>
			<p v-else>{{ $t( 'membership_confirmation_success_text' ) }}</p>

			<p v-if="showBankTransferContent">{{ $t( 'membership_confirmation_success_text_bank_transfer' ) }}</p>
		</div>

		<div class="membership-confirmation-card" v-if="!confirmationData.membershipApplication.isExported">
			<h2 class="icon-title"><SuccessIcon/> {{ $t( 'membership_confirmation_address_head' ) }}</h2>
			<p>
				<template v-if="address.applicantType === 'person'">{{ salutation }}{{ address.fullName }}</template>
				<template v-else>{{ address.fullName }}</template>
				<br />
				{{ address.streetAddress }}<br />
				{{ address.postalCode }} {{ address.city }}<br />
				{{ countryName }}
			</p>
			<p>{{ address.email }}</p>
		</div>
		<div class="membership-confirmation-card" v-else>
			<h2 class="icon-title">
				<WarningIcon/> {{ $t( 'membership_confirmation_exported_title' ) }}
			</h2>
			<p>
				{{ $t( 'membership_confirmation_exported_content' ) }}
			</p>
		</div>

		<membership-survey
			v-if="$t( 'membership_confirmation_survey_link') !== ''"
			:tracking="confirmationData.tracking ?? ''"
		/>

		<MembershipConfirmationBannerNotifier/>
	</div>
</template>

<script setup lang="ts">
import MembershipSurvey from '@src/components/pages/membership_confirmation/MembershipSurvey.vue';
import MembershipConfirmationBannerNotifier
	from '@src/components/pages/membership_confirmation/MembershipConfirmationBannerNotifier.vue';
import type { Salutation } from '@src/view_models/Salutation';
import type { MembershipApplicationConfirmationData } from '@src/Domain/Membership/MembershipApplicationConfirmationData';
import type { Country } from '@src/view_models/Country';
import { computed } from 'vue';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { useI18n } from 'vue-i18n';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';

interface Props {
	confirmationData: MembershipApplicationConfirmationData;
	salutations: Salutation[];
	countries: Country[];
}

const { t, n } = useI18n();

const props = defineProps<Props>();
const hasIncentives = props.confirmationData.membershipApplication.incentives?.length > 0;
const showBankTransferContent = props.confirmationData.membershipApplication.paymentType === 'UEB';

const geYearlyAmountForSmallIntervals = ( amount: number, interval: number, intervalTranslation: String ): string => {
	if ( interval === 12 ) {
		return '';
	}
	const formattedAmount = n( amount, { key: 'currency', currencyDisplay: 'name' } );
	return `(${formattedAmount} ${intervalTranslation})`;
};

const address = props.confirmationData.address;

const salutation = computed( () => {
	if ( !address.salutation ) {
		return '';
	}

	const salutationObject = props.salutations.find( s => s.label === address.salutation );
	if ( salutationObject === undefined ) {
		return '';
	}
	return salutationObject?.display + ' ';
} );

const countryName = computed( () => {
	const countryObject = props.countries.find( c => ( c.countryCode === address.countryCode ) );
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

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';

.app-content-main.uses-cards {
	padding-top: 0;
}

.membership-confirmation {
	@include breakpoints.tablet-up {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 12px;
	}
}

.membership-confirmation-summary {
	@include breakpoints.tablet-up {
		grid-column-start: 1;
		grid-column-end: span 2;
	}
}

.membership-confirmation-card {
	background: #ffffff;
	border: 1px solid colors.$gray-mid;
	border-radius: 2px;
	padding: 32px;
	line-height: 1.5;
	margin-bottom: 12px;
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

</style>
