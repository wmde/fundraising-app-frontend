<template>
	<div class="supporters">
		<h2 class="title is-size-2">{{ pageTitle }}</h2>
		<supporter lang="de" v-for="( supporter, index ) in supporters"
				:key="index"
				v-on:supporter-opened="setSupporterId( $event )"
				v-on:supporter-closed="setSupporterId( null )"
				:content="supporter"
				:visible-supporter-id="visibleSupporterId"
				:supporter-id="index">
		</supporter>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Supporter from '@/components/pages/supporters/Supporter.vue';
import { SupportersData, Supporter as SupporterInfo } from '@/view_models/supporters';

export default Vue.extend( {
	name: 'Supporters',
	components: {
		Supporter,
	},
	props: {
		pageTitle: String,
		supporters: {
			type: Array as () => SupporterInfo[],
		},
	},
	data: function (): SupportersData {
		return {
			visibleSupporterId: null,
		};
	},
	methods: {
		setSupporterId: function ( id: number ): void {
			this.visibleSupporterId = id;
		},
	},
} );
</script>
