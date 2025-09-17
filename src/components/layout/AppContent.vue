<template>
	<div :class="{ 'sidebar': $slots.sidebar }" :data-direction="$slots.sidebar ? 'rtl' : null">
		<main id="content" class="stretch-single-content-card">
			<slot name="content"/>
		</main>
		<aside v-if="$slots.sidebar">
			<slot name="sidebar"/>
		</aside>
	</div>
</template>
