<template>
	<div class="cookie-notice" v-if="!isSubmitted">
		<form
			class="cookie-notice-content"
			ref="cookieNotice"
			action="/set-cookie-preferences"
		>
			<div class="cookie-notice-info">
				<div class="cookie-notice-text">
					<h3>{{ $t( 'cookie_heading' ) }}</h3>
					<p class="cookie-notice-text-copy" :class="{ open: textOpen }">
						<span v-html="$t( 'cookie_content' )"></span>
					</p>

					<b-collapse :open="false">
						<template #trigger="props">
							<a class="cookie-notice-accordion-button icon-inline">
								{{ $t('cookie_option_required_heading') }}
								<span v-if="!props.open" class="icon icon-size"><i class="mdi mdi-arrow-down mdi-24px"></i></span>
								<span v-if="props.open" class="icon icon-size"><i class="mdi mdi-arrow-up mdi-24px"></i></span>
							</a>
						</template>
						<div class="cookie-notice-accordion-content" v-html="$t('cookie_option_required_content')"></div>
					</b-collapse>
					<b-collapse :open="false">
						<template #trigger="props">
							<a class="cookie-notice-accordion-button icon-inline">
								{{ $t('cookie_option_optional_heading') }}
								<span v-if="!props.open" class="icon icon-size"><i class="mdi mdi-arrow-down mdi-24px"></i></span>
								<span v-if="props.open" class="icon icon-size"><i class="mdi mdi-arrow-up mdi-24px"></i></span>
							</a>
						</template>
						<div class="cookie-notice-accordion-content" v-html="$t('cookie_option_optional_content')"></div>
					</b-collapse>
				</div>
			</div>
			<div class="cookie-notice-buttons">
				<div class="cookie-notice-button necessary">
					<button class="button is-primary is-main is-outlined" v-on:click="onSaveButtonClick">
						<span>{{ $t( 'cookie_button_necessary' ) }}</span>
					</button>
				</div>
				<div class="cookie-notice-button accept">
					<button class="button is-primary is-main is-outlined" v-on:click="onAcceptButtonClick">
						<span>{{ $t( 'cookie_button_accept' ) }}</span>
					</button>
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

export default Vue.extend( {
	name: 'CookieNotice',
	components: {
		CookieCheckbox,
	},
	inject: [ 'cookieConsent' ],
	setup() {
		const cookieConsent = inject<CookieConsentInterface>( 'cookieConsent', NullCookieConsent );

		const isSubmitted = cookieConsent.consentIsSubmitted;
		const cookieNotice = ref<any>( null );
		const textOpen = ref( false );

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
			textOpen,
			isSubmitted,
			onSaveButtonClick,
			onAcceptButtonClick,
		};
	},
} );
</script>
