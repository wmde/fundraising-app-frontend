<template>
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
</template>
<script setup lang="ts">
interface Props {
	assetsPath: string;
}

defineOptions( { inheritAttrs: false } );
defineProps<Props>();
</script>
