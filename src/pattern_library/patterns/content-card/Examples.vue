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
</template>
<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
