<template>
	<div class="column is-full">
		<h1 class="title">{{ $t( 'access_denied_header' ) }}</h1>
		<span v-html="$t( errorData.message ? errorData.message : 'access_denied' )"></span>
	</div>
</template>

<script setup lang="ts">

defineOptions( {
	name: 'AccessDenied',
} );

interface Props {
	errorData;
}

defineProps<Props>();

</script>
