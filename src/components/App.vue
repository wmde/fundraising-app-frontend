<template>
	<div class="app-container" :class="bucketClasses">
		<header>
			<AppHeader :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
		</header>
		<main class="main-wrapper">
			<div class="container">
				<AppContent :is-full-width="isFullWidth" :uses-content-cards="usesContentCards">
					<template #content>
						<component :is="page" v-bind="pageProps"/>
					</template>
					<template #sidebar>
						<Sidebar/>
					</template>
				</AppContent>
			</div>
		</main>
		<footer class="is-hidden-print">
			<AppFooter :assets-path="assetsPath"/>
		</footer>
	</div>
</template>

<script setup lang="ts">
import AppHeader from '@src/components/layout/AppHeader.vue';
import AppContent from '@src/components/layout/AppContent.vue';
import Sidebar from '@src/components/layout/Sidebar.vue';
import AppFooter from '@src/components/layout/Footer.vue';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
	page: Object;
	pageProps?: Object;
	isFullWidth?: boolean;
	usesContentCards?: boolean;
	bucketClasses?: string[];
}

withDefaults( defineProps<Props>(), {
	isFullWidth: false,
	bucketClasses: () => [],
	usesContentCards: false,
} );

</script>

<style lang="scss">
@use '@src/scss/settings/global';
@use '@src/scss/settings/breakpoints';
@import "../scss/custom";

#app {
	display: flex;
	min-height: 100vh;
	flex-direction: column;
	flex: 1;
}
.main-wrapper {
	padding: global.$navbar-height 6px 0;

	@include breakpoints.tablet-up {
		padding: global.$navbar-height 18px 0;
	}
}
</style>
