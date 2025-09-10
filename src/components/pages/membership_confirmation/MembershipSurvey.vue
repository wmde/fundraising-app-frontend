<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><DonorIcon/></template>
				<template #content><h2>{{ $t( 'membership_confirmation_survey_title' ) }}</h2></template>
			</IconText>
			<p>{{ $t( 'membership_confirmation_survey_content' ) }}</p>
			<p><a target="_blank" :href="$t( 'membership_confirmation_survey_link', { tracking: tracking } )">{{ $t( 'membership_confirmation_survey_link_text' ) }} <ExternalLink/></a></p>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import DonorIcon from '@src/components/shared/icons/DonorIcon.vue';
import ExternalLink from '@src/components/shared/icons/ExternalLink.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	tracking: string;
}

defineProps<Props>();

</script>
