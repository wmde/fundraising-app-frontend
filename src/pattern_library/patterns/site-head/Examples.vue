<template>
	<header class="site-head" style="--position: static;">
		<div class="site-head__brand">
			<a href="/">
				<span class="visually-hidden">Wikimedia Deutschland e V.</span>
				<Logo/>
			</a>
		</div>
		<div class="site-head__mobile-nav-toggle">
			<button class="mobile-nav-toggle" aria-label="Hide Navigation Menu" :aria-expanded="false">
			<span class="mobile-nav-toggle__open">
				<Burger/>
			</span>
				<span class="mobile-nav-toggle__close">
				<Close/>
			</span>
			</button>
		</div>
		<div class="site-head__menu">
			<nav class="nav" aria-label="Main">
				<ul class="nav__list">
					<li><a href="#" aria-current="page">Donate</a></li>
					<li><a href="#">Become a Member</a></li>
					<li><a href="#">Allocation of Funds</a></li>
					<li><a href="#">FAQ</a></li>
				</ul>
			</nav>
		</div>
		<div class="site-head__locale locale">
			<button class="locale__button">
				<LocaleIcon/><span>en</span><ChevronDown/>
			</button>
			<form action="/" class="locale__form">
				<label><input type="radio" name="locale" value="de"> Deutsch</label>
				<label><input type="radio" name="locale" value="en" checked> English</label>
				<button class="button" type="submit" data-button-size="small">Set Language</button>
			</form>
		</div>
	</header>
</template>
<script setup lang="ts">
import Burger from '@src/pattern_library/components/icons/Burger.vue';
import LocaleIcon from '@src/components/shared/icons/LocaleIcon.vue';
import Close from '@src/pattern_library/components/icons/Close.vue';
import Logo from '@src/components/layout/Logo.vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
defineOptions( { inheritAttrs: false } );
</script>
