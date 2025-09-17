<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Nav Examples</h2>
			<hr/>
		</div>

		<button class="button" data-size-small @click="menuActive = !menuActive">Toggle Mobile Nav</button>

		<div style="position: relative;">
			<nav class="nav" :class="{ 'nav--active': menuActive }" aria-label="Main">
				<ul class="nav__list">
					<li><a href="#" aria-current="page">Donate</a></li>
					<li><a href="#">Become a Member</a></li>
					<li><a href="#">Allocation of Funds</a></li>
					<li><a href="#">FAQ</a></li>
				</ul>
			</nav>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

defineOptions( { inheritAttrs: false } );
const menuActive = ref<boolean>( false );

</script>
