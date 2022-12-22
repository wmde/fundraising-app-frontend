<template>
	<aside class="column is-one-third">
		<p><strong>{{ $t('sidebar_getintouch_headline') }}</strong></p>
		<p v-html="$t('sidebar_getintouch_text')"></p>
		<p class="has-margin-top-18">{{ $t('sidebar_getintouch_text_phone') }}</p>
		<slot name="default"/>
	</aside>
</template>

<script>

export default {
	name: 'Sidebar',
};
</script>
