<template>
	<div class="navigation-locale">
		<button class="navigation-locale-current"
			type="button"
			id="menubutton1"
			aria-haspopup="true"
			:aria-expanded="popUpIsOpen"
			aria-controls="menu1"
			ref="buttonNode"
			@keydown="onButtonKeydown"
			@click="onButtonClick"
		>
			{{ locale === 'de_DE' ? 'de' : 'en' }} <ChevronDown/>
		</button>
			<ul class="navigation-locale-dropdown"
				id="menu1"
				role="menu"
				tabindex="-1"
				aria-labelledby="menubutton1"
				:aria-activedescendant="selectedMenuItem"
				ref="menuNode"
				v-show="popUpIsOpen"
				@keydown="onMenuKeydown"
			>
				<li v-for="( item, index ) in menuItems"
					:key="index"
					:id="'mi' + (index + 1)"
					role="menuitem"
					:class="{ 'active': selectedIndex === index }"
					:tabindex="selectedIndex === index ? 0 : -1"
					@keydown="onMenuKeydown"
					@click="onMenuitemClick"
					@mouseover="onMenuitemMouseover"
					:data-locale="item.locale"
				>
					<a :class="{ 'active': locale === item.locale, 'focus': focusedIndex === index }">
						{{ item.label }} <Checkmark v-if="locale === item.locale"/>
					</a>
				</li>
			</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Cookies from 'js-cookie';
import { COOKIE_NAME, DEFAULT_LOCALE } from '@src/util/createLocalisation';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import Checkmark from '@src/components/shared/icons/Checkmark.vue';

const locale = ref<string>( Cookies.get( COOKIE_NAME ) ?? DEFAULT_LOCALE );

const menuItems = ref( [
	{ locale: 'de_DE', label: 'Deutsch' },
	{ locale: 'en_GB', label: 'English' },
] );

const setLocale = ( value: string ): void => {
	locale.value = value;
	Cookies.set( COOKIE_NAME, value );
	window.location.reload();
};

const buttonNode = ref( null );
const menuNode = ref( null );
const popUpIsOpen = ref( false );
const selectedMenuItem = ref( '' );
const selectedIndex = computed( () =>
	menuItems.value.findIndex( ( currentItem ) => currentItem.locale === locale.value )
);
const focusedIndex = ref( -1 );

const closePopup = () => {
	if ( popUpIsOpen.value === true ) {
		popUpIsOpen.value = false;
		buttonNode.value.focus();
	}
};

const setFocusToFirstMenuitem = () => {
	focusedIndex.value = 0;
};

const openPopup = () => {
	popUpIsOpen.value = true;
	menuNode.value.focus();
};

const setFocusToLastMenuitem = () => {
	focusedIndex.value = menuItems.value.length - 1;
};

const setFocusToPreviousMenuitem = () => {
	focusedIndex.value = focusedIndex.value === 0 ? menuItems.value.length - 1 : focusedIndex.value - 1;
};

const setFocusToNextMenuitem = () => {
	focusedIndex.value = focusedIndex.value === menuItems.value.length - 1 ? 0 : focusedIndex.value + 1;
};

const setFocusByFirstCharacter = ( char: string ) => {
	const index = menuItems.value.findIndex(
		( currentItem ) => currentItem.label.slice( 0, 1 ).toLowerCase() === char.toLowerCase()
	);
	if ( index !== -1 ) {
		focusedIndex.value = index;
	}
};

const onButtonKeydown = ( event: KeyboardEvent ) => {
	const key = event.key;
	let flag = false;

	switch ( key ) {
		case ' ':
		case 'Enter':
		case 'ArrowDown':
		case 'Down':
			openPopup();
			setFocusToFirstMenuitem();
			flag = true;
			break;

		case 'Esc':
		case 'Escape':
			closePopup();
			flag = true;
			break;

		case 'Up':
		case 'ArrowUp':
			openPopup();
			setFocusToLastMenuitem();
			flag = true;
			break;

		default:
			break;
	}

	if ( flag ) {
		event.stopPropagation();
		event.preventDefault();
	}
};

const onButtonClick = ( event: MouseEvent ) => {
	if ( popUpIsOpen.value === true ) {
		closePopup();
	} else {
		openPopup();
		setFocusToFirstMenuitem();
	}
	event.stopPropagation();
	event.preventDefault();
};

const onMenuKeydown = ( event: KeyboardEvent ) => {
	const key = event.key;
	let flag = false;

	function isPrintableCharacter( str: string ) {
		return str.length === 1 && str.match( /\S/ );
	}

	if ( event.ctrlKey || event.altKey || event.metaKey ) {
		return;
	}

	if ( event.shiftKey ) {
		if ( isPrintableCharacter( key ) ) {
			setFocusByFirstCharacter( key );
			flag = true;
		}

		if ( event.key === 'Tab' ) {
			closePopup();
			flag = true;
		}
	} else {
		switch ( key ) {
			case ' ':
			case 'Enter':
				closePopup();
				setLocale( menuItems.value[ focusedIndex.value ].locale );
				flag = true;
				break;

			case 'Esc':
			case 'Escape':
				closePopup();
				flag = true;
				break;

			case 'Up':
			case 'ArrowUp':
				setFocusToPreviousMenuitem();
				flag = true;
				break;

			case 'ArrowDown':
			case 'Down':
				setFocusToNextMenuitem();
				flag = true;
				break;

			case 'Home':
			case 'PageUp':
				setFocusToFirstMenuitem();
				flag = true;
				break;

			case 'End':
			case 'PageDown':
				setFocusToLastMenuitem();
				flag = true;
				break;

			case 'Tab':
				closePopup();
				break;

			default:
				if ( isPrintableCharacter( key ) ) {
					setFocusByFirstCharacter( key );
					flag = true;
				}
				break;
		}
	}

	if ( flag ) {
		event.stopPropagation();
		event.preventDefault();
	}
};

const onMenuitemMouseover = ( event: MouseEvent ) => {
	const target = event.currentTarget as HTMLElement;
	focusedIndex.value = menuItems.value.findIndex(
		( currentItem ) => currentItem.locale === target.getAttribute( 'data-locale' )
	);
};

const onMenuitemClick = ( event: MouseEvent ) => {
	const target = event.currentTarget as HTMLElement;
	closePopup();
	setLocale( target.getAttribute( 'data-locale' ) );
};

const onBackgroundMousedown = ( event: MouseEvent ) => {
	if ( !buttonNode.value.contains( event.target ) ) {
		if ( popUpIsOpen.value === true ) {
			closePopup();
		}
	}
};

onMounted( ()=> {
	document.body.addEventListener( 'click', onBackgroundMousedown );
} );

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

	&-current {
		background: colors.$white;
		border: none;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: colors.$primary;
		font-weight: bold;
		text-transform: uppercase;

		svg {
			width: 10px;
			margin-left: 5px;
			margin-top: 3px;
			path {
				stroke: colors.$primary;
			}
		}
	}

	&-dropdown {
		position: absolute;
		background: colors.$white;
		top: 80%;
		right: 20px;
		border: 1px solid colors.$gray-mid;
		border-radius: 2px;
		box-shadow: 1px 2px 3px rgba( 0, 0, 0, 0.1);
		transition: opacity 200ms global.$easing, visibility 200ms global.$easing;

		a {
			display: block;
			position: relative;
			padding: map.get(units.$spacing, 'xx-small') map.get(units.$spacing, 'medium') map.get(units.$spacing, 'xx-small') map.get(units.$spacing, 'xx-small');
			color: colors.$primary;

			&:hover,
			&:focus,
			&.focus {
				background: colors.$gray-light;
				text-decoration: none;
			}

			svg {
				position: absolute;
				right: 4px;
				top: 50%;
				margin-top: -7px;

				path {
					fill: colors.$black;
				}
			}
		}
	}
}
</style>
