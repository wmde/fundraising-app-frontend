<template>
	<div class="columns intro-content">
		<div v-bind:class="[isFullWidth ? 'is-full' : 'is-two-thirds', 'column' ]">
			<span>{{ $t('header_headline_text') }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Headline',
	props: [ 'isFullWidth' ],
};
</script>
