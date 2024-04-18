<template>
	<div class="funds_distribution_accordion">
		<details v-for="fundsItem in applicationOfFundsData" :key="fundsItem.id" class="funds_distribution_info_item">
			<summary
				class="funds_distribution_info_item__title"
				tabindex="0"
				:style="{color: fundsItem.colour}"
			>
				{{ fundsItem.title }} {{ fundsItem.percentage }}%
			</summary>
			<div class="funds_distribution_info_item__text">
				{{ fundsItem.text }}
			</div>
		</details>
	</div>
</template>

<script setup lang="ts">
import { FundsItem } from '@src/view_models/useOfFunds';

interface Props {
	applicationOfFundsData: FundsItem[]
}

defineProps<Props>();
</script>
