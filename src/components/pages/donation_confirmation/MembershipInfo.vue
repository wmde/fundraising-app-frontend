<template>
	<div class="donation-confirmation-card membership-benefits-wrapper">
		<IconText>
			<template #icon><WarningIcon/></template>
			<template #content><h2>{{ $t( 'donation_confirmation_membership_call_to_action_title' ) }}</h2></template>
		</IconText>
		<p>{{ $t( 'donation_confirmation_membership_call_to_action_text' ) }}</p>
		<p>
			<a ref="buttonRef" class="form-button" id="membership-application-url" :href="membershipApplicationUrl">
				{{ $t('donation_confirmation_membership_button') }}
			</a>
		</p>
		<ul class="membership-benefits">
			<li>{{ $t( 'donation_confirmation_bottombox_membership_benefit_1' ) }}</li>
			<li>{{ $t( 'donation_confirmation_bottombox_membership_benefit_2' ) }}</li>
			<li>{{ $t( 'donation_confirmation_bottombox_membership_benefit_3' ) }}</li>
			<li>{{ $t( 'donation_confirmation_bottombox_membership_benefit_4' ) }}</li>
			<li>
				<a href="https://www.wikimedia.de/wikipedia-unterstuetzen/spenden/mitglieder/">
					{{ $t( 'donation_confirmation_bottombox_membership_link' ) }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import IconText from '@src/components/patterns/IconText.vue';

interface Props {
	donation: {
		id: number;
		accessToken: string;
	};
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'membership-cta-button-shown', 'membership-cta-button-hidden' ] );

let buttonVisibilityObserver: IntersectionObserver;
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
@use 'src/scss/settings/colors';

.donation-confirmation-card.membership-benefits-wrapper {
	border: 3px solid colors.$primary;
}

.membership-benefits {
	list-style: disc;
	padding-left: 1rem;
}
</style>
