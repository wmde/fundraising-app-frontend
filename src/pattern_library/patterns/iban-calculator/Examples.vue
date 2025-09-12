<template>
	<div class="content-card flow">
		<div class="section-heading">
			<div class="repel" data-nowrap="">
				<h2>Your Bank Details</h2>
				<button class="link-button" @click="toggleCalculator1" :aria-expanded="visible1" aria-controls="iban-calculator-1">Calculate your IBAN</button>
			</div>
			<hr/>
		</div>

		<div id="iban-calculator-1" class="iban-calculator" :data-visible="visible1 ? true : null" :data-submitted="submitted1 ? true : null">
			<div class="iban-calculator__heading repel" data-nowrap>
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true">
						<BankIcon/>
					</div>
					<strong>IBAN Calculator</strong>
				</div>
				<button class="iban-calculator__close" @click="visible1 = false">
					<Close/>
				</button>
			</div>
			<div class="iban-calculator__pages">

				<div ref="calculatorForm1" role="form" tabindex="-1" aria-labelledby="iban-calculator-1-form-title" :inert="submitted1" :aria-hidden="submitted1">
					<p id="iban-calculator-1-form-title">Enter your bank account number and bank code to calculate your IBAN</p>
					<div class="field-container flow">
						<label for="account-number">Account Number</label>
						<input type="text" name="account-number" id="account-number">
						<p class="field-container__error-text">Please enter a valid account number.</p>
					</div>
					<div class="field-container flow">
						<label for="bank-code">Bank Code</label>
						<input type="text" name="bank-code" id="bank-code" placeholder="e.g., 50012345">
						<p class="field-container__error-text">Please enter a valid Bank Code.</p>
					</div>
					<button class="button" @click="showResult1">Calculate your IBAN</button>
				</div>

				<div ref="calculatorResult1" class="iban-calculator__result" tabindex="-1" aria-labelledby="iban-calculator-1-result-title" :inert="!submitted1" :aria-hidden="!submitted1">
					<div class="flow">
						<p id="iban-calculator-1-result-title">This is your calculated bank information:</p>
						<ul class="iban-calculator__result-list">
							<li><strong>Bank Account Number:</strong> 0648489890</li>
							<li><strong>Bank Code:</strong> 50010517</li>
							<li><strong>IBAN:</strong> DE12500105170648489890</li>
							<li><strong>BIC:</strong> INGDDEFFXXX</li>
							<li><strong>Bank Name: </strong>ING-DiBa</li>
						</ul>
						<p>Would you like to use it?</p>
					</div>
					<div class="cluster">
						<button class="button" @click="() => { visible1 = false; IBANField1.focus(); }">Yes</button>
						<button class="button" data-style-hollow @click="hideResult1">No</button>
					</div>
				</div>

			</div>
		</div>

		<div class="field-container flow">
			<label for="iban">IBAN</label>
			<input ref="IBANField1" type="text" name="iban" id="iban" placeholder="e.g., DE12345678909876543210">
			<p class="field-container__error-text">Please enter a valid IBAN.</p>
		</div>
	</div>

	<div class="content-card flow">
		<div class="section-heading">
			<div class="repel" data-nowrap="">
				<h2>Your Bank Details With IBAN Errors</h2>
				<button class="link-button" aria-expanded="true" aria-controls="iban-calculator-2">Calculate your IBAN</button>
			</div>
			<hr/>
		</div>

		<div id="iban-calculator-2" class="iban-calculator" data-visible>
			<div class="iban-calculator__heading repel" data-nowrap>
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true">
						<BankIcon/>
					</div>
					<strong>IBAN Calculator</strong>
				</div>
				<button class="iban-calculator__close">
					<Close/>
				</button>
			</div>

			<div class="iban-calculator__pages">
				<div role="form" tabindex="-1" aria-labelledby="iban-calculator-2-form-title">
					<p id="iban-calculator-2-form-title">Enter your bank account number and bank code to calculate your IBAN</p>
					<div class="field-container flow" data-error>
						<label for="account-number">Account Number</label>
						<input type="text" name="account-number" id="account-number">
						<p class="field-container__error-text">Please enter a valid account number.</p>
					</div>
					<div class="field-container flow" data-error>
						<label for="bank-code">Bank Code</label>
						<input type="text" name="bank-code" id="bank-code" placeholder="e.g., 50012345">
						<p class="field-container__error-text">Please enter a valid Bank Code.</p>
					</div>
					<div class="alert-box flow" data-error>
						<p><strong>Please fix the following errors.</strong></p>
						<ul>
							<li><a href="#">Please enter a valid account number.</a></li>
							<li><a href="#">Please enter a valid Bank Code.</a></li>
						</ul>
					</div>
					<button class="button">Calculate your IBAN</button>
				</div>
			</div>
		</div>

		<div class="field-container flow">
			<label for="iban">IBAN</label>
			<input type="text" name="iban" id="iban" placeholder="e.g., DE12345678909876543210">
			<p class="field-container__error-text">Please enter a valid IBAN.</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import { nextTick, ref } from 'vue';
import Close from '@src/pattern_library/components/icons/Close.vue';

defineOptions( { inheritAttrs: false } );

const calculatorForm1 = ref<HTMLElement>();
const calculatorResult1 = ref<HTMLElement>();
const IBANField1 = ref<HTMLElement>();

const visible1 = ref<boolean>( false );
const submitted1 = ref<boolean>( false );

const toggleCalculator1 = async () => {
	visible1.value = !visible1.value;

	if ( visible1.value ) {
		submitted1.value = false;
		await nextTick();
		calculatorForm1.value.focus();
	}
};

const showResult1 = async () => {
	submitted1.value = true;
	await nextTick();
	calculatorResult1.value.focus();
};

const hideResult1 = async () => {
	submitted1.value = false;
	await nextTick();
	calculatorForm1.value.focus();
};

</script>
