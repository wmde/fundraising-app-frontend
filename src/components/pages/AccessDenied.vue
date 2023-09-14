<template>
	<div class="column is-full">
		<h1 class="title">{{ $t( 'access_denied_header' ) }}</h1>
		<span v-html="$t( errorData.message ? errorData.message : 'access_denied' )"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'AccessDenied',
	props: [
		'errorData',
	],
} );
</script>
