<template>
	<div class="app-container" :class="bucketClasses">
		<header>
			<a href="#content" class="skip-link">{{ $t( 'skip_link_text' ) }}</a>
			<AppHeader :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
		</header>
		<main class="main-wrapper" id="content">
			<div class="container">
				<AppContent :is-full-width="isFullWidth" :uses-content-cards="usesContentCards">
					<template #content>
						<component :is="page" v-bind="pageProps"/>
					</template>
					<template #sidebar>
						<AppSidebar/>
					</template>
				</AppContent>
			</div>
		</main>
		<footer class="is-hidden-print">
			<AppFooter :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
		</footer>
	</div>
</template>

<script setup lang="ts">
import AppHeader from '@src/components/layout/AppHeader.vue';
import AppContent from '@src/components/layout/AppContent.vue';
import AppSidebar from '@src/components/layout/AppSidebar.vue';
import AppFooter from '@src/components/layout/AppFooter.vue';
import { useI18n } from 'vue-i18n';
import { Component, onMounted, watch } from 'vue';
import { ModalStates, useModalState } from '@src/components/shared/composables/useModalState';
import { setModalClosed, setModalOpened } from '@src/util/modalPageFreezer';

interface Props {
	assetsPath: string;
	pageIdentifier: string;
	page: Component;
	pageProps?: Record<string, any>;
	pageTitle: string,
	isFullWidth?: boolean;
	usesContentCards?: boolean;
	bucketClasses?: string[];
}

const props = withDefaults( defineProps<Props>(), {
	isFullWidth: false,
	bucketClasses: () => [],
	usesContentCards: false,
} );

const modalState = useModalState();

onMounted( () => {
	const { t } = useI18n();
	document.title = t( 'site_name', { pageTitle: t( props.pageTitle ) } );
} );

watch( modalState, ( newModalState: ModalStates ) => {
	switch ( newModalState ) {
		case ModalStates.Open:
			setModalOpened();
			break;
		case ModalStates.Closed:
			setModalClosed();
			break;
	}
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

.skip-link {
	background-color: #FFCC33;
	color: #000000;
	position: fixed;
	padding: 5px 10px;
	top: 16px;
	left: 16px;
	font-weight: bold;
	display: block;
	z-index: 99;
	border-radius: 5px;
}

.skip-link:not(:focus):not(:active) {
	clip-path: inset( 50% );
	height: 1px;
	overflow: hidden;
	white-space: nowrap;
	width: 1px;
}

.main-wrapper {
	padding: global.$navbar-height 6px 0;

	@include breakpoints.tablet-up {
		padding: global.$navbar-height 18px 0;
	}
}
</style>
