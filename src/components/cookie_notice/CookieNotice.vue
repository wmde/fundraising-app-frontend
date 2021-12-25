<template>
	<div class="cookie-notice" v-if="!isSubmitted">

		<form
			class="cookie-notice-content"
			ref="cookieNotice"
			action="/set-cookie-preferences"
		>
			<h3>{{ $t( 'cookie_heading' ) }}</h3>
			<div class="cookie-notice-content-block">
				<div class="cookie-notice-text-content">
					<div class="cookie-notice-info">
						<div class="cookie-notice-text">
							<p class="cookie-notice-text-copy" >
								<span v-html="$t( 'cookie_content' )"></span>
							</p>
						</div>
					</div>
					<div class="cookie-notice-category-explanation">
						<div>
							<div class="cookie-notice-category-headline icon-inline">{{ $t('cookie_option_required_heading') }}</div>
							<TextTruncator>
								{{ $t('cookie_option_required_content') }}
							</TextTruncator>
						</div>
						<div>
							<div class="cookie-notice-category-headline icon-inline">{{ $t('cookie_option_optional_heading') }}</div>
							<TextTruncator>
								{{ $t('cookie_option_optional_content') }}
							</TextTruncator>
						</div>
					</div>
				</div>
				<div class="cookie-notice-buttons">
					<div class="cookie-notice-buttons-acceptance">
						<div class="cookie-notice-button necessary">
							<button class="button is-primary is-main" v-on:click="onSaveButtonClick">
								<span>{{ $t( 'cookie_button_necessary' ) }}</span>
							</button>
						</div>
						<div class="cookie-notice-button accept">
							<button class="button is-primary is-main" v-on:click="onAcceptButtonClick">
								<span>{{ $t( 'cookie_button_accept' ) }}</span>
							</button>
						</div>
					</div>
					<div class="cookie-notice-info-links">
						<a href="/page/Impressum">{{ $t('cookie_link_imprint') }}</a>|
						<a href="/page/Datenschutz">{{ $t('cookie_link_privacy_protection') }}</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { inject, ref } from '@vue/composition-api';
import CookieCheckbox from './CookieCheckbox.vue';
import { CONSENT_STATE, CookieConsentInterface, NullCookieConsent } from '@/cookie_consent';
import TextTruncator from '@/components/cookie_notice/TextTruncator.vue';

export default Vue.extend( {
	name: 'CookieNotice',
	components: {
		TextTruncator,
		CookieCheckbox,
	},
	inject: [ 'cookieConsent' ],
	setup() {
		const cookieConsent = inject<CookieConsentInterface>( 'cookieConsent', NullCookieConsent );

		const isSubmitted = cookieConsent.consentIsSubmitted;
		const cookieNotice = ref<any>( null );

		const onSaveButtonClick = ( e: Event ) => {
			e.preventDefault();
			cookieConsent.submitConsent( CONSENT_STATE.FALSE );
		};

		const onAcceptButtonClick = ( e: Event ) => {
			e.preventDefault();
			cookieConsent.submitConsent( CONSENT_STATE.TRUE );
		};

		return {
			cookieNotice,
			isSubmitted,
			onSaveButtonClick,
			onAcceptButtonClick,
		};
	},
} );
</script>
