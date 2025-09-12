<template>
	<div class="donation-confirmation-card donation-survey">
		<IconText>
			<template #icon><DonorIcon/></template>
			<template #content><h2>{{ $t( 'donation_confirmation_survey_title' ) }}</h2></template>
		</IconText>
		<p>{{ $t( 'donation_confirmation_survey_content' ) }}</p>
		<p><a target="_blank" :href="$t( 'donation_confirmation_survey_link', { tracking: tracking } )">{{ $t( 'donation_confirmation_survey_link_text' ) }} <ExternalLink/></a></p>
	</div>
</template>

<script setup lang="ts">
import DonorIcon from '@src/components/shared/icons/DonorIcon.vue';
import ExternalLink from '@src/components/shared/icons/ExternalLink.vue';
import IconText from '@src/components/patterns/IconText.vue';

interface Props {
	tracking: string;
}

defineProps<Props>();

</script>
