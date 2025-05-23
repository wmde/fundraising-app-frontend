<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h1>{{ pattern.name }}</h1>
			<hr/>
		</div>
		<div v-html="pattern.description"></div>
	</div>

	<component :is="pattern.examples" :assets-path="assetsPath"/>

	<div class="content-card flow">
		<div class="section-heading">
			<h2>HTML</h2>
			<hr/>
		</div>
		<pre><code>{{ pattern.html.trim() }}</code></pre>
	</div>

	<div class="content-card flow">
		<div class="section-heading">
			<h2>CSS</h2>
			<hr/>
		</div>
		<pre><code>{{ pattern.css.trim() }}</code></pre>
	</div>

</template>

<script setup lang="ts">

import { Pattern } from '@src/pattern_library/patterns/Pattern';

interface Props {
	pattern: Pattern;
	assetsPath: string;
}

defineProps<Props>();

</script>
