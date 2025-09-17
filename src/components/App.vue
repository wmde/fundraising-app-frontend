<template>
	<div class="app-container" :class="bucketClasses">
		<header class="site-head">
			<a href="#content" class="skip-link">{{ $t( 'skip_link_text' ) }}</a>
			<AppHeader :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
		</header>

		<div class="content-wrapper main-content">
			<AppContent>
				<template #content>
					<component :is="page" v-bind="pageProps"/>
				</template>
				<template #sidebar v-if="hasSidebar">
					<AppSidebar/>
				</template>
			</AppContent>
		</div>

		<AppFooter :page-identifier="pageIdentifier" :assets-path="assetsPath"/>
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
	pageTitle: string;
	hasSidebar?: boolean;
	bucketClasses?: string[];
}

const props = withDefaults( defineProps<Props>(), {
	bucketClasses: () => [],
	hasSidebar: true,
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
@use '@src/scss/settings/units';
@use '@src/scss/settings/global';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';
@import "../scss/custom";

#app {
	width: 100%;
	min-height: 100vh;
}

h1,
h2,
h3,
h4 {
	color: #000000;
	font-weight: 400;
	line-height: 1.125;
}

h1 {
	font-size: 24px;
	line-height: 26px;
}

h2 {
	font-size: 20px;
	line-height: 22px;
}

h3 {
	font-size: 18px;
}

h4 {
	font-size: 16px;
}

p {
	&:last-child {
		margin-bottom: 0;
	}
}

ul,
ol {
	padding-left: map.get( units.$spacing, 'medium' );
	margin-bottom: map.get( units.$spacing, 'small' );

	&:last-child {
		margin-bottom: 0;
	}
}

ul {
	list-style-type: disc;
}

ol {
	list-style-type: upper-roman;

	li {
		padding-left: 2px;
	}
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

</style>
