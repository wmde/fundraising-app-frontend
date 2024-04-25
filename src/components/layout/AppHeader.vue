<template>
	<div class="navigation">
		<a class="navigation-left" :href="`/?${ campaignParams }`" aria-hidden="true">
			<Logo/>
		</a>
		<NavigationItems
			v-if="onLargeScreen"
			:show-mobile-navbar="showMobileNavbar"
			:page-identifier="pageIdentifier"
			:header-menu="headerMenu"
			@click="showMobileNavbar = !showMobileNavbar"
			@blur="handleMenuItemBlur"
			@esc="showMobileNavbar = false"
		/>
		<div class="navigation-right">
			<LocaleSelector :assets-path="assetsPath"/>
			<NavigationBurger
				:active="showMobileNavbar"
				@click="showMobileNavbar = !showMobileNavbar"
				@keyup.esc="showMobileNavbar = false"
				@blur="handleMenuItemBlur"
			/>
		</div>
		<NavigationItems
			v-if="!onLargeScreen"
			:show-mobile-navbar="showMobileNavbar"
			:page-identifier="pageIdentifier"
			:header-menu="headerMenu"
			@click="showMobileNavbar = !showMobileNavbar"
			@blur="handleMenuItemBlur"
			@esc="showMobileNavbar = false"
		/>
	</div>
</template>

<script setup lang="ts">

import { inject, ref } from 'vue';
import LocaleSelector from '@src/components/shared/LocaleSelector.vue';
import Logo from '@src/components/layout/Logo.vue';
import NavigationBurger from '@src/components/shared/NavigationBurger.vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import { useDisplaySwitch } from '@src/components/shared/composables/useDisplaySwitch';
import NavigationItems from '@src/components/layout/NavigationItems.vue';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
}

defineProps<Props>();

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );
const showMobileNavbar = ref<boolean>( false );
const headerMenu = [
	{ ids: [ 'donation-form', 'donation-confirmation' ], localeId: 'donate', url: `/?${ campaignParams }` },
	{
		ids: [ 'membership-application', 'membership-application-confirmation' ],
		localeId: 'membership_application',
		url: `/apply-for-membership?${ campaignParams }`,
	},
	{ ids: [ 'use-of-funds' ], localeId: 'use_of_resources', url: `/use-of-funds?${ campaignParams }` },
	{ ids: [ 'faq-page' ], localeId: 'faq', url: `/faq?${ campaignParams }` },
];
const onLargeScreen = useDisplaySwitch( 769 );

const handleMenuItemBlur = () => {
	if ( !showMobileNavbar.value ) {
		return;
	}
	// Use setTimeout to wait for the next tick because the next element won't be focused until then
	setTimeout( () => {
		const classes = document.activeElement.classList;
		if ( !classes.contains( 'navigation-burger' ) && !classes.contains( 'navigation-item' ) ) {
			showMobileNavbar.value = false;
		}
	} );
};

</script>

<style lang="scss">
@use "../../scss/settings/global";
@use "../../scss/settings/colors";
@use "../../scss/settings/units";
@use "../../scss/settings/breakpoints";
@use 'sass:map';
@use 'sass:color';

$navbar-breakpoint: 600px;
// Keep the logo and language links equal width so the navigation will be centered
$side-width: 80px;

.navigation {
	position: fixed;
	background: colors.$white;
	width: 100%;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: stretch;
	box-shadow: 1px 2px 3px rgba( 0, 0, 0, 0.1);
	min-height: global.$navbar-height;
	z-index: 30;

	&-items {
		position: absolute;
		top: 100%;
		width: 100%;
		display: none;
		flex-direction: column;
		max-width: global.$content-width;
		background: colors.$white;
		box-shadow: 0 8px 8px rgba( 0, 0, 0, 0.1);

		ul {
			display: flex;
			flex-direction: column;
			@include breakpoints.tablet-up {
				flex-direction: row;
			}
		}

		&.active {
			display: flex;
		}

		@include breakpoints.tablet-up {
			position: static;
			top: auto;
			display: flex;
			flex-direction: row;
			align-items: stretch;
			flex-wrap: nowrap;
			box-shadow: none;
			order: 2;
		}
	}

	&-item {
		display: flex;
		align-items: center;
		padding: map.get( units.$spacing, 'small' );
		color: colors.$black;
		border-bottom: 2px solid colors.$gray-light;
		transition: border-bottom-color 200ms global.$easing, color 200ms global.$easing;
		height: global.$navbar-height;

		&:hover,
		&:focus,
		&.active {
			color: colors.$primary;
			border-bottom: 2px solid colors.$primary;
			text-decoration: none;
		}

		&.active {
			font-weight: bold;
		}

		@include breakpoints.tablet-up {
			border-bottom: 2px solid colors.$white;
		}
	}

	&-left {
		width: $side-width;
		display: flex;
		justify-content: center;
		align-items: center;
		order: 1;
	}

	&-right {
		display: flex;
		align-items: stretch;
		order: 3;

		@include breakpoints.tablet-up {
			width: $side-width;
		}
	}

	&-locale {
		@include breakpoints.tablet-up {
			width: $side-width;
		}
	}
}

</style>
