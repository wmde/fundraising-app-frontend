<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Info Columns Examples</h2>
			<hr/>
		</div>

		<div class="cluster info-columns">
			<div class="flow">
				<div class="info-columns__icon"><SoftwareTechnologyIcon class="highlighted-icon" data-warning/></div>
				<p>Lorem ipsum dolor sit amet</p>
			</div>
			<div class="flow">
				<div class="info-columns__icon"><ShieldIcon class="highlighted-icon"/></div>
				<p>Lorem ipsum dolor sit amet</p>
			</div>
			<div class="flow">
				<div class="info-columns__icon"><BooksIcon class="highlighted-icon" data-error/></div>
				<p>Lorem ipsum dolor sit amet</p>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import SoftwareTechnologyIcon from '@src/components/shared/icons/SoftwareTechnologyIcon.vue';
import ShieldIcon from '@src/components/shared/icons/ShieldIcon.vue';
import BooksIcon from '@src/components/shared/icons/BooksIcon.vue';

defineOptions( { inheritAttrs: false } );
</script>
