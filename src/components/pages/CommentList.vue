<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'donation_comments_title' ) }}</h1>
		</template>
		<template #content>
			<p>{{ $t( 'donation_comments_text' ) }}</p>

			<div class="comment-list">
				<span v-if="isLoading" class="comment-list-loading">
					<LoadingSpinner/>
				</span>

				<div class="comment-list-comments">
					<div class="comment-list-comment" v-for="comment in pageContent" :key="comment.date">
						<div><strong>{{ commentHeadline( comment ) }}</strong></div>
						<div class="comment-list-comment-meta">{{ comment.date }}</div>
						<div>{{ comment.comment }}</div>
					</div>
				</div>

				<div v-if="!isLoading" class="comment-list-pagination">
					<button class="comment-list-previous" :class="{ 'inactive': isFirstPage }" @click="previousPage">
						<ChevronLeftIcon/>
					</button>
					<button
						class="comment-list-number"
						:class="{ 'current': currentPage === page }"
						v-for="page in pageCount"
						:key="page"
						@click="() => goToPage( page )"
					>
						{{ page }}
					</button>
					<button class="comment-list-next" :class="{ 'inactive': isLastPage }" @click="nextPage">
						<ChevronRightIcon/>
					</button>
				</div>
			</div>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import type { Comment } from '@src/view_models/Comment';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ChevronLeftIcon from '@src/components/shared/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@src/components/shared/icons/ChevronRightIcon.vue';
import LoadingSpinner from '@src/components/shared/LoadingSpinner.vue';
import { useCommentResource } from '@src/components/pages/useCommentResource';
import ContentCard from '@src/components/patterns/ContentCard.vue';

const { t, n } = useI18n();

const PAGE_SIZE = 10;

const { comments, fetchComments } = useCommentResource();
let pageContent = ref<Comment[]>( [] );
let pageCount = ref( 0 );
let currentPage = ref( 1 );
const isLoading = ref( true );

const isFirstPage = computed<boolean>( () => currentPage.value === 1 );
const isLastPage = computed<boolean>( () => currentPage.value === pageCount.value );

const switchPage = (): void => {
	pageContent.value = comments.value.slice(
		( currentPage.value - 1 ) * PAGE_SIZE,
		( currentPage.value * PAGE_SIZE ) - 1
	);
};

const nextPage = (): void => {
	if ( currentPage.value < pageCount.value ) {
		currentPage.value += 1;
		switchPage();
	}
};

const previousPage = (): void => {
	if ( currentPage.value > 1 ) {
		currentPage.value -= 1;
		switchPage();
	}
};

const goToPage = ( page: number ): void => {
	currentPage.value = page;
	switchPage();
};

const commentHeadline = ( comment: Comment ) => t(
	'donation_comments_donor_headline',
	{
		formattedAmount: n( Number( comment.amount ), { key: 'currency' } ),
		donor: comment.donor,
	}
);

onMounted( () => {
	fetchComments().then( () => {
		pageCount.value = Math.ceil( comments.value.length / PAGE_SIZE );
		switchPage();
		isLoading.value = false;
	} ).catch( () => {
		isLoading.value = false;
	} );
} );

</script>

<style lang="scss">
@use 'src/scss/settings/units';
@use 'src/scss/settings/forms';
@use 'src/scss/settings/colors';
@use 'src/scss/settings/breakpoints';
@use 'sass:map';

.comment-list {
	&-loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		width: 100%;
	}

	&-comments {
		margin-bottom: map.get(units.$spacing, 'x-large');
	}

	&-comment {
		&:not( :last-child ) {
			margin-bottom: map.get(units.$spacing, 'medium');
		}

		&-meta {
			color: colors.$gray-dark;
		}
	}

	&-pagination {
		display: flex;
		justify-content: center;
	}

	&-previous,
	&-number,
	&-next {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 2px;
		cursor: pointer;
		border: 1px solid colors.$gray-mid;
		border-radius: map.get(forms.$input, 'border-radius');
		background: colors.$white;

		@include breakpoints.tablet-up {
			margin: 0 5px;
		}

		&:hover,
		&:focus {
			border: 1px solid colors.$primary;
		}

		&.current {
			border: 1px solid colors.$primary;
			color: colors.$primary;
			font-weight: bold;
		}

		&.inactive {
			opacity: 0.3;
		}
	}

	&-previous,
	&-next {
		padding: 10px;
		width: 30px;
	}

	&-number {
		padding: 10px 0;
		width: 20px;
		@include breakpoints.tablet-up {
			width: 30px;
		}
	}
}
</style>
