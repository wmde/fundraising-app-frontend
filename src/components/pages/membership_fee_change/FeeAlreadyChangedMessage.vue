<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><SuccessIcon/></template>
				<template #content>
					<div class="flow">
						<h2>{{ $t('membership_fee_upgrade_returning_page_headline') }}</h2>
						<p>{{ $t('membership_fee_upgrade_returning_page_text') }}</p>
					</div>
				</template>
			</IconText>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
</script>
