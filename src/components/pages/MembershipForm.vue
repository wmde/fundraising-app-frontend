<template>
	<form name="laika-membership" ref="form" :action="`/apply-for-membership?${trackingParams}`" method="post">
		<keep-alive>
			<component
				ref="currentPage"
				:is="currentFormComponent"
				v-on:next-page="changePageIndex( 1 )"
				v-on:previous-page="changePageIndex( -1 )"
				v-bind="currentProperties">
			</component>
		</keep-alive>
	</form>
</template>

<script setup lang="ts">
import { Component, computed, ref, watch } from 'vue';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import PaymentPage from '@src/components/pages/membership_form/subpages/PaymentPage.vue';
import AddressPage from '@src/components/pages/membership_form/subpages/AddressPage.vue';

interface Props {
	validateAddressUrl: string;
	validateEmailUrl: string;
	validateBankDataUrl: string;
	validateLegacyBankDataUrl: string;
	validateFeeUrl: string;
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	countries: Country[];
	salutations: Salutation[];
	showMembershipTypeOption: Boolean,
	addressValidationPatterns: AddressValidation;
	dateOfBirthValidationPattern: String,
	startPageIndex?: number;
}

const props = withDefaults( defineProps<Props>(), {
	startPageIndex: 0,
} );

const currentPageIndex = ref<number>( props.startPageIndex );
const pages = [ PaymentPage, AddressPage ];

const trackingParams = computed( (): string => {
	const params = new URLSearchParams( window.location.search );
	const campaign = params.get( 'piwik_campaign' );
	const kwd = params.get( 'piwik_kwd' );
	if ( kwd && campaign ) {
		return `piwik_campaign=${campaign}&piwik_kwd=${kwd}`;
	}
	return '';
} );

const currentFormComponent = computed( (): Component => {
	return pages[ currentPageIndex.value ];
} );

const currentProperties = computed( (): object => {
	if ( currentFormComponent.value === AddressPage ) {
		return {
			validateAddressUrl: props.validateAddressUrl,
			validateEmailUrl: props.validateEmailUrl,
			validateFeeUrl: props.validateFeeUrl,
			countries: props.countries,
			salutations: props.salutations,
			addressValidationPatterns: props.addressValidationPatterns,
			dateOfBirthValidationPattern: props.dateOfBirthValidationPattern,
		};
	}
	return {
		showMembershipTypeOption: props.showMembershipTypeOption,
		validateFeeUrl: props.validateFeeUrl,
		paymentAmounts: props.paymentAmounts,
		paymentIntervals: props.paymentIntervals,
		paymentTypes: props.paymentTypes,
		validateBankDataUrl: props.validateBankDataUrl,
		validateLegacyBankDataUrl: props.validateLegacyBankDataUrl,
		salutations: props.salutations,
	};
} );

const scrollToTop = (): void => {
	window.scrollTo( 0, 0 );
};

watch( currentPageIndex, () => {
	scrollToTop();
} );

function changePageIndex( indexChange: number ): void {
	const newIndex = currentPageIndex.value + indexChange;
	if ( newIndex >= 0 && newIndex < pages.length ) {
		currentPageIndex.value = newIndex;
		scrollToTop();
	}
}

</script>
