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
		></component>
	</div>
</template>

<script lang="js">
import Vue from 'vue';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';
import PaymentSummaryAnonymous from '@/components/shared/payment_summary/PaymentSummaryAnonymous.vue';
import PaymentSummaryCompany from '@/components/shared/payment_summary/PaymentSummaryCompany.vue';
import PaymentSummaryEmail from '@/components/shared/payment_summary/PaymentSummaryEmail.vue';
import PaymentSummaryPrivate from '@/components/shared/payment_summary/PaymentSummaryPrivate.vue';

const addressTypeComponents = {
	[ addressTypeName( AddressTypeModel.ANON ) ]: PaymentSummaryAnonymous,
	[ addressTypeName( AddressTypeModel.COMPANY ) ]: PaymentSummaryCompany,
	[ addressTypeName( AddressTypeModel.EMAIL ) ]: PaymentSummaryEmail,
	[ addressTypeName( AddressTypeModel.PERSON ) ]: PaymentSummaryPrivate,
	[ addressTypeName( AddressTypeModel.UNSET ) ]: PaymentSummaryAnonymous,
};

export default Vue.extend( {
	name: 'DonationSummary',
	props: [
		'address',
		'addressType',
		'payment',
		'countries',
		'languageItem',
		'salutations',
	],
	computed: {
		addressTypeComponent: function () {
			return addressTypeComponents[ this.$props.addressType ];
		},
		paymentType: function () {
			return this.$t( this.payment.paymentType );
		},
		interval: function () {
			return this.$t( 'donation_form_payment_interval_' + this.payment.interval );
		},
		formattedAmount: function () {
			return this.$n( this.payment.amount, { key: 'currency', currencyDisplay: 'name' } );
		},
		country: function () {
			const countryObject = this.countries.find( c => ( c.countryCode === this.address.countryCode || c.countryCode === this.address.country ) );
			return countryObject ? countryObject.countryFullName : '';
		},
		salutation: function () {
			if ( !this.address.salutation ) {
				return '';
			}

			return this.address.salutation;
		},
	},
} );
</script>
