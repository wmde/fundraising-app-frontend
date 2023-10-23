<template>
	<div class="comment-list">
		<h1 class="title">{{ $t( 'donation_comments_title' ) }}</h1>
		<span>{{ $t( 'donation_comments_text' )}}</span>
		<span v-if="isLoading" class="has-margin-top-36 columns is-centered">
			<span class="pseudo button is-loading"></span>
		</span>
		<div class="has-margin-top-18">
			<div class="has-margin-top-18" v-for="comment in pageContent">
				<div class="has-text-weight-bold">{{ commentHeadline( comment ) }}</div>
				<div class="has-text-gray-dark">{{ comment.date }}</div>
				<div>{{ comment.comment }}</div>
			</div>
		</div>
		<div v-if="!isLoading" class="page-selector has-margin-top-36 has-margin-bottom-18">
			<button class="button mdi mdi-arrow-left" :disabled="currentPage === 1" v-on:click="previousPage"></button>
			<FunSelect class="is-form-input" v-model="currentPage" name="page" select-id="page">
				<option v-for="page in pageCount" :value="page"> {{ page }}</option>
			</FunSelect>
			<button class="button mdi mdi-arrow-right" :disabled="currentPage === pageCount" v-on:click="nextPage"></button>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commentModelsFromObject } from '@src/view_models/Comment';
import FunSelect from '@src/components/shared/legacy_form_inputs/FunSelect.vue';
import { onMounted, ref } from 'vue';
import { Comment } from '@src/view_models/Comment';
import { useI18n } from 'vue-i18n';

const { t, n } = useI18n();

const PAGE_SIZE = 10;

const comments = ref<Comment[]>( [] );
let pageContent = ref<Comment[]>( [] );
let pageCount = ref( 0 );
let currentPage = ref( 1 );
const isLoading = ref( true );

const switchPage = () => {
	pageContent.value = comments.value.slice(
		( currentPage.value - 1 ) * PAGE_SIZE,
		( currentPage.value * PAGE_SIZE ) - 1
	);
};

const nextPage = () => {
	if ( currentPage.value < pageCount.value ) {
		currentPage.value += 1;
		switchPage();
	}
};

const previousPage = () => {
	if ( currentPage.value > 1 ) {
		currentPage.value -= 1;
		switchPage();
	}
};

const commentHeadline = ( comment: Comment ) => t(
	'donation_comments_donor_headline',
	{
		formattedAmount: n( Number( comment.amount ), { key: 'currency' } ),
		donor: comment.donor,
	}
);

onMounted( () => {
	axios
		.get( '/list-comments.json?n=100&anon=1' )
		.then( ( response ) => {
			comments.value = commentModelsFromObject( response.data );
			pageCount.value = Math.ceil( comments.value.length / PAGE_SIZE );
			switchPage();
			isLoading.value = false;
		} )
		.catch( () => {
			isLoading.value = false;
		} );
} );

</script>

<style lang="scss">
	@import "../../scss/variables";
	.pseudo.button {
		display: block;
		width: 100px;
	}
	.page-selector {
		position: relative;
		height: 50px;
		> button {
			position: absolute;
			width: 50px;
			height: 48px;
			&.mdi-arrow-left {
				left: 0;
			}
			&.mdi-arrow-right {
				left: 160px;
			}
		}
		> .control {
			position: absolute;
			width: 70px;
			left: 70px;
		}
	}
</style>
