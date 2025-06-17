<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Icon Text Examples</h2>
			<hr/>
		</div>

		<div class="icon-text">
			<div class="icon-text__icon" aria-hidden="true"><SuccessIcon/></div><h1>Icon Heading 1</h1>
		</div>

		<div class="icon-text">
			<div class="icon-text__icon" aria-hidden="true"><WarningIcon/></div><h2>Icon Heading 2</h2>
		</div>

		<div class="icon-text">
			<div class="icon-text__icon" aria-hidden="true"><WarningIcon/></div><h3>Icon Heading 3</h3>
		</div>

		<div class="icon-text">
			<div class="icon-text__icon" aria-hidden="true"><InfoIcon/></div><p><strong>Icon text short</strong></p>
		</div>

		<div class="icon-text">
			<div class="icon-text__icon" aria-hidden="true"><BankIcon/></div><p>Long text. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet, consectetur culpa doloremque ex, exercitationem harum illum in ipsa ipsum, modi natus nemo odio perferendis quaerat quis similique sint tempore.</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
defineOptions( { inheritAttrs: false } );
</script>
