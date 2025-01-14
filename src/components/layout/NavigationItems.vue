<template>
	<div
		id="main-navigation-items"
		class="navigation-items"
		:aria-label="$t( 'aria_main_navigation_label' )"
		:class="{ 'active': showMobileNavbar }"
	>
		<ul>
			<li v-for="( link, index ) in headerMenu" :key="index">
				<a
					:href="link.url"
					class="navigation-item"
					:class="{ 'active': link.ids.includes( pageIdentifier ) }"
					:aria-current="link.ids.includes( pageIdentifier ) ? 'page' : null"
					@blur="$emit( 'blur' )"
					@keyup.esc="$emit( 'esc' )"
					@click="$emit( 'click' )"
				>
					{{ $t( 'header_menu_item_' + link.localeId ) }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">

interface Props {
	showMobileNavbar: boolean;
	pageIdentifier: string;
	headerMenu: { ids: string[]; url: string; localeId: string }[];
}

defineProps<Props>();
defineEmits( [ 'click', 'blur', 'esc' ] );

</script>
