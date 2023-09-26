<template>
	<div class="app-container" :class="bucketClasses">
		<header>
			<FeatureToggle default-template="campaigns.new_design.legacy">
				<template #campaigns.new_design.legacy>
					<AppHeader :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
				</template>
				<template #campaigns.new_design.new>
					<AppHeaderVar :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
				</template>
			</FeatureToggle>
		</header>
		<main class="main-wrapper">
			<div class="container">
				<AppHeadline :is-full-width="isFullWidth"/>
			</div>
			<div class="container">
				<AppContent :is-full-width="isFullWidth">
					<template #headline>

					</template>
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
			<Footer :assets-path="assetsPath"></Footer>
		</footer>
	</div>
</template>

<script setup lang="ts">
import AppHeader from '@src/components/layout/AppHeader.vue';
import AppHeaderVar from '@src/components/layout/AppHeader_var.vue';
import AppHeadline from '@src/components/layout/AppHeadline.vue';
import AppContent from '@src/components/layout/AppContent.vue';
import Sidebar from '@src/components/layout/Sidebar.vue';
import Footer from '@src/components/layout/Footer.vue';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
	page: Object;
	pageProps?: Object;
	isFullWidth?: boolean;
	bucketClasses?: string[];
}

withDefaults( defineProps<Props>(), {
	isFullWidth: false,
	bucketClasses: () => [],
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
