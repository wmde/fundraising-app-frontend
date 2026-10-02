<template>
  <button class="content-copier" :class="{ 'content-copier--copied': wasJustCopied }" @click="onCopy" @touchstart="onCopy">
    <span class="content-copier__popup" aria-live="assertive"><template v-if="wasJustCopied">{{ $t( 'copy_popup' ) }}</template></span>
    <strong v-if="label">{{ label }}:</strong> {{ value }}
    <span class="visually-hidden">{{ $t( 'copy_click_message' ) }}</span>
    <CopyIcon/>
  </button>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import CopyIcon from '@src/components/shared/icons/CopyIcon.vue';

interface Props {
	label?: string;
	value: string;
	copyValue?: string;
}

const props = defineProps<Props>();
const timerId = ref<number>( null );
const wasJustCopied = ref<boolean>( false );

const onCopy = (): void => {
	try {
		navigator.clipboard.writeText( props.copyValue || props.value );

		wasJustCopied.value = true;

		if ( timerId.value !== null ) {
			window.clearTimeout( timerId.value );
		}

		timerId.value = window.setTimeout( () => {
			wasJustCopied.value = false;
		}, 1000 );

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch ( err: any ) {
		// Do nothing
	}
};

</script>
