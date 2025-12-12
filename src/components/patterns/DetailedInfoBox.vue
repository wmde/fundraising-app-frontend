<template>
	<div class="detailed-info-box content-card flow">
		<div class="section-heading">
			<div class="repel">

				<slot name="heading"/>
				<button
					@click="showExpandedInfo = !showExpandedInfo"
					class="link-button highlighted-icon"
				>
					<ChevronDown v-if="!showExpandedInfo"/>
					<ChevronUpIcon v-if="showExpandedInfo"/>
				</button>
			</div>
			<hr/>
		</div>

		<div class="collapsed-info" v-if="!showExpandedInfo">
			<slot name="collapsed-content"/>
		</div>

		<div class="expanded-info" v-if="showExpandedInfo">
			<slot name="expanded-content"/>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import ChevronUpIcon from '@src/components/shared/icons/ChevronUpIcon.vue';

const showExpandedInfo = ref<boolean>( false );

</script>
