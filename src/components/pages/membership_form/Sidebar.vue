<template>
	<ServiceTeamContact :assets-path="assetsPath"/>
	<ContentCard :is-sidebar-card="true">
		<template #content>
			<h2 class="highlighted-content-text"><strong>{{ $t( 'membership_form_sidebar_title' ) }}</strong></h2>
			<MembersIcon class="highlighted-icon"/>
			<p>{{ $t( 'membership_form_sidebar_text' ) }}</p>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ContentCard from '@src/components/patterns/ContentCard.vue';
import MembersIcon from '@src/components/shared/icons/MembersIcon.vue';
import ServiceTeamContact from '@src/components/shared/sidebar_cards/ServiceTeamContact.vue';

interface Props {
	assetsPath: string;
}

defineProps<Props>();
</script>
