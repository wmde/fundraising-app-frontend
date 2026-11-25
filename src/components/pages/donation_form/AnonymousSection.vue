<template>
	<ContentCard>
		<template #heading>
			<h2>2. {{ $t('donation_form_is_anonymous_title' ) }}</h2>
		</template>
		<template #content>
			<RadioField
				name="isAnonymous"
				id="payment-form-is-anonymous"
				input-id="is-anonymous"
				v-model="isAnonymous"
				:options="[
					{
						value: false,
						label: $t('donation_form_is_anonymous_with_data' ),
						id: 'isAnonymous-false',
					},
					{
						value: true,
						label: $t('donation_form_is_anonymous_without_data' ),
						id: 'isAnonymous-true',
					}
				]"
				:disabled="disabledOptions"
				grid-layout="halves"
				:show-error="isAnonymousIsInvalid"
				:error-message="$t('donation_form_is_anonymous_error')"
				:is-max-width-field="true"
			>
				<template #tooltip-true>
					<Tooltip v-if="disabledOptions.includes( true )">
						{{ $t( 'donation_form_is_anonymous_disclaimer' ) }}
					</Tooltip>
				</template>
			</RadioField>
		</template>
	</ContentCard>
</template>
<script setup lang="ts">

import ContentCard from '@src/components/patterns/ContentCard.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { useIsAnonymousModel } from '@src/components/shared/composables/useIsAnonymousModel';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { Validity } from '@src/view_models/Validity';
import Tooltip from '@src/components/patterns/Tooltip.vue';

const store = useStore();

const isAnonymous = useIsAnonymousModel( store );
const isAnonymousIsInvalid = computed<boolean>( () => store.state.address.validity.isAnonymous === Validity.INVALID );
const disabledOptions = computed<boolean[]>( () => store.state.payment.values.type === 'BEZ' ? [ true ] : [] );

</script>
