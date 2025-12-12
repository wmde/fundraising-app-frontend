<template>
	<div class="navigation-locale" :class="{ 'active': active }" ref="localeSelectorRef">
		<button
			class="navigation-locale-toggle"
			@click="active = !active"
			@keyup.esc="active = false"
			@blur="handleLocaleItemBlur"
			aria-controls="navigation-locale-dropdown"
			:aria-label="active ? $t( 'aria_locale_toggle_label_open' ) : $t( 'aria_locale_toggle_label_closed' )"
			:aria-expanded="active"
		>
			<LocaleIcon/> {{ toggleText }} <ChevronDown/>
		</button>

		<form class="navigation-locale-dropdown" id="navigation-locale-dropdown" @submit.prevent="updateCookie">
			<fieldset class="field-container">
				<legend class="is-sr-only" :lang="localeSelectorItem.value">{{ localeSelectorItem.helpText }}</legend>
				<div class="navigation-locale-item" v-for="( localeItem, index ) in LOCALES" :key="index">
					<RadioFormInput
						input-type="radio"
						:id="`navigation-locale-item-${ localeItem.value }`"
						input-class="navigation-locale-input"
						class="navigation-locale-label"
						name="locale"
						:native-value="localeItem.value"
						:lang="localeItem.value"
						v-model="locale"
						@keyup.esc="active = false"
						@blur="handleLocaleItemBlur"
					>
						<template #label>
							{{ localeItem.label }}
						</template>
					</RadioFormInput>
				</div>
				<div class="navigation-locale-button-container">
					<FormButton
						type="submit"
						class="navigation-locale-button"
						:lang="locale"
						@keyup.esc="active = false"
						@blur="handleLocaleItemBlur"
					>
						{{ localeSelectorItem.button }}
					</FormButton>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES } from '@src/util/createLocalisation';
import type { LocaleSelectorItem } from '@src/util/createLocalisation';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import LocaleIcon from '@src/components/shared/icons/LocaleIcon.vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useDetectOutsideClick } from '@src/components/shared/composables/useDetectOutsideClick';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';

const FOCUSABLE_ELEMENTS = [
	'navigation-locale-toggle',
	'navigation-locale-input',
	'navigation-locale-label',
	'navigation-locale-button',
];

const localeSelectorRef = ref<HTMLElement>();
const locale = ref<string>( Cookies.get( COOKIE_NAME ) ?? DEFAULT_LOCALE );
const localeSelectorItem = computed<LocaleSelectorItem>( () => LOCALES.find( x => x.value === locale.value ) );
const toggleText = localeSelectorItem.value.abbreviation;
const active = ref<boolean>( false );

const updateCookie = (): void => {
	Cookies.set( COOKIE_NAME, locale.value );
	window.location.reload();
};

const handleLocaleItemBlur = () => {
	if ( !active.value ) {
		return;
	}
	// Use setTimeout to wait for a little bit because it takes >100ms
	// after clicking a label for the activeElement to change
	setTimeout( () => {
		const focusedElementClasses = document.activeElement.classList;
		if ( focusedElementClasses && FOCUSABLE_ELEMENTS.filter( value => focusedElementClasses.contains( value ) ).length > 0 ) {
			return;
		}

		// Check if the user has selected some text
		const selectedTextElementClasses = document.getSelection()?.anchorNode?.parentElement?.classList;
		if ( selectedTextElementClasses && FOCUSABLE_ELEMENTS.filter( value => selectedTextElementClasses.contains( value ) ).length > 0 ) {
			return;
		}

		active.value = false;
	}, 400 );
};

useDetectOutsideClick( localeSelectorRef, handleLocaleItemBlur );

</script>

<style lang="scss">
@use "@src/scss/settings/units";
@use "@src/scss/settings/global";
@use "@src/scss/settings/colors";
@use 'sass:map';
@use 'sass:color';

.navigation-locale {
	position: relative;
	width: global.$navbar-height;

	&-toggle {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: colors.$primary;
		font-weight: bold;
		font-size: 1em;
		border: 0;
		width: 100%;
		background: none;

		&:hover,
		&:focus {
			background: colors.$gray-light;
		}

		.locale-icon {
			margin-right: 5px;
		}

		.chevron-down-icon, .chevron-up-icon {
			--chevron-stroke: #{colors.$primary};
			width: 10px;
			margin-left: 4px;
			margin-top: 3px;
		}
	}

	&-dropdown {
		visibility: hidden;
		opacity: 0;
		position: absolute;
		background: colors.$white;
		top: 80%;
		right: 20px;
		width: 180px;
		border: 1px solid colors.$gray-mid;
		border-radius: 2px;
		box-shadow: 1px 2px 3px rgba( 0, 0, 0, 0.1);
		transition: opacity 200ms global.$easing, visibility 200ms global.$easing;

		@media (prefers-reduced-motion) {
			transition-duration: 0ms;
		}
	}

	&-item {
		width: 100%;

		input {
			z-index: 1;
		}

		.navigation-locale-label label {
			border: 0;
			border-radius: 0;
		}

		label:hover,
		input:focus + label,
		input:hover + label {
			background: colors.$gray-light;
			border: 0;
		}

		label:has(input:checked) {
			border: 0;
			background: colors.$primary-locale-active;
			color: colors.$primary;
		}
	}

	&-button-container {
		padding: map.get(units.$spacing, 'x-small');
	}

	.form-button {
		width: 100%;
		height: map.get(units.$spacing, 'x-large');
	}

	&.active {
		.navigation-locale-toggle {
			background: colors.$gray-light;
		}

		.navigation-locale-dropdown {
			visibility: visible;
			opacity: 1;
		}
	}
}
</style>
