<template>
	<div class="navigation-locale" role="button">

		<div class="navigation-locale-current">
			{{ locale === 'de_DE' ? 'de' : 'en' }} <ChevronDown/>
		</div>

		<div class="navigation-locale-dropdown">
			<a v-on:click="setCookie( 'de_DE' )" :class="{ 'active': locale === 'de_DE' }">
				Deutsch <Checkmark v-if="locale === 'de_DE'"/>
			</a>
			<a v-on:click="setCookie( 'en_GB' )" :class="{ 'active': locale === 'en_GB' }">
				English <Checkmark v-if="locale === 'en_GB'"/>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@src/util/createLocalisation';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import Checkmark from '@src/components/shared/icons/Checkmark.vue';

const locale = ref<string>( Cookies.get( COOKIE_NAME ) ?? DEFAULT_LOCALE );

const setCookie = ( value: string ): void => {
	locale.value = value;
	Cookies.set( COOKIE_NAME, value );
	window.location.reload();
};

</script>

<style lang="scss">
@use "@src/scss/settings/units";
@use "@src/scss/settings/global";
@use "@src/scss/settings/colors";
@use 'sass:map';
@use 'sass:color';

.navigation-locale {
	position: relative;
	width: global.$navbar-height;

	&-current {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: colors.$primary;
		font-weight: bold;

		svg {
			width: 10px;
			margin-left: 4px;
			margin-top: 3px;
			path {
				stroke: colors.$primary;
			}
		}
	}

	&-dropdown {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		background: colors.$white;
		top: 80%;
		right: 20px;
		border: 1px solid colors.$gray-mid;
		border-radius: 2px;
		box-shadow: 1px 2px 3px rgba( 0, 0, 0, 0.1);
		transition: opacity 200ms global.$easing, visibility 200ms global.$easing;

		a {
			display: block;
			position: relative;
			padding: map.get(units.$spacing, 'xx-small') map.get(units.$spacing, 'medium') map.get(units.$spacing, 'xx-small') map.get(units.$spacing, 'xx-small');
			color: colors.$black;

			&:hover,
			&:focus {
				background: colors.$gray-light;
			}

			&.active {
				background: colors.$primary-light;
			}

			svg {
				position: absolute;
				right: 4px;
				top: 50%;
				margin-top: -7px;

				path {
					fill: colors.$black;
				}
			}
		}
	}

	&:hover,
	&:focus {
		.navigation-locale-dropdown {
			opacity: 1;
			visibility: visible;
		}
	}
}
</style>
