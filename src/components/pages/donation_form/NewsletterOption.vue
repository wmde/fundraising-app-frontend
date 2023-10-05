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
		<label
        class="has-padding-left-36 checkbox"
        v-html="appendCampaignQueryParams( $t( 'donation_form_newsletter_label_paragraph_2_vuei18n_v3' ), campaignParams )"
        for="newsletter"></label>
	</div>

</template>

<script setup lang="ts">
// TODO: This component should not use the store, but be passed the default value as a prop and emit changes
import { ref } from 'vue';
import { NS_ADDRESS } from '@src/store/namespaces';
import { action } from '@src/store/util';
import { setNewsletterChoice } from '@src/store/address/actionTypes';
import FunCheckbox from '@src/components/shared/legacy_form_inputs/FunCheckbox.vue';
import { useStore } from 'vuex';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

const store = useStore();
const newsletter = ref<boolean>( store.state.address.newsletter );

const setNewsletter = () => {
	store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), newsletter.value );
};

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>
<style lang="scss">
.option-checkbox{
	label {
		display: block;
	}
}

</style>
