<template>
	<div class="option-checkbox">
		<b-checkbox type="checkbox" class="is-inline-checkbox has-margin-bottom-18"
			id="newsletter"
			name="newsletter"
			v-model="newsletter"
			@change.native="setNewsletter()">
			<strong>{{ $t( 'donation_form_newsletter_label_paragraph_1' ) }}</strong>
		</b-checkbox>
		<label class="has-padding-left-36 checkbox"  v-html="$t( 'donation_form_newsletter_label_paragraph_2' )" for="newsletter"></label>
	</div>

</template>

<script lang="ts">
import Vue from 'vue';
import { NS_ADDRESS } from '@/store/namespaces';
import { action } from '@/store/util';
import { setNewsletterChoice } from '@/store/address/actionTypes';

export default Vue.extend( {
	// TODO change this component to work more like ReceiptOption (send event to the parent component, use initial value in data, etc.)
	name: 'NewsletterOption',
	data: function () {
		return {
			newsletter: false,
		};
	},
	mounted() {
		this.$data.newsletter = this.$store.state.address.newsletter;
	},
	methods: {
		setNewsletter: function () {
			this.$store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), this.$data.newsletter );
		},
	},
} );
</script>
<style lang="scss">
.option-checkbox{
	label {
		display: block;
	}
}

</style>
