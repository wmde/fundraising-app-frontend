<template>
	<div class="system-message">
		<h1 class="title">{{ $t( 'system_message_page_header' ) }}</h1>
		<span>{{ $t( errorData.message ) }}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'SystemMessage',
	props: [
		'errorData',
	],
} );
</script>
