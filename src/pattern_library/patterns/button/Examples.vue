<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Button Examples</h2>
			<hr/>
		</div>

		<div class="cluster">
			<button class="button">Button Button</button>
			<a href="#" class="button">Link Button</a>
			<button class="button" data-button-style="hollow">Hollow Button</button>
			<button class="button" data-button-size="small">Small Button</button>
			<button class="button" data-button-size="small" data-button-style="hollow">Small Hollow Button</button>
		</div>
	</div>
</template>
<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
