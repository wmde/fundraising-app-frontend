<template>
	<ContentCard :is-sidebar-card="true">
		<template #content>
			<IconText :is-small-heading="true">
				<template #icon><BankIcon class="highlighted-icon"/></template>
				<template #content>
					<h2>
						<span class="highlighted-content-text">{{ $t('bank_data_title_new_prefix') }}</span>
						{{ $t('bank_data_title') }}
					</h2>
				</template>
			</IconText>
			<BankData/>
		</template>
	</ContentCard>
</template>
<script setup lang="ts">

import BankData from '@src/components/shared/BankData.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
</script>
