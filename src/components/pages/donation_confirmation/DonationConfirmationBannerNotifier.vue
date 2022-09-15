<template>
	<div>
		<img :src="'https://de.wikipedia.org/wiki/Special:HideBanners?duration=' + cookieDuration + '&reason=donate'"
			alt=""
			width="0"
			height="0"
		/>
		<img
			:src="'https://de.m.wikipedia.org/wiki/Special:HideBanners?duration=' + cookieDuration + '&reason=donate'"
			alt=""
			width="0"
			height="0"
		/>
		<img
			:src="'https://en.wikipedia.org/wiki/Special:HideBanners?duration=' + cookieDuration + '&reason=donate'"
			alt=""
			width="0"
			height="0"
		/>
		<img
			:src="'https://en.m.wikipedia.org/wiki/Special:HideBanners?duration=' + cookieDuration + '&reason=donate'"
			alt=""
			width="0"
			height="0"
		/>
		<img src="https://bruce.wikipedia.de/finish-donation?c=fundraising"
			alt=""
			width="0"
			height="0"
		/>
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend( {
	name: 'DonationConfirmationBannerNotifier',
	props: {
		cookieDuration: String,
	},
} );
</script>
