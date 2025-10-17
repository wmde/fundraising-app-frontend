<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Example</h2>
			<hr/>
		</div>

		<div class="field-container flow">
			<label for="custom-amount">Enter a custom amount</label>
			<div class="text-radio">
				<span class="text-radio__radio"></span>
				<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="e.g., 30">
				<span class="text-radio__currency">€</span>
			</div>
		</div>

		<div class="field-container flow" data-error>
			<label for="custom-amount">Enter a custom amount</label>
			<div class="text-radio">
				<span class="text-radio__radio"></span>
				<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="e.g., 30">
				<span class="text-radio__currency">€</span>
			</div>
			<p class="field-container__error-text">Please enter a custom amount.</p>
		</div>

		<div class="field-container flow">
			<label for="custom-amount">Enter a custom amount</label>
			<div class="text-radio" data-direction="rtl">
				<span class="text-radio__radio text-radio__radio--checked"></span>
				<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="e.g., 30">
				<span class="text-radio__currency">€</span>
			</div>
		</div>

	</div>

</template>

<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
