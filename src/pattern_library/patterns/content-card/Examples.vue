<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h1>I am a content card</h1>
			<hr/>
		</div>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores, autem beatae consectetur corporis distinctio earum eveniet fugit illum impedit molestias
		   obcaecati officiis optio pariatur rerum sequi similique soluta sunt.</p>
	</div>

	<div class="content-card flow" data-theme="bordered">
		<div class="section-heading">
			<h1>I am a bordered content card</h1>
			<hr/>
		</div>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores, autem beatae consectetur corporis distinctio earum eveniet fugit illum impedit molestias
		   obcaecati officiis optio pariatur rerum sequi similique soluta sunt.</p>
	</div>

	<div class="grid" data-layout="50-50">
		<div class="content-card flow grid__item-full-width">Content</div>
		<div class="content-card flow" data-sidebar-card>Sidebar Card has less padding</div>
		<div class="content-card flow" data-theme="bordered">Content</div>
	</div>

	<div class="content-card accordion" data-collapsable>
		<details>
			<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
			<div class="flow">
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam asperiores, autem beatae consectetur corporis distinctio earum eveniet fugit illum impedit molestias
				   obcaecati officiis optio pariatur rerum sequi similique soluta sunt.</p>
			</div>
		</details>
	</div>
</template>
<script setup lang="ts">
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';

defineOptions( { inheritAttrs: false } );
</script>
