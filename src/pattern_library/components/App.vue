<template>
	<div class="footer-bottom">
		<header class="site-head">
			<div class="site-head__brand">
				<a href="/">
					<span class="visually-hidden">Wikimedia Deutschland e V.</span>
					<Logo/>
				</a>
			</div>
			<div class="site-head__mobile-nav-toggle">
				<button class="mobile-nav-toggle" :class="{ 'mobile-nav-toggle--active': menuActive }" @click="menuActive = !menuActive" aria-label="Hide Navigation Menu" :aria-expanded="menuActive">
					<span class="mobile-nav-toggle__open">
						<Burger/>
					</span>
					<span class="mobile-nav-toggle__close">
						<Close/>
					</span>
				</button>
			</div>
			<div class="site-head__menu">
				<nav class="nav" :class="{ 'nav--active': menuActive }" aria-label="Main">
					<ul class="nav__list">
						<li><a href="#" aria-current="page">Donate</a></li>
						<li><a href="#">Become a Member</a></li>
						<li><a href="#">Allocation of Funds</a></li>
						<li><a href="#">FAQ</a></li>
					</ul>
				</nav>
			</div>
			<div class="site-head__locale locale" :class="{ 'locale--active': localeActive }">
				<button class="locale__button" @click="localeActive = !localeActive">
					<LocaleIcon/><span>en</span><ChevronDown/>
				</button>
				<form action="/" class="locale__form">
					<label><input type="radio" name="locale" value="de"> Deutsch</label>
					<label><input type="radio" name="locale" value="en" checked> English</label>
					<button class="button" type="submit" data-size-small>Set Language</button>
				</form>
			</div>
		</header>

		<div class="content-wrapper flow footer-bottom__stretch">

			<component v-if="sample" :is="sample.component" :content="content"/>

			<div v-else class="sidebar" data-direction="rtl">

				<main class="flow">
					<PageDetail v-if="page" :page="page"/>
					<PatternDetail v-else-if="pattern" :pattern="pattern" :assets-path="assetsPath"/>
					<template v-else>
						<component v-for="pattern in content.patterns" :key="pattern.name" :is="pattern.examples" :assets-path="assetsPath"/>
					</template>
				</main>

				<aside>
					<SidebarLinks :content="content"/>
				</aside>
			</div>

		</div>

		<footer class="site-foot">
			<div class="content-wrapper">
				<div class="sidebar" data-direction="rtl">
					<div class="site-foot__content">
						<figure class="site-foot__brand">
							<a href="https://www.wikimedia.de/">
								<img :src="assetsPath + '/images/logo-vertical-wikimedia.svg'" alt="Wikimedia Deutschland">
							</a>
						</figure>
						<div class="site-foot__copy flow">
							<p>Wikimedia Deutschland e. V. is an independent non-profit association that collects donations for Wikipedia and other Wikimedia projects in Germany.</p>
							<p>As the organisation behind Wikipedia, we support the volunteers, secure and develop the technical infrastructure, and advocate for free access to knowledge and education worldwide.</p>
						</div>
					</div>
					<nav class="footer-nav">
						<ul class="footer-nav__list">
							<li><a href="#" aria-current="page">Contact</a></li>
							<li><a href="#">Legal Notice</a></li>
							<li><a href="#">Privacy</a></li>
							<li><a href="#">Hall of Fame</a></li>
							<li><a href="#">Donation Comments</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import Logo from '@src/components/layout/Logo.vue';
import Burger from '@src/pattern_library/components/icons/Burger.vue';
import Close from '@src/pattern_library/components/icons/Close.vue';
import LocaleIcon from '@src/components/shared/icons/LocaleIcon.vue';
import SidebarLinks from '@src/pattern_library/components/SidebarLinks.vue';
import { Content } from '@src/pattern_library/content';
import { Pattern } from '@src/pattern_library/patterns/Pattern';
import PatternDetail from '@src/pattern_library/components/PatternDetail.vue';
import { Page } from '@src/pattern_library/pages/Page';
import PageDetail from '@src/pattern_library/components/PageDetail.vue';
import { Sample } from '@src/pattern_library/samples/Sample';

interface Props {
	patternID: string;
	content: Content;
	assetsPath: string;
}
const props = defineProps<Props>();

const menuActive = ref<boolean>( false );
const localeActive = ref<boolean>( false );
const page = computed<Page | undefined>( () => props.content.pages.find( x => x.url === props.patternID ) );
const pattern = computed<Pattern | undefined>( () => props.content.patterns.find( x => x.url === props.patternID ) );
const sample = computed<Sample | undefined>( () => props.content.samples.find( x => x.url === props.patternID ) );

const dialog = ref<HTMLDialogElement>( null );
const modalIsVisible = ref<boolean>( false );
watch( modalIsVisible, ( visible: boolean ) => {
	if ( visible ) {
		dialog.value.showModal();
	} else {
		dialog.value.close();
	}
} );

</script>
