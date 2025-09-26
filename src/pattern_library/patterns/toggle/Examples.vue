<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Toggle</h2>
			<hr/>
		</div>

		<div class="field-container flow">
			<label>
				Spendenquittung
				<input type="checkbox" name="toggle" class="toggle" id="toggle">
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
