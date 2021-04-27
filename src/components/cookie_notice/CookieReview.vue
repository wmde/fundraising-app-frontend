<template>
	<div class="cookie-review has-margin-top-18 has-margin-bottom-18">
		<h2 class="title is-size-2">{{ $t( 'privacy_protection_title' ) }}</h2>
		<fieldset>
			<ul class="cookie-list">
				<li>
					<b-checkbox
						type="checkbox"
						class="is-inline-checkbox cookie-checkbox-checkbox"
						:name="'required'"
						:disabled="true"
						v-model="requiredChecked"
					>
						<span class="cookie-checkbox-heading">{{ $t('cookie_option_required_heading') }}</span>
						<span class="cookie-checkbox-content-full">{{ $t('cookie_option_required_content') }}</span>
					</b-checkbox>
				</li>
				<li>
					<b-checkbox
						type="checkbox"
						class="is-inline-checkbox cookie-checkbox-checkbox"
						:name="'optional'"
						v-model="optionalChecked"
					>
						<span class="cookie-checkbox-heading">{{ $t('cookie_option_optional_heading') }}</span>
						<span class="cookie-checkbox-content-full">{{ $t('cookie_option_optional_content') }}</span>
					</b-checkbox>
				</li>
			</ul>
		</fieldset>
		<div class="cookie-review-buttons">
			<div class="cookie-review-button save">
				<button class="button is-primary is-main is-outlined" :class="{ 'is-loading' : isSettingConsent }" v-on:click="onSaveButtonClick">
					<span>{{ $t( 'cookie_button_save' ) }}</span>
				</button>
			</div>
			<div class="cookie-review-button accept">
				<button class="button is-primary is-main is-outlined" :class="{ 'is-loading' : isSettingConsent }" v-on:click="onAcceptButtonClick">
					<span>{{ $t( 'cookie_button_accept' ) }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ref, watch, inject } from '@vue/composition-api';
import { CookieConsentInterface, CONSENT_STATE } from '@/cookie_consent';

export default Vue.extend( {
	name: 'CookieReview',
	inject: [ 'cookieConsent' ],
	setup() {
		const cookieConsent = inject<CookieConsentInterface>( 'cookieConsent' );

		if ( !cookieConsent ) {
			throw new Error( 'Could not resolve cookieConsent' );
		}

		const isSettingConsent = ref<boolean>( false );
		const requiredChecked = ref<boolean>( true );
		const optionalChecked = ref<boolean>( cookieConsent.consentIsGiven.value );

		const setConsent = async ( consent: symbol ) => {
			isSettingConsent.value = true;
			await cookieConsent.submitConsent( consent );
			isSettingConsent.value = false;
		};

		const onSaveButtonClick = ( e: Event ) => {
			e.preventDefault();
			setConsent( optionalChecked.value ? CONSENT_STATE.TRUE : CONSENT_STATE.FALSE );
		};

		const onAcceptButtonClick = ( e: Event ) => {
			e.preventDefault();
			optionalChecked.value = true;
			setConsent( CONSENT_STATE.TRUE );
		};

		watch( cookieConsent.consentState, () => {
			optionalChecked.value = cookieConsent.consentIsGiven.value;
		} );

		return {
			isSettingConsent,
			requiredChecked,
			optionalChecked,
			onSaveButtonClick,
			onAcceptButtonClick,
		};
	},
} );
</script>
