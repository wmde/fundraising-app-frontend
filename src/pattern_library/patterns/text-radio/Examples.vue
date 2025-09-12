<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Example</h2>
			<hr/>
		</div>

		<div class="field-container flow">
			<label for="custom-amount">Enter a custom amount</label>
			<div class="text-radio">
				<input type="radio" class="text-radio__radio" name="custom-amount-radio" id="custom-amount-radio">
				<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="€ e.g., 30">
			</div>
		</div>

		<div class="field-container flow" data-error>
			<label for="custom-amount">Enter a custom amount</label>
			<div class="text-radio">
				<input type="radio" class="text-radio__radio" name="custom-amount-radio" id="custom-amount-radio">
				<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="€ e.g., 30">
			</div>
			<p class="field-container__error-text">Please enter a custom amount.</p>
		</div>

	</div>

</template>

<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
