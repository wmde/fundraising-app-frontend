<template>
	<div class="sidebar" data-direction="rtl">

		<main class="flow">
			<form action="" class="flow">
				<div class="content-card flow">
					<div class="section-heading">
						<h1>Ich erhöhe meinen jährlichen Mitgliedsbeitrag: </h1>
						<hr>
					</div>

					<div class="field-container field-container__radio-grid flow" :data-error="error ? true : null">
						<div class="grid" data-layout="halves">
							<div class="flow">
								<label for="preset-amount">Empfehlung:</label>
								<label>
									<input type="radio" name="preset-amount" id="preset-amount">
									<span>€36</span>
								</label>
							</div>
							<div class="flow">
								<label for="custom-amount">Anderer Betrag:</label>
								<div class="text-radio">
									<input type="radio" class="text-radio__radio" name="custom-amount-radio" id="custom-amount-radio">
									<input type="text" class="text-radio__text" name="custom-amount" id="custom-amount" placeholder="€ e.g., 30">
								</div>
							</div>
						</div>
						<p class="field-container__error-text">Please enter a valid fee. Please enter a valid fee.</p>
					</div>
				</div>

				<div class="content-card accordion" data-collapsable>
					<details>
						<summary tabindex="0">Hat sich ihr IBAN geändert? <span class="accordion__summary-meta"><ChevronDown/></span></summary>
						<div class="field-container flow" :data-error="error ? true : null">
							<label for="iban">IBAN</label>
							<input type="text" name="iban" id="iban" placeholder="e.g., DE12345678909876543210">
							<p class="field-container__error-text">Please enter a valid IBAN.</p>
						</div>
					</details>
				</div>

				<div>
					<button class="button" type="submit">Bestätigen</button>
				</div>

			</form>

			<div class="content-card flow">
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true"><SuccessIcon/></div>
					<div class="flow">
						<h1>Herzlichen Dank für Ihre Erhöhung.</h1>
						<p class="callout" data-neutral>Ab sofort stärken Sie uns mit: monatlich 36,00 Euro</p>
						<p>Ihre Bestätigung ist auf dem Weg zu Ihnen. In 1–2 Tagen sollte sie bei Ihnen im Briefkasten liegen.</p>
					</div>
				</div>
			</div>

			<div class="content-card flow">
				<div class="icon-text">
					<div class="icon-text__icon" aria-hidden="true"><SuccessIcon/></div>
					<div class="flow">
						<h1>Sie haben bereits einen großartigen Beitrag geleistet – vielen Dank!</h1>
						<p>Eine weitere Erhöhung ist aktuell nicht möglich.</p>
					</div>
				</div>
			</div>
		</main>

		<aside>
			<SidebarLinks :content="content">
				<div class="content-card" data-sidebar-card>
					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><InfoIcon/></div><p><strong>Ihre Mitgliedsnummer!</strong></p>
					</div>
					<p>
						[78887766]
					</p>
				</div>

				<div class="content-card" data-sidebar-card>
					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><InfoIcon/></div><p><strong>Any questions about making a donation?</strong></p>
					</div>
					<p>
						Please contact us using the <a href="#">contact form</a> or by calling: <a href="#">(030) 577 11 62-19</a>
					</p>
				</div>

				<div class="content-card" data-sidebar-card>
					<button class="button" data-size-small @click="error = !error">Toggle Error State</button>
				</div>
			</SidebarLinks>
		</aside>
	</div>
</template>
<script setup lang="ts">
import SidebarLinks from '@src/pattern_library/components/SidebarLinks.vue';
import { Content } from '@src/pattern_library/content';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import { ref } from 'vue';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';

interface Props {
	content: Content;
}

defineProps<Props>();

const error = ref<boolean>( false );

</script>
