<template>
	<div class="content-card flow">
		<div class="section-heading">
			<div class="repel" data-nowrap="">
				<h2>Your Bank Details</h2>
				<button class="link-button" @click="visible = !visible">Calculate your IBAN</button>
			</div>
			<hr/>
		</div>

		<div class="iban-calculator" :data-visible="visible ? true : null" :data-submitted="submitted ? true : null">
			<div class="iban-calculator__heading repel" data-nowrap>
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true">
						<BankIcon/>
					</div>
					<strong>IBAN Calculator</strong>
				</div>
				<button class="iban-calculator__close" @click="visible = false">
					<Close/>
				</button>
			</div>
			<div class="iban-calculator__scroller">
				<div role="form">
					<p>Enter your bank account number and bank code to calculate your IBAN</p>
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
					<button class="button" @click="submitted = true">Calculate your IBAN</button>
				</div>
				<div class="iban-calculator__result">
					<div class="flow">
						<p>This is your calculated bank information:</p>
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
						<button class="button" @click="visible = false">Yes</button>
						<button class="button" data-button-style="hollow" @click="submitted = false">No</button>
					</div>
				</div>
			</div>
		</div>

		<div class="field-container flow">
			<label for="iban">IBAN</label>
			<input type="text" name="iban" id="iban" placeholder="e.g., DE12345678909876543210">
			<p class="field-container__error-text">Please enter a valid IBAN.</p>
		</div>
	</div>

	<div class="content-card flow">
		<div class="section-heading">
			<div class="repel" data-nowrap="">
				<h2>Your Bank Details With IBAN Errors</h2>
				<button class="link-button" @click="visible2 = !visible2">Calculate your IBAN</button>
			</div>
			<hr/>
		</div>

		<div class="iban-calculator" :data-visible="visible2 ? true : null">
			<div class="iban-calculator__heading repel" data-nowrap>
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true">
						<BankIcon/>
					</div>
					<strong>IBAN Calculator</strong>
				</div>
				<button class="iban-calculator__close" @click="visible2 = false">
					<Close/>
				</button>
			</div>
			<div class="iban-calculator__scroller">
				<div role="form">
					<p>Enter your bank account number and bank code to calculate your IBAN</p>
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
				<div class="iban-calculator__result">
					<div class="flow">
						<p>This is your calculated bank information:</p>
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
						<button class="button" @click="visible2 = false">Yes</button>
						<button class="button" data-button-style="hollow">No</button>
					</div>
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
import { ref } from 'vue';
import Close from '@src/pattern_library/components/icons/Close.vue';

defineOptions( { inheritAttrs: false } );

const visible = ref<boolean>( false );
const submitted = ref<boolean>( false );

const visible2 = ref<boolean>( false );

</script>
