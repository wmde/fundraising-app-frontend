<template>
	<ContentCard class="membership-fee-error-page">
		<template #content>
			<IconText>
				<template #icon><WarningIcon/></template>
				<template #content>
					<div class="flow">
						<h2>{{ $t('membership_fee_upgrade_error_page_headline') }}</h2>
						<p>{{ $t('membership_fee_upgrade_error_page_text') }}</p>
					</div>
				</template>
			</IconText>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
</script>
