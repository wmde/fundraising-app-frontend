<template>
	<div
		class="comment-ticker"
		:class="[ currentState ]"
		:style="{
			'--background': background,
			'--display-time': `${ DISPLAY_TIME }ms`,
			'--hide-time': `${ HIDE_TIME / 2 }ms`,
		}">
		<div class="comment-ticker-timer">
			<div class="comment-ticker-timer-inner" :class="{ play: currentState === TickerStates.Displaying }"></div>
		</div>

		<div class="comment-ticker-logo">
			<a href="https://www.wikimedia.de/"><Logo/></a>
		</div>

		<blockquote class="comment-ticker-content">
			<header class="comment-ticker-donor">{{ comment.donor }}</header>
			<p class="comment-ticker-comment">
				<span
					v-for="( word, index ) in words"
					class="comment-ticker-word"
					:class="{ play: currentState === TickerStates.Displaying }"
					:style="{ '--index': Number( index ) + 1 }"
				>
					{{ word }}&nbsp;
				</span>
			</p>
			<footer class="comment-ticker-meta">{{ $n( Number( comment.amount ), { key: 'currency' } ) }} - {{ comment.date }}</footer>
		</blockquote>
	</div>
</template>

<script setup lang="ts">

import { Comment } from '@src/view_models/Comment';
import { computed, onMounted, ref } from 'vue';
import { useCommentResource } from '@src/components/pages/useCommentResource';
import Logo from '@src/components/layout/Logo_var.vue';

enum TickerStates {
	Initialising = 'comment-ticker--initialising',
	Displaying = 'comment-ticker--displaying',
	Hiding = 'comment-ticker--hiding',
	SlideFinished = 'comment-ticker--slide-finished',
}

const BACKGROUNDS: string[] = [
	'#41688d',
	'#006cd3',
	'#b37125',
	'#b25f00',
	'#cc54c3',
	'#ff4af1',
	'#874e82',
	'#8e2424',
	'#a44545',
	'#3bc81a',
	'#3d8627',
	'#4b843e',
	'#b9b113',
	'#b3af51',
	'#727053',
	'#9401f6',
	'#7412b5',
	'#6b318b',
	'#348686',
	'#246262',
	'#787878',
	'#9e9e9e',
];

const DISPLAY_TIME = 10000;
const HIDE_TIME = 1000;

const { comments, fetchComments } = useCommentResource();

const currentIndex = ref<number>( 0 );
const currentState = ref<TickerStates>( TickerStates.Initialising );
const background = ref<string>( '#000000' );
const comment = computed<Comment>( () => comments.value[ currentIndex.value ] || { amount: '', comment: '', date: '', donor: '' } );
const words = computed<string[]>( () => comment.value.comment.split( ' ' ) );
const timer = ref<number>( 0 );

const randomiseBackground = (): void => {
	background.value = BACKGROUNDS[ Math.floor( Math.random() * BACKGROUNDS.length ) ];
};

const showComment = (): Promise<any> => {
	currentState.value = TickerStates.Displaying;
	randomiseBackground();

	return new Promise( ( resolve ) => {
		timer.value = window.setTimeout( () => resolve( true ), DISPLAY_TIME );
	} );
};

const hideComment = (): Promise<any> => {
	currentState.value = TickerStates.Hiding;

	return new Promise( ( resolve ) => {
		timer.value = window.setTimeout( () => resolve( true ), HIDE_TIME );
	} );
};

const moveToNextComment = async (): Promise<any> => {
	currentState.value = TickerStates.SlideFinished;
	currentIndex.value++;
	if ( currentIndex.value >= comments.value.length ) {
		await fetchComments();
		currentIndex.value = 0;
	}
	return Promise.resolve();
};

const runTicker = async () => {
	while ( true ) {
		await showComment();
		await hideComment();
		await moveToNextComment();
	}
};

onMounted( async () => {
	currentState.value = TickerStates.Initialising;
	await fetchComments();
	currentIndex.value = 0;
	runTicker();
} );

</script>

<style lang="scss">
@use '../../scss/settings/global';
@use '../../scss/settings/colors';
@use '../../scss/settings/breakpoints';
@use 'sass:map';

$font-family-serif: Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif;
$font-family-sans: Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif;

@keyframes play-timer {
	0% {
		width: 0;
	}
	100% {
		width: 100%;
	}
}

@keyframes show-words {
	0% {
		transform: translateY( 20px );
		opacity: 0;
	}
	100% {
		transform: translateY( 0 );
		opacity: 1;
	}
}

header,
footer,
p {
	margin: 0;
}

.comment-ticker {
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 999;
	overflow-y: auto;
	color: colors.$white;
	background: var( --background );
	transition: background-color 500ms ease-in-out;

	* {
		box-sizing: border-box;
	}

	&-logo {
		position: absolute;
		width: 36px;
		top: 15px;
		left: 10px;
		opacity: 0;
		transition: opacity 500ms ease-in-out;

		@include breakpoints.tablet-up {
			width: 60px;
			top: 20px;
			left: 20px;
		}

		.wikimedia-logo-graphic,
		svg {
			width: 100%;
			height: auto;
		}
	}

	&-timer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background: rgba( 0 0 0 / 10% );
		height: 5px;

		&-inner {
			position: absolute;
			top: 0;
			left: 0;
			height: 5px;
			width: 0;
			background: rgba( 255 255 255 / 40% );

			&.play {
				animation: play-timer var( --display-time ) linear;
				animation-fill-mode: forwards;
			}
		}
	}

	&-content {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity var( --hide-time ) ease-in-out;
		margin: 0;
		padding: 30px 30px 30px 50px;

		@include breakpoints.tablet-up {
			padding: 50px 50px 50px 130px;
		}
	}

	&-comment {
		position: relative;
		display: block;
		width: 100%;
		font-size: 20px;
		line-height: 1.5;
		margin: 0 0 20px;
		font-family: $font-family-serif;

		@include breakpoints.tablet-up {
			font-size: 30px;
		}

		@include breakpoints.desktop-up {
			font-size: 3vw;
		}

		@include breakpoints.full-hd-up {
			font-size: 2vw;
		}

		&::before {
			content: '“';
			font-family: $font-family-serif;
			color: colors.$black;
			top: 10px;
			left: -40px;
			position: absolute;
			font-size: 55px;
			font-weight: 800;
			width: 25px;
			height: 25px;
			line-height: 25px;
			opacity: 0.1;

			@include breakpoints.tablet-up {
				top: 20px;
				left: -90px;
				font-size: 150px;
				width: 50px;
				height: 50px;
				line-height: 50px;
			}
		}
	}

	&-word {
		display: inline-block;
		&.play {
			transform: translateY( 20px );
			opacity: 0;
			animation: show-words 500ms ease-in-out;
			animation-delay: calc( 0.05s * var( --index ) );
			animation-fill-mode: forwards;
		}
	}

	&-donor,
	&-meta {
		width: 100%;
		font-family: $font-family-sans;
		color: colors.$black;
		opacity: 0.5;
	}

	&-donor {
		font-weight: bold;
		font-size: 30px;
		margin-bottom: 10px;

		@include breakpoints.tablet-up {
			font-size: 60px;
		}

		@include breakpoints.desktop-up {
			font-size: 4.5vw;
		}

		@include breakpoints.full-hd-up {
			font-size: 3.5vw;
		}
	}

	&-meta {
		font-size: 20px;
		text-align: right;
		font-style: italic;

		@include breakpoints.tablet-up {
			font-size: 30px;
		}

		@include breakpoints.desktop-up {
			font-size: 3vw;
		}

		@include breakpoints.full-hd-up {
			font-size: 2vw;
		}
	}

	&--displaying {
		.comment-ticker-content {
			opacity: 1;
		}
		.comment-ticker-logo {
			opacity: 0.6;
		}
	}

	&--hiding {
		.comment-ticker-word {
			opacity: 1;
			transform: translateY( 0 );
		}
	}
}
</style>
