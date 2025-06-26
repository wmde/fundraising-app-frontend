<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Mobile Nav Toggle Example</h2>
			<hr/>
		</div>

		<button
			class="mobile-nav-toggle"
			:class="{ 'mobile-nav-toggle--active': menuActive }"
			@click="menuActive = !menuActive"
			aria-label="Toggle Navigation Menu"
			:aria-expanded="menuActive"
		>
			<span class="mobile-nav-toggle__open"><Burger/></span>
			<span class="mobile-nav-toggle__close"><Close/></span>
		</button>
	</div>
</template>
<script setup lang="ts">
import Burger from '@src/pattern_library/components/icons/Burger.vue';
import Close from '@src/pattern_library/components/icons/Close.vue';
import { ref } from 'vue';

defineOptions( { inheritAttrs: false } );
const menuActive = ref<boolean>( false );
</script>
