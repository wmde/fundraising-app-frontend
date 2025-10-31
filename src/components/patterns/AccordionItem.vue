<template>
	<details :name="name ? name : null">
		<summary tabindex="0">
			<slot name="title"/><span class="accordion__summary-meta"><slot name="meta"/><ChevronDown/></span>
		</summary>
		<div>
			<slot name="content"/>
		</div>
	</details>
</template>

<script setup lang="ts">
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';

interface Props {
	name?: string;
}

defineProps<Props>();

</script>
