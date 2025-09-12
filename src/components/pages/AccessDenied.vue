<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'access_denied_header' ) }}</h1>
		</template>
		<template #content>
			<div v-html="$t( errorData.message ? errorData.message : 'access_denied' )"></div>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">

import ContentCard from '@src/components/patterns/ContentCard.vue';

defineOptions( {
	name: 'AccessDenied',
} );

interface Props {
	errorData: { message: string };
}

defineProps<Props>();

</script>
