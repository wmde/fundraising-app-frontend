<template>
	<div class="sticky flow">
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>Design Tokens</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li><a href="/colour">Colour</a></li>
				<li><a href="/typography">Typography</a></li>
				<li><a href="/spacing">Spacing</a></li>
			</ul>
		</div>
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>CSS</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li><a href="/layout-compositions">Layout Compositions</a></li>
				<li><a href="/utilities">Utilities</a></li>
			</ul>
		</div>
		<div class="content-card flow" data-sidebar-card>
			<div class="section-heading">
				<h2>Patterns</h2>
				<hr>
			</div>
			<ul class="sidebar-links">
				<li v-for="pattern in content.patterns" :key="pattern.url">
					<a :href="'/pattern-library/' + pattern.url">{{ pattern.name }}</a>
				</li>

				<li><a href="/public">Home</a></li>
				<li><a href="/site-header">Site Header</a></li>
				<li><a href="/nav">Navigation</a></li>
				<li><a href="/mobile-nav-toggle">Mobile Nav Toggle</a></li>
				<li><a href="/locale">Locale Selector</a></li>
				<li><a href="/public">Site Footer</a></li>
				<li><a href="/footer-nav">Footer Navigation</a></li>
				<li><a href="/accordion">Accordion</a></li>
				<li><a href="/button">Button</a></li>
				<li><a href="/content-card">Content Card</a></li>
				<li><a href="/donation-comment">Donation Comment</a></li>
				<li><a href="/icon-text">Icon Text</a></li>
				<li><a href="/modal-dialogue">Modal Dialogue</a></li>
				<li><a href="/more-info-toggle">More Info Toggle</a></li>
				<li><a href="/section-heading">Section Heading</a></li>
				<li><a href="/summary">Summary</a></li>
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
