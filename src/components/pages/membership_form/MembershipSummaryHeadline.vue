<template>
	<p>
		{{ $t( 'membership_form_summary_thanks_headline' ) }} <br/>
		<span v-html="$t( 'membership_form_summary_headline', summaryData )"></span>
	</p>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { YearlyMembershipFee } from '@src/view_models/MembershipFee';
import { MembershipType } from '@src/view_models/MembershipTypeModel';

interface Props {
	payment: {
		paymentIntervalInMonths: any;
		membershipFee: any;
		paymentType: any;
		membershipType: MembershipType;
	};
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
	const yearlyFee = new YearlyMembershipFee( props.payment.paymentIntervalInMonths, props.payment.membershipFee );
	return {
		paymentInterval: t( 'form_payment_interval_' + props.payment.paymentIntervalInMonths ),
		membershipType: t( props.payment.membershipType === 'active' ? 'membership_type_active' : 'membership_type_sustaining' ),
		membershipFeeFormatted: n( yearlyFee.membershipFeePerInterval, { key: 'currency', currencyDisplay: 'name' } ),
		membershipFeeYearlyFormatted: renderAmount(
			yearlyFee.yearlyFee,
			yearlyFee.paymentIntervalInMonths,
			t( 'form_payment_interval_12' )
		),
		paymentType: t( props.payment.paymentType ),
	};
} );
</script>
