<template>
	<div
		class="comment-ticker"
		:class="[ currentState, { 'comment-ticker--is-even-index': isEvenIndex } ]"
		:style="{
			'--topLeftColor1': palette1.topLeftColor,
			'--bottomRightColor1': palette1.bottomRightColor,
			'--metaColor1': palette1.metaColor,
			'--commentColor1': palette1.commentColor,
			'--topLeftColor2': palette2.topLeftColor,
			'--bottomRightColor2': palette2.bottomRightColor,
			'--metaColor2': palette2.metaColor,
			'--commentColor2': palette2.commentColor,
			'--display-time': `${ displayTime }ms`,
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
import Logo from '@src/components/layout/Logo.vue';

enum TickerStates {
	Initialising = 'comment-ticker--initialising',
	Displaying = 'comment-ticker--displaying',
	Hiding = 'comment-ticker--hiding',
	SlideFinished = 'comment-ticker--slide-finished',
}

interface Palette {
	topLeftColor: string;
	bottomRightColor: string;
	metaColor: string;
	commentColor: string;
}

const PALETTES: Palette[] = [
	{ topLeftColor: '#000066', bottomRightColor: '#660066', metaColor: '#FF6666', commentColor: '#ffffff' },
	{ topLeftColor: '#660066', bottomRightColor: '#660066', metaColor: '#16022c', commentColor: '#ffffff' },
	{ topLeftColor: '#003366', bottomRightColor: '#669900', metaColor: '#000000', commentColor: '#ffffff' },
	{ topLeftColor: '#003366', bottomRightColor: '#003366', metaColor: '#000000', commentColor: '#ffffff' },
	{ topLeftColor: '#990033', bottomRightColor: '#990066', metaColor: '#ffb0cb', commentColor: '#ffffff' },
	{ topLeftColor: '#000033', bottomRightColor: '#660000', metaColor: '#FF6699', commentColor: '#ffffff' },
	{ topLeftColor: '#41688d', bottomRightColor: '#006cd3', metaColor: '#000000', commentColor: '#ffffff' },
	{ topLeftColor: '#348686', bottomRightColor: '#246262', metaColor: '#04120f', commentColor: '#ffffff' },
	{ topLeftColor: '#7412b5', bottomRightColor: '#6b318b', metaColor: '#1a0c21', commentColor: '#ffffff' },
	{ topLeftColor: '#b9b113', bottomRightColor: '#b25f00', metaColor: '#382309', commentColor: '#ffffff' },
	{ topLeftColor: '#a44545', bottomRightColor: '#8e2424', metaColor: '#2a0b0b', commentColor: '#ffffff' },
	{ topLeftColor: '#3bc81a', bottomRightColor: '#3d8627', metaColor: '#12270c', commentColor: '#ffffff' },
	{ topLeftColor: '#000033', bottomRightColor: '#660033', metaColor: '#f68eff', commentColor: '#ffffff' },
	{ topLeftColor: '#006699', bottomRightColor: '#33CC66', metaColor: '#0b2c23', commentColor: '#ffffff' },
	{ topLeftColor: '#be8419', bottomRightColor: '#954927', metaColor: '#3a2519', commentColor: '#ffffff' },
	{ topLeftColor: '#195bbe', bottomRightColor: '#1e0c4c', metaColor: '#71c8f3', commentColor: '#ffffff' },
	{ topLeftColor: '#b3b3b3', bottomRightColor: '#616161', metaColor: '#191919', commentColor: '#ffffff' },
];

const DISPLAY_TIME = 10000;
const HIDE_TIME = 1000;

const { comments, fetchComments } = useCommentResource();

const currentIndex = ref<number>( 0 );
const isEvenIndex = ref<boolean>( true );
const currentState = ref<TickerStates>( TickerStates.Initialising );
const palette1 = ref<Palette>( PALETTES[ Math.floor( Math.random() * PALETTES.length ) ] );
const palette2 = ref<Palette>( { topLeftColor: '#000000', bottomRightColor: '#000000', metaColor: '#ffffff', commentColor: '#ffffff' } );
const comment = computed<Comment>( () => comments.value[ currentIndex.value ] || { amount: '', comment: '', date: '', donor: '' } );
const words = computed<string[]>( () => comment.value.comment.split( ' ' ) );
// 300 milliseconds per word
const displayTime = computed<number>( () => Math.max( words.value.length * 300, DISPLAY_TIME ) );
const timer = ref<number>( 0 );

const randomisePalette = (): void => {
	if ( isEvenIndex.value ) {
		palette1.value = PALETTES[ Math.floor( Math.random() * PALETTES.length ) ];
	} else {
		palette2.value = PALETTES[ Math.floor( Math.random() * PALETTES.length ) ];
	}
};

const showComment = (): Promise<any> => {
	currentState.value = TickerStates.Displaying;

	return new Promise( ( resolve ) => {
		timer.value = window.setTimeout( () => resolve( true ), displayTime.value );
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
	isEvenIndex.value = !isEvenIndex.value;
	randomisePalette();
	return Promise.resolve();
};

const runTicker = async () => {
	while ( true ) {
		await showComment();
		await hideComment();
		await moveToNextComment();
	}
};

defineOptions( {
	name: 'CommentTicker',
} );

interface Props {
	pageTitle: String;
}

defineProps<Props>();

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

@keyframes show-first-background {
	0% {
		opacity: 0;
	}
	100% {
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
	color: var( --commentColor2 );
	background: var( --topLeftColor1 );
	transition: background 3s ease-in-out, color 3s ease-in-out;

	&::before,
	&::after {
		content: ' ';
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	&::before {
		background: var( --topLeftColor1 );
		background: linear-gradient( 315deg, var( --bottomRightColor1 ) 0%, var( --topLeftColor1 ) 100%);
		z-index: 1;
		opacity: 0;
		animation: show-first-background 3s ease-in-out;
		animation-fill-mode: forwards;
	}

	&::after {
		background: var( --topLeftColor2 );
		background: linear-gradient( 315deg, var( --bottomRightColor2 ) 0%, var( --topLeftColor2 ) 100%);
		z-index: 2;
		transition: opacity 3s ease-in-out;
	}

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
		z-index: 3;

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

		path {
			fill: var( --metaColor2 );
			transition: fill 3s ease-in-out;
		}
	}

	&-timer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background: rgba( 0 0 0 / 10% );
		height: 5px;
		z-index: 3;

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
		position: relative;
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
		z-index: 3;

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
			color: var( --metaColor2 );
			top: 10px;
			left: -40px;
			position: absolute;
			font-size: 55px;
			font-weight: 800;
			width: 25px;
			height: 25px;
			line-height: 25px;
			opacity: 0.1;
			transition: color 3s ease-in-out;

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
		color: var( --metaColor2 );
		opacity: 0.6;
		transition: color 3s ease-in-out;
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

	&--is-even-index {
		color: var( --commentColor1 );

		&::after {
			opacity: 0;
		}

		.comment-ticker-donor,
		.comment-ticker-meta,
		.comment-ticker-comment::before {
			color: var( --metaColor1 );
		}

		.comment-ticker-logo path {
			fill: var( --metaColor1 );
		}

	}
}
</style>
