<template>
	<div class="donation-summary">
		<component
			:is="addressTypeComponent"
			:address="address"
			:interval="interval"
			:formatted-amount="formattedAmount"
			:paymentType="paymentType"
			:country="country"
			:language-item="languageItem"
			:salutation="salutation"
		/>
	</div>
</template>

<script setup lang="ts">
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import PaymentSummaryAnonymous from '@src/components/shared/payment_summary/PaymentSummaryAnonymous.vue';
import PaymentSummaryCompany from '@src/components/shared/payment_summary/PaymentSummaryCompany.vue';
import PaymentSummaryEmail from '@src/components/shared/payment_summary/PaymentSummaryEmail.vue';
import PaymentSummaryPrivate from '@src/components/shared/payment_summary/PaymentSummaryPrivate.vue';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

interface Props {
	address : Record<string, string>;
	addressType: String;
	payment: { interval: any, amount: number, paymentType: any };
	countries: Array<Country>;
	languageItem: String;
	salutations: Array<Salutation>;
}

const { t, n } = useI18n();
const props = defineProps<Props>();

const addressTypeComponents = [
	{ key: addressTypeName( AddressTypeModel.ANON ), component: PaymentSummaryAnonymous },
	{ key: addressTypeName( AddressTypeModel.COMPANY ), component: PaymentSummaryCompany },
	{ key: addressTypeName( AddressTypeModel.EMAIL ), component: PaymentSummaryEmail },
	{ key: addressTypeName( AddressTypeModel.PERSON ), component: PaymentSummaryPrivate },
	{ key: addressTypeName( AddressTypeModel.UNSET ), component: PaymentSummaryAnonymous },
];

// TODO: Extract this into a composable to make testing easier
const addressTypeComponent = computed( () => addressTypeComponents.find( x => x.key === props.addressType ).component );
const paymentType = computed( () => t( props.payment.paymentType ) );
const interval = computed( () => t( 'donation_form_payment_interval_' + props.payment.interval ) );
const formattedAmount = computed( () => n( props.payment.amount, { key: 'currency', currencyDisplay: 'name' } ) );
const country = computed( () => {
	const countryObject = props.countries.find( c => ( c.countryCode === props.address.countryCode || c.countryCode === props.address.country ) );
	return countryObject ? countryObject.countryFullName : '';
} );
const salutation = computed( () => props.address.salutation ? props.salutations.find( s => s.value === props.address.salutation )?.display : '' );

</script>
