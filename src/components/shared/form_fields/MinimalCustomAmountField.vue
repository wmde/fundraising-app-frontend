<template>
	<fieldset class="form-field form-field-radio" :class="[ alignment + '-alignment', { 'is-invalid': showError } ]" >
		<div class="form-field-amount-custom" :class="{ active: isCustomAmount }">
			<label class="form-field-amount-help-text" for="amount-custom">Anderer Betrag:</label>
			<div class="form-field-amount-custom-euro-symbol" :class="{ active: isCustomAmount }">
				<div class="radio radio-form-input">
					<input
						name="amount"
						type="radio"
						class="form-field-amount-custom-radio"
						@click="setCustomAmount"
						:checked="isCustomAmount"
						aria-hidden="true"
						tabindex="-1"
					/>
				</div>

				<TextFormInput
					v-model="customAmount"
					input-type="text"
					input-id="amount-custom"
					:has-message="false"
					name="custom-amount"
					:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_custom_placeholder' ) } )"
					@keydown.enter="setCustomAmount"
					@blur="setCustomAmount"
					@focus.prevent="resetErrorInput"
					@update:model-value="updateAmountFromCustom"
					:aria-invalid="showError"
				/>
			</div>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { computed } from 'vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';

interface Props {
}


</script>
