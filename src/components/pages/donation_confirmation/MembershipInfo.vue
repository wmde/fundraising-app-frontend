<template>
	<div class="membership-benefits-wrapper has-background-bright mb-4">
		<h2 class="icon-title is-size-5 has-margin-bottom-18"><warning-icon/> {{ $t( 'donation_confirmation_membership_call_to_action_title' ) }}</h2>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_membership_call_to_action_text' ) }}</p>
		<p class="has-margin-bottom-18">
			<a ref="buttonRef" id="membership-application-url" :href="membershipApplicationUrl">
				<FunButton class="is-primary is-main">{{ $t('donation_confirmation_membership_button') }}</FunButton>
			</a>
		</p>
		<ul class="membership-benefits">
			<li>{{ $t( 'donation_confirmation_bottombox_membership_benefit_1' ) }}</li>
			<li class="has-margin-top-18">{{ $t( 'donation_confirmation_bottombox_membership_benefit_2' ) }}</li>
			<li class="has-margin-top-18">{{ $t( 'donation_confirmation_bottombox_membership_benefit_3' ) }}</li>
			<li class="has-margin-top-18">{{ $t( 'donation_confirmation_bottombox_membership_benefit_4' ) }}</li>
			<li class="has-margin-top-18"><a href="https://wikimedia.de/de/mitglied-werden">{{ $t( 'donation_confirmation_bottombox_membership_link' ) }}</a></li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { Donation } from '@src/view_models/Donation';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

interface Props {
	donation: Donation
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'membership-cta-button-shown', 'membership-cta-button-hidden' ] );

let buttonVisibilityObserver;
const buttonIsVisible = ref( false );
const buttonRef = ref<HTMLElement>( null );
const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

const membershipApplicationUrl = computed( (): string => {
	return `apply-for-membership?donationId=${props.donation.id}&donationAccessToken=${props.donation.accessToken}&type=sustaining&${ campaignParams }`;
} );

onMounted( () => {
	if ( !window.IntersectionObserver ) {
		return;
	}
	buttonVisibilityObserver = new IntersectionObserver( ( entries ) => {
		if ( entries[ 0 ].isIntersecting && !buttonIsVisible.value ) {
			buttonIsVisible.value = true;
			emit( 'membership-cta-button-shown' );
		} else if ( !entries[ 0 ].isIntersecting && buttonIsVisible ) {
			buttonIsVisible.value = false;
			emit( 'membership-cta-button-hidden' );
		}
	} );

	buttonVisibilityObserver.observe( buttonRef.value );
} );

onUnmounted( () => {
	buttonVisibilityObserver.disconnect();
} );

</script>

<style lang="scss">
	@import "../../../scss/variables";

	.membership-benefits-wrapper {
		border-radius: 2px;
		border: 3px solid $fun-color-primary-light;
	}
	.membership-benefits {
		list-style: disc;
		padding-left: 1rem;
	}
</style>
