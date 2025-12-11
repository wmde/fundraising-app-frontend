<template>
	<ContentCard :is-sidebar-card="true" v-if="externalMemberId">
		<template #content>
			<IconText :is-small-heading="true">
				<template #icon><InfoIcon/></template>
				<template #content><h2>{{ $t( 'membership_fee_upgrade_sidebar_headline' )}}</h2></template>
			</IconText>
			<p>[{{ externalMemberId }}]</p>
		</template>
	</ContentCard>
	<GetInTouch/>
	<BankInfo v-if="!externalMemberId"/>
</template>

<script setup lang="ts">
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';
import GetInTouch from '@src/components/shared/sidebar_cards/GetInTouch.vue';
import BankInfo from '@src/components/shared/sidebar_cards/BankInfo.vue';

interface Props {
	externalMemberId?: number;
}
defineProps<Props>();

</script>
