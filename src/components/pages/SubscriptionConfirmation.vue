<template>
	<div class="system-message">
		<h1 class="title">{{ $t( 'subscription_confirmation_page_header' ) }}</h1>
		<p class="error-message" v-if="hasErrors">{{ $t( errorMessage ) }}</p>
		<p class="success-message" v-else>{{ $t('subscription_confirmation_success') }}</p>
	</div>
</template>

<script lang="ts">
import Vue, {computed} from 'vue';

export default Vue.extend( {
	name: 'SubscriptionConfirmation',
	props: {
		'errorMessage': {
			type: String,
			default:''
		},
	},
	setup( props ) {
		const hasErrors = computed(() => props.errorMessage && props.errorMessage!=='subscription_already_confirmed')
		return { hasErrors }
	}
} );
</script>
