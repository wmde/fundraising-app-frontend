<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Content Copier Examples</h2>
			<hr/>
		</div>

		<div class="cluster">
			<button class="content-copier" :class="{ 'content-copier--copied': wasJustCopied[0] }" @click="onCopy(0)" @touchstart="onCopy(0)">
				<span class="content-copier__popup" aria-live="assertive"><template v-if="wasJustCopied[0]">(This is a demo, nothing was actually copied)</template></span>
				Content copier content
				<span class="visually-hidden">Click to copy</span>
			</button>

			<button class="content-copier" :class="{ 'content-copier--copied': wasJustCopied[1] }" @click="onCopy(1)" @touchstart="onCopy(1)">
				<span class="content-copier__popup" aria-live="assertive"><template v-if="wasJustCopied[1]">(This is a demo, nothing was actually copied)</template></span>
				The <strong>content</strong> can contain <em>markup</em>
				<span class="visually-hidden">Click to copy</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const wasJustCopied = ref<[boolean, boolean]>( [ false, false ] );

const onCopy = async ( index: number ): Promise<void> => {
	wasJustCopied.value[ index ] = true;
	await new Promise( resolve => setTimeout( resolve, 1000 ) );
	wasJustCopied.value[ index ] = false;
};

</script>
