<template>
	<div class="sidebar-content">
		<p><strong>{{ $t('sidebar_getintouch_headline') }}</strong></p>
		<p v-html="$t('sidebar_getintouch_text')"></p>
		<p class="has-margin-top-18">{{ $t('sidebar_getintouch_text_phone') }}</p>
		<slot name="default"/>
	</div>
</template>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.sidebar-content {
	@include breakpoints.tablet-up {
		padding: map.get( units.$spacing, 'small' ) map.get( units.$spacing, 'small' ) 0;
	}
}
</style>
