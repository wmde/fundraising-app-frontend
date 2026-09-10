<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Examples</h2>
			<hr/>
		</div>
		<form>
			<fieldset class="field-container bordered-radio-field flow" data-max-width>
				<legend>I ain't getting on no plane!</legend>
				<p>I pity the fool who doesn't select one of these</p>
				<label class="bordered-radio-field">
					<input type="radio" name="payment" id="payment-paypal">
					<span>Paypal</span>
				</label>
				<label class="bordered-radio-field">
					<input type="radio" name="payment" id="payment-dd">
					<span>Direct Debit</span>
				</label>
				<label class="bordered-radio-field">
					<input type="radio" name="payment" id="payment-cc">
					<span>Credit Card</span>
				</label>
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
			</fieldset>

			<fieldset class="field-container bordered-radio-field flow" data-max-width>
				<legend>How often would you like to donate?</legend>
				<div class="field-container__radio-grid">
					<div class="grid" data-layout="halves">
						<label class="bordered-radio-field">
							<input type="radio" name="interval" id="interval-0">
							<span>Single Payment</span>
						</label>
						<label class="bordered-radio-field">
							<input type="radio" name="interval" id="interval-1">
							<span>Monthly</span>
						</label>
						<label class="bordered-radio-field">
							<input type="radio" name="interval" id="interval-3">
							<span>Quarterly</span>
						</label>
						<label class="bordered-radio-field">
							<input type="radio" name="interval" id="interval-6">
							<span>Twice Yearly</span>
						</label>
						<label class="bordered-radio-field">
							<input type="radio" name="interval" id="interval-12">
							<span>Annually</span>
						</label>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
</template>
<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
