<template>
	<ContentCard>
		<template #heading>
			<h1>{{ $t( 'hall_of_fame_title' ) }}</h1>
		</template>
		<template #content>
			<p v-html="$t( 'hall_of_fame_header_paragraph1' )"/>
			<p v-html="$t( 'hall_of_fame_header_paragraph2' )"/>
			<h2>{{ $t( 'hall_of_fame_list_title' ) }}</h2>
			<Accordion>
				<template v-for="( supporter, index ) in supporters" :key="index">
					<AccordionItem
						name="supporters"
						v-if="supporter.comment !== ''"
					>
						<template #title>
							{{ supporter.name }}
						</template>
						<template #content>
							{{ supporter.comment }}
						</template>
						<template #meta>
							{{ supporter.amount }}
						</template>
					</AccordionItem>
					<p v-else class="accordion__dummy">
						{{ supporter.name }}
						<span>{{ supporter.amount }}</span>
					</p>
				</template>
			</Accordion>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import type { Supporter as SupporterInfo } from '@src/view_models/supporters';
import ContentCard from '@src/components/patterns/ContentCard.vue';
import Accordion from '@src/components/patterns/Accordion.vue';
import AccordionItem from '@src/components/patterns/AccordionItem.vue';

interface Props {
	pageTitle: String;
	supporters: SupporterInfo[];
}

defineProps<Props>();

</script>
