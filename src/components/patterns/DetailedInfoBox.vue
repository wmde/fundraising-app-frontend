<template>
	<div class="detailed-info-box content-card" :class="{ 'detailed-info-box--expanded': showExpandedInfo }" data-collapsable>
		<div
			role="button"
			:id="`${id}-control`"
			class="detailed-info-box__toggle cluster"
			tabindex="0"
			@click="showExpandedInfo = !showExpandedInfo"
			@keyup.space.prevent="showExpandedInfo = !showExpandedInfo"
			@keyup.enter.prevent="showExpandedInfo = !showExpandedInfo"
			:aria-controls="`${id}-content`"
			:aria-expanded="showExpandedInfo"
		>
			<slot name="heading"/>
			<ChevronDown class="detailed-info-box__chevron highlighted-icon" :aria-label="$t( showExpandedInfo ? 'read_less' : 'read_more' )"/>
		</div>

		<div class="detailed-info-box__content flow" :id="`${id}-content`" aria-live="assertive" :aria-labelledby="`${id}-control`">
			<hr>

			<div class="flow" v-if="!showExpandedInfo">
				<slot name="collapsed-content"/>
			</div>

			<div class="flow" v-if="showExpandedInfo">
				<slot name="expanded-content"/>
			</div>

			<button
				class="link-button detailed-info-box__read-more"
				type="button"
				@click="showExpandedInfo = !showExpandedInfo"
				:aria-controls="`${id}-content`"
				:aria-expanded="showExpandedInfo"
			>
				{{ $t( showExpandedInfo ? 'read_less' : 'read_more' ) }} <ChevronDown class="highlighted-icon" aria-hidden="true"/>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';

interface Props {
	id: string;
}

defineProps<Props>();

const showExpandedInfo = ref<boolean>( false );

</script>
