<template>
	<form name="laika-membership" ref="form" :action="`/apply-for-membership?${trackingParams}`" method="post">
		<keep-alive>
			<component
				ref="currentPage"
				:is="currentFormComponent"
				v-on:next-page="changePageIndex( 1 )"
				v-on:previous-page="changePageIndex( -1 )"
				v-on:submit-membership="submitMembershipForm"
				v-bind="currentProperties">
			</component>
		</keep-alive>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/membership_form/subpages/AddressPage.vue';
import { trackFormSubmission } from '@src/tracking';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';

export default defineComponent( {
	name: 'MembershipForm',
	components: {
		PaymentPage,
		AddressPage,
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
		validateFeeUrl: String,
		paymentAmounts: Array as () => Array<String>,
		paymentIntervals: Array as () => Array<String>,
		paymentTypes: Array as () => Array<String>,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		showMembershipTypeOption: Boolean,
		addressValidationPatterns: Object as () => AddressValidation,
		dateOfBirthValidationPattern: String,
	},
	data: function () {
		return {
			pages: [ 'PaymentPage', 'AddressPage' ],
			currentPageIndex: 0,
		};
	},
	computed: {
		trackingParams: {
			get(): string {
				const params = new URLSearchParams( window.location.search );
				const campaign = params.get( 'piwik_campaign' );
				const kwd = params.get( 'piwik_kwd' );
				if ( kwd && campaign ) {
					return `piwik_campaign=${campaign}&piwik_kwd=${kwd}`;
				}
				return '';
			},
		},
		currentFormComponent: {
			get(): string {
				return this.$data.pages[ this.$data.currentPageIndex ];
			},
		},
		currentProperties: {
			get(): object {
				if ( this.currentFormComponent === 'AddressPage' ) {
					return {
						validateAddressUrl: this.$props.validateAddressUrl,
						validateEmailUrl: this.$props.validateEmailUrl,
						validateFeeUrl: this.$props.validateFeeUrl,
						countries: this.$props.countries,
						salutations: this.$props.salutations,
						addressValidationPatterns: this.$props.addressValidationPatterns,
						dateOfBirthValidationPattern: this.$props.dateOfBirthValidationPattern,
					};
				}
				return {
					showMembershipTypeOption: this.$props.showMembershipTypeOption,
					validateFeeUrl: this.$props.validateFeeUrl,
					paymentAmounts: this.$props.paymentAmounts,
					paymentIntervals: this.$props.paymentIntervals,
					paymentTypes: this.$props.paymentTypes,
					validateBankDataUrl: this.$props.validateBankDataUrl,
					validateLegacyBankDataUrl: this.$props.validateLegacyBankDataUrl,
					salutations: this.$props.salutations,
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
		submitMembershipForm(): void {
			const form = this.$refs.form as HTMLFormElement;
			trackFormSubmission( form );
			form.submit();
		},
	},
} );
</script>
