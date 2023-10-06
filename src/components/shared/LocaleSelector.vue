<template>
	<div class="navbar-language">
		<a v-on:click="setCookie( 'de_DE' )" v-bind:class="[{ 'active': locale === 'de_DE' }, 'navbar-item']">
			de
		</a>
		<a v-on:click="setCookie( 'en_GB' )" v-bind:class="[{ 'active': locale === 'en_GB' }, 'navbar-item']">
			en
		</a>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@src/util/createLocalisation';

const locale = ref<string>( Cookies.get( COOKIE_NAME ) ?? DEFAULT_LOCALE );

const setCookie = ( value: string ): void => {
	locale.value = value;
	Cookies.set( COOKIE_NAME, value );
	window.location.reload();
};

</script>
