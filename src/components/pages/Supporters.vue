<template>
	<div class="supporters">
		<div class="supporters-blurb">
			<h1>{{ $t( 'hall_of_fame_title' ) }}</h1>
			<p v-html="$t( 'hall_of_fame_header_paragraph1' )"/>
			<p v-html="$t( 'hall_of_fame_header_paragraph2' )"/>
		</div>
		<div class="supporters-list">
			<AccordionItem
				v-for="( supporter, index ) in supporters"
				:key="index"
				:title="supporter.name"
				:content="supporter.comment"
				:is-open="index === visibleSupporterIndex"
				@opened="() => visibleSupporterIndex = index"
			>
				<template #title-postfix>
					<span class="accordion-title-amount">{{ supporter.amount }}</span>
				</template>
			</AccordionItem>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Supporter as SupporterInfo } from '@src/view_models/supporters';
import AccordionItem from '@src/components/shared/AccordionItem.vue';

interface Props {
	pageTitle: String;
	supporters: SupporterInfo[];
}

defineProps<Props>();

const visibleSupporterIndex = ref<number | null>( null );

</script>

<style lang="scss">
@use 'src/scss/settings/units';
@use 'sass:map';

.supporters-blurb {
	margin-bottom: map.get( units.$spacing, 'x-large' );
}
.accordion-title-amount {
	white-space: nowrap;
	flex: 0 0;
}
</style>
