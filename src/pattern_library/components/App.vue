<template>
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
				<button class="button" type="submit" data-button-size="small">Set Language</button>
			</form>
		</div>
	</header>

	<div class="wrapper flow">

		<div class="sidebar" data-direction="rtl">

			<main class="flow">
				<div class="content-card flow">
					<h1>Heading 1</h1>
					<h2>Heading 2</h2>
					<h3>Heading 3</h3>
					<h4>Heading 4</h4>

					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad delectus eaque enim eos expedita, <a href="#">magnam repellendus</a> voluptas voluptatem! Atque cum
					   distinctio illo itaque obcaecati similique sint. Accusamus quaerat quos repellendus?</p>

					<p>A small paragraph to <em>emphasis</em> and show <strong>important</strong> bits.</p>

					<hr>

					<h2>Unordered List</h2>
					<ul>
						<li>Unordered List item</li>
						<li>Unordered List item</li>
						<li>Unordered List item</li>
						<li>Unordered List item</li>
						<li>Unordered List item</li>
					</ul>

					<hr>

					<ol>
						<li>Ordered List item</li>
						<li>Ordered List item</li>
						<li>Ordered List item</li>
						<li>Ordered List item</li>
						<li>Ordered List item</li>
					</ol>

					<hr>

					<dl>
						<dt>Description list title</dt>
						<dd>Description list description</dd>

						<dt>Description list title</dt>
						<dd>Description list description</dd>
						<dd>Description list description</dd>
					</dl>

					<table>
						<thead>
							<tr>
								<th>Table Heading</th>
								<th>Table Heading</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>table data</td>
								<td>table data</td>
							</tr>
							<tr>
								<td>table data</td>
								<td>table data</td>
							</tr>
							<tr>
								<td>table data</td>
								<td>table data</td>
							</tr>
							<tr>
								<td>table data</td>
								<td>table data</td>
							</tr>
						</tbody>
					</table>

					<blockquote>
						<q>We think we understand the rules when we become adults but what we really experience is a <em>narrowing of the imagination</em>.</q>
						<footer>
							David Lynch <cite><a href="#">Citation goes here</a></cite>
						</footer>
					</blockquote>

					<pre>#header h1 a {
	display: block;
	width: 300px;
	height: 80px;
}</pre>
				</div>

				<div class="content-card flow">
					<div class="cluster">
						<button class="button">Button Button</button>
						<a href="#" class="button">Link Button</a>
						<button class="button" data-button-style="hollow">Hollow Button</button>
						<button class="button" data-button-size="small">Small Button</button>
						<button class="button" data-button-size="small" data-button-style="hollow">Small Hollow Button</button>
					</div>
				</div>

				<div class="content-card flow">
					<div class="section-heading">
						<h1>Section Heading 1</h1>
						<h2>Section Heading 2</h2>
						<hr/>
					</div>

					<div class="section-heading">
						<h2>Section Heading 2</h2>
						<hr/>
					</div>

					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><SuccessIcon/></div><h1>Icon Heading 1</h1>
					</div>

					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><WarningIcon/></div><h2>Icon Heading 2</h2>
					</div>

					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><WarningIcon/></div><h3>Icon Heading 3</h3>
					</div>

					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><InfoIcon/></div><p><strong>Icon text short</strong></p>
					</div>

					<div class="icon-text">
						<div class="icon-text__icon" aria-hidden="true"><BankIcon/></div><p>Long text. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium amet, consectetur culpa doloremque ex, exercitationem harum illum in ipsa ipsum, modi natus nemo odio perferendis quaerat quis similique sint tempore.</p>
					</div>
				</div>

				<div class="content-card flow">
					<div class="section-heading">
						<h2>Accordions</h2>
						<hr/>
					</div>

					<div class="accordion">
						<details>
							<summary tabindex="0">I am a details summary Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. <span class="accordion__summary-icon"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-icon"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-icon"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
					</div>

					<div class="accordion" data-theme="wikimedia">
						<details>
							<summary tabindex="0">I am a details summary Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. <span class="accordion__summary-meta"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
						<details>
							<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
							<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.</div>
						</details>
					</div>
				</div>

				<div class="content-card flow" data-theme="bordered">
					<h2>Bordered Content Card</h2>

					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad delectus eaque enim eos expedita, magnam repellendus voluptas voluptatem! Atque cum
					   distinctio illo itaque obcaecati similique sint. Accusamus quaerat quos repellendus?</p>
				</div>

				<div class="content-card flow">
					<div class="section-heading">
						<h2>Donation Comments</h2>
						<hr/>
					</div>

					<blockquote class="donation-comment">
						<p class="repel donation-comment__meta"><strong>€15.00 from David Lynch</strong><em>24.01.2025 um 01:18 Uhr</em></p>
						<q>We think we understand the rules when we become adults but what we really experience is a narrowing of the imagination.</q>
					</blockquote>

					<blockquote class="donation-comment">
						<p class="repel donation-comment__meta"><strong>€15.00 from David Lynch</strong><em>24.01.2025 um 01:18 Uhr</em></p>
						<q>We think we understand the rules when we become adults but what we really experience is a <em>narrowing of the imagination</em>.</q>
					</blockquote>

					<nav class="pagination">
						<ul class="cluster">
							<li><button disabled><span class="visually-hidden">Previous Page</span><ChevronLeftIcon/></button></li>
							<li><button aria-current="true"><span class="visually-hidden">Page </span>1</button></li>
							<li><button><span class="visually-hidden">Page </span>2</button></li>
							<li><button><span class="visually-hidden">Page </span>3</button></li>
							<li><button><span class="visually-hidden">Page </span>4</button></li>
							<li><button><span class="visually-hidden">Page </span>5</button></li>
							<li><button><span class="visually-hidden">Page </span>6</button></li>
							<li><button><span class="visually-hidden">Page </span>7</button></li>
							<li><button><span class="visually-hidden">Page </span>8</button></li>
							<li><button><span class="visually-hidden">Page </span>9</button></li>
							<li><button><span class="visually-hidden">Page </span>10</button></li>
							<li><button><span class="visually-hidden">Next Page</span><ChevronRightIcon/></button></li>
						</ul>
					</nav>
				</div>

				<div class="content-card flow">
					<div class="section-heading">
						<h2>More Information Toggle</h2>
						<hr/>
					</div>

					<button class="button" data-button-style="hollow">Enter Postal Address</button>

					<details class="more-info-toggle">
						<summary><small>More Information</small></summary>
						<p><small>This is all the more info. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque laudantium nisi possimus, quas repudiandae veritatis? Architecto blanditiis, et impedit in incidunt inventore laborum molestiae molestias odio pariatur rem sit veniam.</small></p>
					</details>
				</div>

				<div class="content-card flow">
					<div class="section-heading">
						<h2>Modal</h2>
						<hr/>
					</div>

					<button class="button" @click="modalIsVisible = true">Show Modal</button>
				</div>

				<div class="content-card summary flow">
					<div class="section-heading">
						<h2>Your Donation Summary</h2>
						<p>You will donate €42 monthly via Direct Debit</p>
						<hr/>
					</div>

					<div class="summary__details switcher">
						<div class="flow">
							<h3>Your Contact Data</h3>
							<p>
								<strong>Joe Bloggs</strong><br/>
								Any Street<br/>
								23456 Some City<br/>
								Germany<br/>
								joebloggs@example.com
							</p>
						</div>
						<div class="flow">
							<h3>Your Bank Details</h3>

							<ul class="bankdata">
								<li><strong>IBAN:</strong> DE1234 5678 1234 5678</li>
								<li><strong>BIC:</strong> BS123</li>
								<li><strong>Bank Name:</strong> Berliner Sparkasse</li>
							</ul>
						</div>
					</div>

					<div class="switcher">
						<button class="button" data-button-style="hollow" data-button-fill>Change my payment details</button>
						<button class="button" data-button-fill>Donate now</button>
					</div>
				</div>

			</main>

			<aside>
				<div class="sticky flow">
					<div class="content-card flow" data-sidebar-card>
						<p>Sidebar content</p>
					</div>
					<div class="content-card flow" data-sidebar-card>
						<p>Sidebar content</p>
					</div>
					<div class="content-card flow" data-sidebar-card>
						<p>Sidebar content</p>
					</div>
				</div>
			</aside>
		</div>

		<div class="grid" data-layout="50-50">
			<div class="content-card flow grid__item-full-width">Content</div>
			<div class="content-card flow">Content</div>
			<div class="content-card flow" data-theme="bordered">Content</div>
		</div>
	</div>

	<footer class="site-foot">
		<div class="wrapper">
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

	<dialog class="modal-dialogue" ref="dialog">
		<div class="modal-dialogue__heading repel" data-nowrap>
			<h2>I am a modal</h2>
			<button class="modal-dialogue__close" @click="modalIsVisible = false"><Close/></button>
		</div>
		<div class="modal-dialogue__scroll">
			<div class="modal-dialogue__content flow">
				<p v-for="n in 20" :key="n">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur culpa molestiae molestias sapiente. Architecto dignissimos dolorem doloremque excepturi hic
					 laborum magni minima nulla numquam perferendis repudiandae sit totam, voluptates. Maiores.
				</p>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">

import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import Logo from '@src/components/layout/Logo.vue';
import Burger from '@src/pattern_library/components/Burger.vue';
import Close from '@src/pattern_library/components/Close.vue';
import { ref, watch } from 'vue';
import LocaleIcon from '@src/components/shared/icons/LocaleIcon.vue';
import ChevronLeftIcon from '@src/components/shared/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@src/components/shared/icons/ChevronRightIcon.vue';

interface Props {
	assetsPath: string;
}
defineProps<Props>();

const menuActive = ref<boolean>( false );
const localeActive = ref<boolean>( false );
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
