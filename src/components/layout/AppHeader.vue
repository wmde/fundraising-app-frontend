<template>
	<div class="navbar is-fixed-top has-background-bright has-shadow">
		<div class="container">
			<div class="navbar-brand">
				<a class="navbar-item" href="/">
					<Logo/>
				</a>
				<a role="button"
					aria-label="menu"
					aria-expanded="false"
					@click="showNavbarBurger = !showNavbarBurger"
					v-bind:class="[{ 'is-active': showNavbarBurger }, 'navbar-burger']">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div id="navMenu" v-bind:class="[ { 'is-active': showNavbarBurger }, 'navbar-menu']"
				@click="showNavbarBurger = !showNavbarBurger">
				<div class="navbar-start">
					<a v-for="( link, index ) in headerMenu"
						:key="index"
						:href="link.url"
						v-bind:class="[{ 'active': link.ids.includes( pageIdentifier ) }, 'navbar-item']">
						{{ $t( 'header_menu_item_' + link.localeId ) }}
					</a>
				</div>
			</div>
			<LocaleSelector :assets-path="assetsPath"/>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import LocaleSelector from '@src/components/shared/LocaleSelector.vue';
import Logo from '@src/components/layout/Logo.vue';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
}

defineProps<Props>();

const showNavbarBurger = ref<boolean>( false );
const headerMenu = [
	{ ids: [ 'donation-form', 'donation-confirmation' ], localeId: 'donate', url: '/' },
	{
		ids: [ 'membership-application', 'membership-application-confirmation' ],
		localeId: 'membership_application',
		url: '/apply-for-membership',
	},
	{ ids: [ 'faq-page' ], localeId: 'faq', url: '/faq' },
	{ ids: [ 'use-of-funds' ], localeId: 'use_of_resources', url: '/use-of-funds' },
];

</script>

<style lang="scss">
@import "../../scss/variables";
@import "~bulma/sass/utilities/mixins";

.navbar {
	&-item {
		border-bottom: 2px solid $fun-color-bright;
	}

	&-brand {
		margin-left: 0;
		@include from($tablet) {
			margin-right: 54px;
		}
	}

	&-menu {
		padding: 0;

		.navbar-item {
			padding: 18px;

			@include until(820px) {
				padding: 18px 9px;
			}

			@include until($navbar-breakpoint) {
				padding: 18px;
				border-bottom: 2px solid $fun-color-gray-light-transparency;
			}
		}
	}

	&-menu,
	&-language {
		.navbar-item {
			&:hover {
				border-bottom: 2px solid $fun-color-primary;
			}

			&:active {
				background-color: $fun-color-primary-lightest;
			}

			&.active {
				border-bottom: 2px solid $fun-color-primary;
				color: $fun-color-primary;
				font-weight: bold;
			}
		}
	}
}

.navbar-language {
	align-items: stretch;
	display: flex;

	position: absolute;
	top: 0;
	right: 72px;

	@include from($navbar-breakpoint) {
		right: 0;
		position: static;
		float: right;
	}

	.navbar-item {
		line-height: 4rem;
	}
}
</style>