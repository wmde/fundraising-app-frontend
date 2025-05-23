<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h1>{{ page.name }}</h1>
			<hr/>
		</div>
		<div class="flow" v-html="page.content"></div>
	</div>
</template>
<script setup lang="ts">
import { Page } from '@src/pattern_library/pages/Page';

interface Props {
	page: Page;
}

defineProps<Props>();
</script>
