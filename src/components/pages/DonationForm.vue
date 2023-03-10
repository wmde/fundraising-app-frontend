<template>
	<div id="laika-donation">
		<keep-alive>
			<component
				ref="currentPage"
				:is="currentFormComponent"
				v-on:next-page="changePageIndex( 1 )"
				v-on:previous-page="changePageIndex( -1 )"
				v-bind="currentProperties">
			</component>
		</keep-alive>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TrackingData } from '@/view_models/TrackingData';
import PaymentPage from '@/components/pages/donation_form/subpages/PaymentPage.vue';
import AddressPage from '@/components/pages/donation_form/subpages/AddressPage.vue';
import { Country } from '@/view_models/Country';
import { AddressValidation } from '@/view_models/Validation';
import { Salutation } from '@/view_models/Salutation';
import { CampaignValues } from '@/view_models/CampaignValues';

export default Vue.extend( {
	name: 'DonationForm',
	components: {
		PaymentPage,
		AddressPage,
	},
	props: {
		assetsPath: String,
		validateAddressUrl: String,
		validateEmailUrl: String,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		paymentAmounts: Array as () => Array<String>,
		paymentIntervals: Array as () => Array<Number>,
		paymentTypes: Array as () => Array<String>,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		trackingData: Object as () => TrackingData,
		campaignValues: Object as () => CampaignValues,
		addressValidationPatterns: Object as () => AddressValidation,
		startPage: {
			type: String,
			default: () => 'PaymentPage',
		},
	},
	data: function () {
		const pages = [ 'PaymentPage', 'AddressPage' ];
		const currentPageIndex = pages.indexOf( this.$props.startPage );
		if ( currentPageIndex < 0 ) {
			throw new Error( `Unknown initial page name '${this.$props.startPage}'. Valid page names are: ${pages.join( ', ' )}` );
		}
		return {
			pages,
			currentPageIndex,
		};
	},
	computed: {
		currentFormComponent: {
			get(): string {
				return this.$data.pages[ this.$data.currentPageIndex ];
			},
		},
		currentProperties: {
			get(): object {
				if ( this.currentFormComponent === 'AddressPage' ) {
					return {
						assetsPath: this.$props.assetsPath,
						validateAddressUrl: this.$props.validateAddressUrl,
						validateEmailUrl: this.$props.validateEmailUrl,
						validateBankDataUrl: this.$props.validateBankDataUrl,
						validateLegacyBankDataUrl: this.$props.validateLegacyBankDataUrl,
						countries: this.$props.countries,
						salutations: this.$props.salutations,
						trackingData: this.$props.trackingData,
						campaignValues: this.$props.campaignValues,
						addressValidationPatterns: this.$props.addressValidationPatterns,
					};
				}
				return {
					assetsPath: this.$props.assetsPath,
					paymentAmounts: this.$props.paymentAmounts,
					paymentIntervals: this.$props.paymentIntervals,
					paymentTypes: this.$props.paymentTypes,
				};
			},
		},
	},
	methods: {
		changePageIndex( indexChange: number ): void {
			const newIndex = this.$data.currentPageIndex + indexChange;
			if ( newIndex >= 0 && newIndex < this.$data.pages.length ) {
				this.$data.currentPageIndex = newIndex;
				this.scrollToTop();
			}
		},
		scrollToTop(): void {
			window.scrollTo( 0, 0 );
		},
	},
} );
</script>
