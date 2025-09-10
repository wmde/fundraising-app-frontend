<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'address_change_form_success_title' ) }}</h1>
		</template>
		<template #content>
			<p v-if="donationReceipt === '1'" v-html="$t( 'address_change_form_success_label' )"></p>
			<p v-else v-html="$t( 'address_change_form_success_optout_label' )"></p>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">

import ContentCard from '@src/components/patterns/ContentCard.vue';

defineOptions( {
	name: 'UpdateAddressSuccess',
} );

interface Props {
	donationReceipt: string;
}

defineProps<Props>();

</script>
