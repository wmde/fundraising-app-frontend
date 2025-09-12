<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'subscription_confirmation_page_header' ) }}</h1>
		</template>
		<template #content>
			<p class="error-message" v-if="hasErrors">{{ $t( errorMessage ) }}</p>
			<p class="success-message" v-else>{{ $t('subscription_confirmation_success') }}</p>
		</template>
	</ContentCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';

export default defineComponent( {
	name: 'SubscriptionConfirmation',
	components: { ContentCard },
	props: {
		'errorMessage': {
			type: String,
			default: '',
		},
	},
	setup( props ) {
		const hasErrors = computed( () => props.errorMessage && props.errorMessage !== 'subscription_already_confirmed' );
		return { hasErrors };
	},
} );
</script>
