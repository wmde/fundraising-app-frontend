<template>
	<p aria-live="polite">
		{{ $t( 'membership_form_summary_thanks_headline' ) }} <br/>
		<span v-html="$t( 'membership_form_summary_headline', summaryData )"></span>
	</p>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import type { MembershipPaymentSummary } from '@src/Domain/Membership/MembershipPaymentSummary';

interface Props {
	paymentSummary: MembershipPaymentSummary;
}

const props = defineProps<Props>();
const { t, n } = useI18n();

const renderAmount = ( amount: number, interval: number, intervalTranslation: String ): string => {
	if ( interval === 12 ) {
		return '';
	}
	const formattedAmount = n( amount, { key: 'currency', currencyDisplay: 'name' } );
	return `(${formattedAmount} ${intervalTranslation})`;
};

const summaryData = computed( () => {
	const yearlyFee = new YearlyMembershipFee( props.paymentSummary.paymentIntervalInMonths, props.paymentSummary.membershipFee );
	return {
		paymentInterval: t( 'form_payment_interval_' + props.paymentSummary.paymentIntervalInMonths ),
		membershipType: t( props.paymentSummary.membershipType === 'active' ? 'membership_type_active' : 'membership_type_sustaining' ),
		membershipFeeFormatted: n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } ),
		membershipFeeYearlyFormatted: renderAmount(
			yearlyFee.yearlyFee,
			yearlyFee.paymentIntervalInMonths,
			t( 'form_payment_interval_12' )
		),
		paymentType: t( props.paymentSummary.paymentType ),
	};
} );
</script>
