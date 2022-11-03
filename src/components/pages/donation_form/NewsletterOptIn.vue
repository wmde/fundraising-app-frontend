<template>
	<div class="opt-out-box">
		<b-checkbox type="checkbox" class="is-inline-checkbox has-margin-bottom-18"
			id="newsletter"
			name="newsletter"
			v-model="newsletterOptIn"
			@change.native="setNewsletterOptIn()">
			<strong>{{ $t( 'donation_form_newsletter_label_paragraph_1' ) }}</strong>
		</b-checkbox>
		<label class="has-padding-left-36 checkbox"  v-html="$t( 'donation_form_newsletter_label_paragraph_2' )" for="newsletter-opt-in"></label>
	</div>

</template>

<script lang="ts">
import Vue from 'vue';
import { NS_ADDRESS } from '@/store/namespaces';
import { action } from '@/store/util';
import { setNewsletterOptIn } from '@/store/address/actionTypes';

export default Vue.extend( {
	name: 'NewsletterOptIn',
	data: function () {
		return {
			newsletterOptIn: false,
		};
	},
	mounted() {
		this.$data.newsletterOptIn = this.$store.state.address.newsletterOptIn;
	},
	methods: {
		setNewsletterOptIn: function () {
			this.$store.dispatch( action( NS_ADDRESS, setNewsletterOptIn ), this.$data.newsletterOptIn );
		},
	},
} );
</script>
<style lang="scss">
.opt-out-box{
	label {
		display: block;
	}
}

</style>
