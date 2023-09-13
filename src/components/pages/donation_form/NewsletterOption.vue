<template>
	<div class="option-checkbox">
		<FunCheckbox
			id="newsletter"
			class="is-inline-checkbox has-margin-bottom-18"
			name="newsletter"
			v-model="newsletter"
			:native-value="store.state.address.newsletter"
			@change.native="setNewsletter()"
		>
			<strong>{{ $t( 'donation_form_newsletter_label_paragraph_1' ) }}</strong>
		</FunCheckbox>
		<label class="has-padding-left-36 checkbox"  v-html="$t( 'donation_form_newsletter_label_paragraph_2_vuei18n_v3' )" for="newsletter"></label>
	</div>

</template>

<script setup lang="ts">
// TODO: This component should not use the store, but be passed the default value as a prop and emit changes
import { ref } from 'vue';
import { NS_ADDRESS } from '@src/store/namespaces';
import { action } from '@src/store/util';
import { setNewsletterChoice } from '@src/store/address/actionTypes';
import FunCheckbox from '@src/components/shared/form_inputs/FunCheckbox.vue';
import { useStore } from 'vuex';

const store = useStore();
const newsletter = ref<boolean>( store.state.address.newsletter );

const setNewsletter = () => {
	store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), newsletter.value );
};

</script>
<style lang="scss">
.option-checkbox{
	label {
		display: block;
	}
}

</style>
