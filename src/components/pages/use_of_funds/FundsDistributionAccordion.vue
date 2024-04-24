<template>
	<div class="funds_distribution_accordion">
		<details
			v-for="( fundsItem, index ) in applicationOfFundsData"
			:key="index"
			class="funds_distribution_info_item"
			:style="{ 'border-left': `10px solid ${ fundsItem.colour }` }"
		>
			<summary
				class="funds_distribution_info_item__title"
				tabindex="0"
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
