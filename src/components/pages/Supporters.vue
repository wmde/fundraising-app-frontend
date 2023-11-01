<template>
	<div class="supporters">
		<h2 class="title is-size-2">{{ pageTitle }}</h2>
		<p v-html="$t( 'hall_of_fame_header_paragraph1' )"/>
		<p v-html="$t( 'hall_of_fame_header_paragraph2' )"/>
		<Supporter
			lang="de"
			v-for="(supporter, index) in supporters"
			:key="index"
			v-on:supporter-opened="setSupporterId($event)"
			v-on:supporter-closed="setSupporterId(null)"
			:content="supporter"
			:visible-supporter-id="visibleSupporterId"
			:supporter-id="index"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Supporter as SupporterInfo } from '@src/view_models/supporters';
import Supporter from '@src/components/pages/supporters/Supporter.vue';

interface Props {
	pageTitle: String;
	supporters: SupporterInfo[];
}

defineProps<Props>();

const visibleSupporterId = ref<number | null>( null );

const setSupporterId = ( id: number | null ): void => {
	visibleSupporterId.value = id;
};

</script>
