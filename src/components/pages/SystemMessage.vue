<template>
	<div class="system-message">
		<h1 class="title">{{ $t( 'system_message_page_header' ) }}</h1>
		<span>{{ $t( errorData.message ) }}</span>
	</div>
</template>

<script setup lang="ts">

defineOptions( {
	name: 'SystemMessage',
} );

interface Props {
	errorData;
}

defineProps<Props>();

</script>
