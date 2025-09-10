<template>
	<footer class="footer-wrapper is-hidden-print">
		<div class="content-wrapper footer">
			<div class="sidebar" data-direction="rtl">
				<div class="footer-left">
					<div class="footer-logo">
						<a href="https://www.wikimedia.de/">
							<img :src="assetsPath + '/images/logo-vertical-wikimedia.svg'" alt="Wikimedia Deutschland">
						</a>
					</div>
					<div class="footer-text">
						<p v-html="$t( 'footer_text' )"/>
					</div>
				</div>
				<nav class="footer-right" :aria-label="$t( 'aria_footer_navigation_label' )">
					<ul class="footer-list">
						<li v-for="( link, index ) in footerMenu" :key="index">
							<a :href="link.url" :key="link.id" :aria-current="link.id === pageIdentifier ? 'page' : null">
								{{ $t( 'footer_menu_' + link.id ) }}
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</footer>
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
	{ id: 'accessibility_statement', url: `/page/accessibility-statement?${ campaignParams }` },
	{ id: 'supporters_list', url: `/page/hall-of-fame?${ campaignParams }` },
	{ id: 'donor_comments', url: `/list-comments.html?${ campaignParams }` },
];

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use '@src/scss/settings/colors';
@use 'sass:map';

.footer {
	padding: 16px 0 88px;

	@include breakpoints.tablet-up {
		padding: 32px 0 88px;
	}

	&-wrapper {
		margin-top: auto;
		background: colors.$footer;
	}

	&-left {
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

	&-list {
		width: 100%;
		list-style-type: none;
		padding-left: 0;
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
				text-decoration: none;
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
</style>
