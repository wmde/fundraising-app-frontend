<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Examples</h2>
			<hr/>
		</div>
		<form>
			<div class="field-container flow">
				<label for="first-name">First Name</label>
				<input type="text" name="first-name" id="first-name" placeholder="It's a doggy dog world">
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
			</div>

			<div class="field-container flow" data-error>
				<label for="last-name">Last Name</label>
				<p class="field-container__help-text">This is the name that comes after your first name.</p>
				<input type="text" name="last-name" id="last-name" placeholder="It's a doggy dog world">
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
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

			<div class="field-container flow" data-error>
				<label for="city">City</label>
				<select name="city" id="city">
					<option value="ie">Dublin</option>
					<option value="de">Berlin</option>
					<option value="fr">Bielefeld</option>
					<option value="be">Paris</option>
					<option value="sw">Zurich</option>
				</select>
				<p class="field-container__error-text">You must select a number no larger than 3 and no smaller than 3</p>
			</div>

			<fieldset class="field-container flow">
				<legend>I ain't getting on no plane!</legend>
				<p>I pity the fool who doesn't select one of these</p>
				<label>
					<input type="radio" name="payment" id="payment-paypal">
					<span>Paypal</span>
				</label>
				<label>
					<input type="radio" name="payment" id="payment-dd">
					<span>Direct Debit</span>
				</label>
				<label>
					<input type="radio" name="payment" id="payment-cc">
					<span>Credit Card</span>
				</label>
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
			</fieldset>

			<div class="field-container flow">
				<label>
					<input type="checkbox" name="sticker" id="sticker">
					<span>I would love a sticker</span>
				</label>
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
			</div>

			<div class="field-container flow" data-error>
				<label>
					<input type="checkbox" name="sticker" id="sticker">
					<span>I would love a sticker</span>
				</label>
				<p class="field-container__error-text">It's like a bowl in a china shop</p>
			</div>

			<div class="field-container flow">
				<div class="mailing-list-checkbox flow">
					<label>
						<input type="checkbox" name="mailing-list" id="mailing-list" aria-describedby="mailing-list-hint">
						<strong>Yes, I would like to be notified if Wikipedia needs my help in the future. I understand I can revoke my consent at any time by sending an email to spenden@wikimedia.de.</strong>
					</label>
					<p id="mailing-list-hint">If you do not want to receive emails, please uncheck the box. You can also unsubscribe at any time in the future, for example, via the unsubscribe link at the bottom of each email or by sending an email to spenden@wikimedia.de. You can find further information in our <a href="#">privacy policy</a>.</p>
				</div>
			</div>
		</form>
	</div>
</template>
<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
