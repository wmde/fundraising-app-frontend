<template>
	<div class="sticky flow">
		<slot/>
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>CSS</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li v-for="page in content.pages" :key="page.url">
					<a :href="'/pattern-library/' + page.url">{{ page.name }}</a>
				</li>
			</ul>
		</div>
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>Patterns</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li><a href="/pattern-library">All Patterns</a></li>
				<li v-for="pattern in content.patterns" :key="pattern.url">
					<a :href="'/pattern-library/' + pattern.url">{{ pattern.name }}</a>
				</li>
			</ul>
		</div>
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>Samples</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li v-for="sample in content.samples" :key="sample.url">
					<a :href="'/pattern-library/' + sample.url">{{ sample.name }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Content } from '@src/pattern_library/content';

interface Props {
	content: Content;
}

defineProps<Props>();

</script>
