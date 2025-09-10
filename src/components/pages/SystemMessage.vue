<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'system_message_page_header' ) }}</h1>
		</template>
		<template #content>
			<p>{{ $t( errorData.message ) }}</p>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">

import ContentCard from '@src/components/patterns/ContentCard.vue';

defineOptions( {
	name: 'SystemMessage',
} );

interface Props {
	errorData: { message: string };
}

defineProps<Props>();

</script>
