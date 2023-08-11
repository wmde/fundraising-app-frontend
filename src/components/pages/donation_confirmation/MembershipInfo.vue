<template>
	<div class="membership-benefits-wrapper has-background-bright mb-4">
		<h2 class="icon-title is-size-5 has-margin-bottom-18"><warning-icon/> {{ $t( 'donation_confirmation_membership_call_to_action_title' ) }}</h2>
		<p class="has-margin-bottom-18">{{ $t( 'donation_confirmation_membership_call_to_action_text' ) }}</p>
		<p class="has-margin-bottom-18">
			<a ref="membership-cta-button" id="membership-application-url" :href="membershipApplicationUrl">
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

<script lang="ts">
import Vue from 'vue';
import { Donation } from '@/view_models/Donation';
import WarningIcon from '@/components/shared/icons/WarningIcon.vue';
import FunButton from '@/components/shared/form_inputs/FunButton.vue';

export default Vue.extend( {
	name: 'MembershipInfo',
	components: { FunButton, WarningIcon },
	props: {
		donation: Object as () => Donation,
	},
	data: function () {
		return {
			buttonVisibilityObserver: null,
			buttonIsVisible: false,
		};
	},
	mounted() {
		if ( !window.IntersectionObserver ) {
			return;
		}

		this.$data.buttonVisibilityObserver = new IntersectionObserver( ( entries ) => {
			if ( entries[ 0 ].isIntersecting && !this.$data.buttonIsVisible ) {
				this.$data.buttonIsVisible = true;
				this.$emit( 'membership-cta-button-shown' );
			} else if ( !entries[ 0 ].isIntersecting && this.$data.buttonIsVisible ) {
				this.$data.buttonIsVisible = false;
				this.$emit( 'membership-cta-button-hidden' );
			}
		} );

		this.$data.buttonVisibilityObserver.observe( ( this.$refs[ 'membership-cta-button' ] as HTMLElement ) );
	},
	destroyed() {
		this.$data.buttonVisibilityObserver.disconnect();
	},
	computed: {
		membershipApplicationUrl(): string {
			const donation = this.$props.donation;
			return `apply-for-membership?donationId=${donation.id}&donationAccessToken=${donation.accessToken}&type=sustaining`;
		},
	},
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
