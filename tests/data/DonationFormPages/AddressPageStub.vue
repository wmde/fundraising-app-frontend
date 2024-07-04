<template>
	<div ref="pageRef" class="i-am-address-form"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pageRef = ref<HTMLElement>( null );
defineExpose( { focus: (): void => pageRef.value.focus() } );
</script>
