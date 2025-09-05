<template>
	<div class="sidebar" data-direction="rtl">

		<main class="flow">
			<div class="content-card flow">
				<div class="section-heading">
					<h1>Donation Form</h1>
					<h2>Your Payment Information</h2>
					<hr>
				</div>

				<form action="">
					<fieldset class="field-container flow" data-error>
						<legend>How much would you like to donate?</legend>
						<p>Please choose an amount from the list or enter a custom amount below.</p>

						<div class="field-container__radio-grid">
							<div class="grid" data-layout="quarters">
								<div>
									<label>
										<input type="radio" name="amount" id="amount-500">
										<span>€5</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-1500">
										<span>€15</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-2500">
										<span>€25</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-5000">
										<span>€50</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-7500">
										<span>€75</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-10000">
										<span>€100</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-25000">
										<span>€250</span>
									</label>
								</div>
								<div>
									<label>
										<input type="radio" name="amount" id="amount-30000">
										<span>€300</span>
									</label>
								</div>
							</div>
						</div>
						<div class="flow">
							<label for="custom-amount">Custom Amount</label>
							<div class="text-radio">
								<input type="radio" class="text-radio__radio" name="custom-amount-radio" id="custom-amount-radio">
								<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="€ e.g., 30">
							</div>
							<p class="field-container__error-text">Unfortunately, due to applicable fees, you have to state a minimum amount of EUR 1. If you would like to donate less, please transfer the amount directly to the donation account stated below.</p>
						</div>
					</fieldset>

					<fieldset class="field-container flow">
						<legend>How often would you like to donate?</legend>
						<div class="field-container__radio-grid">
							<div class="grid" data-layout="halves">
								<label>
									<input type="radio" name="interval" id="interval-0">
									<span>Single Payment</span>
								</label>
								<label>
									<input type="radio" name="interval" id="interval-1">
									<span>Monthly</span>
								</label>
								<label>
									<input type="radio" name="interval" id="interval-3">
									<span>Quarterly</span>
								</label>
								<label>
									<input type="radio" name="interval" id="interval-6">
									<span>Twice Yearly</span>
								</label>
								<label>
									<input type="radio" name="interval" id="interval-12">
									<span>Annually</span>
								</label>
							</div>
						</div>
					</fieldset>

					<fieldset class="field-container flow">
						<legend>How would you like to donate?</legend>
						<div class="field-container__radio-grid">
							<div class="grid" data-layout="halves">
								<label>
									<input type="radio" name="payment-type" id="payment-type-dd">
									<span>Direct Debit</span>
								</label>
								<label>
									<input type="radio" name="payment-type" id="payment-type-bt">
									<span>Bank Transfer</span>
								</label>
								<label>
									<input type="radio" name="payment-type" id="payment-type-cc">
									<span>Credit Card</span>
								</label>
								<label>
									<input type="radio" name="payment-type" id="payment-type-pp">
									<span>Paypal</span>
								</label>
							</div>
						</div>
						<p class="field-container__error-text">Please enter your preferred payment method?</p>
					</fieldset>
				</form>
			</div>

			<div class="content-card flow">
				<div class="section-heading">
					<div class="repel" data-nowrap="">
						<h2>Your Bank Details</h2>
						<button class="link-button" @click="ibanVisible = !ibanVisible">Calculate your IBAN</button>
					</div>
					<hr/>
				</div>

				<div class="iban-calculator" :data-visible="ibanVisible ? true : null" :data-submitted="ibanSubmitted ? true : null">
					<div class="iban-calculator__heading repel" data-nowrap>
						<div class="icon-text">
							<div class="icon-text__icon" aria-hidden="true">
								<BankIcon/>
							</div>
							<strong>IBAN Calculator</strong>
						</div>
						<button class="iban-calculator__close" @click="ibanVisible = false">
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
							<button class="button" @click="ibanSubmitted = true">Calculate your IBAN</button>
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
								<button class="button" @click="ibanVisible = false">Yes</button>
								<button class="button" data-button-style="hollow" @click="ibanSubmitted = false">No</button>
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
					<h2>Your Address Information</h2>
					<p>Thank you for your support. You're almost there.</p>
					<hr>
				</div>

				<form action="">
					<fieldset class="field-container flow">
						<legend>How would you like to donate?</legend>
						<label>
							<input type="radio" name="address-type" id="address-type-private">
							<span>As a private individual</span>
						</label>
						<label>
							<input type="radio" name="address-type" id="address-type-company">
							<span>As a company</span>
						</label>
						<label>
							<input type="radio" name="address-type" id="address-type-none">
							<span>Without address data</span>
						</label>
						<p class="field-container__error-text">Please select an address type.</p>
					</fieldset>

					<fieldset class="field-container flow">
						<legend>Form of address</legend>
						<label>
							<input type="radio" name="salutation" id="salutation-mr">
							<span>Mr</span>
						</label>
						<label>
							<input type="radio" name="salutation" id="salutation-ms">
							<span>Ms</span>
						</label>
						<label>
							<input type="radio" name="salutation" id="salutation-none">
							<span>No specification</span>
						</label>
						<p class="field-container__error-text">Please provide your preferred form of address.</p>
					</fieldset>

					<div class="field-container flow">
						<label for="country">Title</label>
						<select name="title" id="title">
							<option value="ie">No Title</option>
							<option value="de">Dr.</option>
							<option value="fr">Prof.</option>
							<option value="be">Prof. Dr.</option>
						</select>
					</div>

					<div class="field-container flow">
						<label for="first-name">First Name</label>
						<input type="text" name="first-name" id="first-name" placeholder="e.g., Joe or Jane">
						<p class="field-container__error-text">Please enter your first name.</p>
					</div>

					<div class="field-container flow" data-error>
						<label for="last-name">Last Name</label>
						<p class="field-container__help-text">This is the name that comes after your first name.</p>
						<input type="text" name="last-name" id="last-name" placeholder="e.g., Bloggs">
						<p class="field-container__error-text">Please enter your surname.</p>
					</div>

					<div class="field-container flow">
						<label for="country">Country</label>
						<select name="country" id="country">
							<option value="ie">Ireland</option>
							<option value="de">Germany</option>
							<option value="fr">France</option>
							<option value="be">Belgium</option>
							<option value="sw">Sweden</option>
						</select>
						<p class="field-container__error-text">You must select a number no larger than 3 and no smaller than 3</p>
					</div>

					<div class="field-container flow">
						<label for="postcode">Postcode</label>
						<input type="text" name="postcode" id="postcode" placeholder="e.g., 25950">
						<p class="field-container__error-text">Please enter a valid postcode.</p>
					</div>

					<div class="field-container flow">
						<label for="city">City</label>
						<input type="text" name="city" id="city" placeholder="e.g., Berlin">
						<p class="field-container__error-text">Please enter a valid city.</p>
					</div>

					<div class="field-container flow">
						<label for="street">Street Name</label>
						<input type="text" name="street" id="street" placeholder="e.g., Sesame">
						<p class="field-container__error-text">Please enter a valid street name.</p>
					</div>

					<div class="field-container flow">
						<label for="building-number">Building Number</label>
						<input type="text" name="building-number" id="building-number" placeholder="e.g., 42">
						<p class="field-container__error-text">Please enter a valid building number.</p>
					</div>

					<div class="field-container flow">
						<label>
							<input type="checkbox" name="receipt" id="receipt">
							<span>I would like a donation receipt</span>
						</label>
					</div>

					<div class="field-container flow">
						<label for="email">Email</label>
						<input type="email" name="email" id="email" placeholder="e.g., joe.bloggs@example.com">
						<p class="field-container__error-text">Please enter a valid email.</p>
					</div>

					<div class="field-container flow">
						<div class="verbose-checkbox flow">
							<label>
								<input type="checkbox" name="mailing-list" id="mailing-list" aria-describedby="mailing-list-hint">
								<strong>Yes, I would like to be notified if Wikipedia needs my help in the future. I understand I can revoke my consent at any time by sending an email to spenden@wikimedia.de.</strong>
							</label>
							<p id="mailing-list-hint">If you do not want to receive emails, please uncheck the box. You can also unsubscribe at any time in the future, for example, via the unsubscribe link at the bottom of each email or by sending an email to spenden@wikimedia.de. You can find further information in our <a href="#">privacy policy</a>.</p>
						</div>
					</div>
				</form>

			</div>

			<div class="content-card summary flow">
				<div class="section-heading">
					<h2>Your Donation Summary</h2>
					<p>You will donate €42 monthly via Direct Debit</p>
					<hr/>
				</div>

				<div class="summary__details switcher">
					<div class="flow">
						<h3>Your Contact Data</h3>
						<p>
							<strong>Joe Bloggs</strong><br/>
							Any Street<br/>
							23456 Some City<br/>
							Germany<br/>
							joebloggs@example.com
						</p>
					</div>
					<div class="flow">
						<h3>Your Bank Details</h3>

						<ul class="bankdata">
							<li><strong>IBAN:</strong> DE1234 5678 1234 5678</li>
							<li><strong>BIC:</strong> BS123</li>
							<li><strong>Bank Name:</strong> Berliner Sparkasse</li>
						</ul>
					</div>
				</div>

				<div class="switcher">
					<button class="button" data-button-style="hollow" data-button-fill>Change my payment details</button>
					<button class="button" data-button-fill>Donate now</button>
				</div>
			</div>

		</main>

		<aside>
			<SidebarLinks :content="content">
				<div class="content-card" data-sidebar-card>
					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><InfoIcon/></div><p><strong>Any questions about making a donation?</strong></p>
					</div>
					<p>
						Please contact us using the <a href="#">contact form</a> or by calling: <a href="#">(030) 577 11 62-19</a>
					</p>
				</div>

				<div class="content-card" data-sidebar-card>
					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><BankIcon/></div><p><strong>Donation Account</strong></p>
					</div>
					<ul class="sidebar-links">
						<li><strong>Account holder:</strong> Wikimedia e. V.</li>
						<li><strong>IBAN:</strong> DE09370205000003287300</li>
						<li><strong>BIC:</strong> BFSWDE33XXX</li>
						<li>SozialBank</li>
					</ul>
				</div>
			</SidebarLinks>
		</aside>
	</div>
</template>
<script setup lang="ts">
import SidebarLinks from '@src/pattern_library/components/SidebarLinks.vue';
import { Content } from '@src/pattern_library/content';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import Close from '@src/pattern_library/components/icons/Close.vue';
import { ref } from 'vue';

interface Props {
	content: Content;
}

defineProps<Props>();

const ibanVisible = ref<boolean>( false );
const ibanSubmitted = ref<boolean>( false );

</script>
