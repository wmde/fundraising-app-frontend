<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h1>{{ page.name }}</h1>
			<hr/>
		</div>
		<div class="flow" v-html="page.content"></div>
	</div>

	<div class="content-card flow" v-if="page.codeSamples">
		<div class="section-heading">
			<h1>Code Samples</h1>
			<hr/>
		</div>

		<template v-for="( codeSample, index ) in page.codeSamples" :key="index">
			<h2>{{ codeSample.name }}</h2>
			<pre><code>{{ codeSample.code.trim() }}</code></pre>
		</template>

	</div>
</template>
<script setup lang="ts">
import { Page } from '@src/pattern_library/pages/Page';

interface Props {
	page: Page;
}

defineProps<Props>();
</script>
