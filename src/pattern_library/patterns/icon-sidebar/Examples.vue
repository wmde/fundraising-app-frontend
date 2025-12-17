<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Icon Sidebar Examples</h2>
			<hr/>
		</div>

		<div class="flow">
			<div class="sidebar icon-sidebar">
				<div class="icon-sidebar__icon"><SoftwareTechnologyIcon class="highlighted-icon"/></div>
				<div>
					<p><strong>Lorem ipsum</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto natus possimus quas vel voluptatibus. Animi aperiam ea necessitatibus quisquam repudiandae. Autem commodi cupiditate ea facilis iste minima odit, quam vero.</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores at doloremque expedita facere ipsam ipsum mollitia quam quibusdam. Blanditiis eligendi expedita itaque maiores minus officiis quibusdam quis suscipit.</p>
				</div>
			</div>

			<div class="sidebar icon-sidebar">
				<div class="icon-sidebar__icon"><ShieldIcon class="highlighted-icon"/></div>
				<div>
					<p><strong>Lorem ipsum</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto natus possimus quas vel voluptatibus. Animi aperiam ea necessitatibus quisquam repudiandae. Autem commodi cupiditate ea facilis iste minima odit, quam vero.</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores at doloremque expedita facere ipsam ipsum mollitia quam quibusdam. Blanditiis eligendi expedita itaque maiores minus officiis quibusdam quis suscipit.</p>
				</div>
			</div>

			<div class="sidebar icon-sidebar">
				<div class="icon-sidebar__icon"><BooksIcon class="highlighted-icon"/></div>
				<div>
					<p><strong>Lorem ipsum</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto natus possimus quas vel voluptatibus. Animi aperiam ea necessitatibus quisquam repudiandae. Autem commodi cupiditate ea facilis iste minima odit, quam vero.</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi asperiores at doloremque expedita facere ipsam ipsum mollitia quam quibusdam. Blanditiis eligendi expedita itaque maiores minus officiis quibusdam quis suscipit.</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import SoftwareTechnologyIcon from '@src/components/shared/icons/SoftwareTechnologyIcon.vue';
import ShieldIcon from '@src/components/shared/icons/ShieldIcon.vue';
import BooksIcon from '@src/components/shared/icons/BooksIcon.vue';

defineOptions( { inheritAttrs: false } );
</script>
