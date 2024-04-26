<template>
	<div class="footer-var-wrapper">
		<div class="container footer-var">
			<div class="footer-var-left">
				<div class="footer-var-logo">
					<a href="https://www.wikimedia.de/">
						<img :src="assetsPath + '/images/logo-vertical-wikimedia.svg'" alt="Wikimedia Deutschland">
					</a>
				</div>
				<div class="footer-var-text">
					<p v-html="$t( 'footer_text' )"/>
				</div>
			</div>
			<nav class="footer-var-right" :aria-label="$t( 'aria_footer_navigation_label' )">
				<ul class="footer-var-list">
					<li v-for="( link, index ) in footerMenu" :key="index">
						<a :href="link.url" :key="link.id" :aria-current="link.id === pageIdentifier ? 'page' : null">
							{{ $t( 'footer_menu_' + link.id ) }}
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
}

defineProps<Props>();

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );
const footerMenu = [
	{ id: 'contact', url: `/contact/get-in-touch?${ campaignParams }` },
	{ id: 'imprint', url: `/page/Impressum?${ campaignParams }` },
	{ id: 'data_protection', url: `/page/Datenschutz?${ campaignParams }` },
	{ id: 'supporters_list', url: `/page/hall-of-fame?${ campaignParams }` },
	{ id: 'donor_comments', url: `/list-comments.html?${ campaignParams }` },
];

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use '@src/scss/settings/colors';
@use 'sass:map';

.footer-var {
	display: flex;
	flex-direction: column;
	padding: map.get(units.$spacing, 'small') 0 88px;

	@include breakpoints.tablet-up {
		flex-direction: row;
		flex-wrap: nowrap;
		padding: map.get( units.$spacing, 'large' ) 0 88px;
	}

	&-wrapper {
		background: colors.$footer;
	}

	&-left {
		flex: 1 1 auto;
		display: flex;
	}

	&-logo {
		flex: 1 0 106px;
		max-width: 106px;
		margin: 0 map.get( units.$spacing, 'small' );
	}

	&-text {
		padding: 0 map.get( units.$spacing, 'small' );

		@include breakpoints.tablet-up {
			padding: 0 map.get( units.$spacing, 'xxx-large' );
		}
	}

	&-right {
		padding: 0 map.get( units.$spacing, 'small' );

		@include breakpoints.tablet-up {
			flex: 0 0 33.3333%;
			width: 33.3333%;
		}
	}

	&-list {
		width: 100%;
		li {
			height: 54px;
			position: relative;
			&:after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				border-bottom: 1px solid colors.$dark;
			}
			a {
				color: colors.$black;
				display: block;
				position: relative;
				top:50%;
				transform: translateY(-50%);

				&:hover, &:focus {
					color: colors.$dark;
					text-decoration: underline;
				}
			}
		}
	}
}

.footer .bank-data-content {
	padding-top: 10px;
	word-wrap: break-word;

	p {
		line-height: 2.5em;
	}
}

.spacer {
	margin-left: 3px;
}

.logo-footer {
	text-align: center;

	img {
		width: 124px;
		height: 106px;
	}
}
</style>
