<template>
    <div class="address-usage-toggle" :class="{ 'open': contentOpen }">
		<a href="#" v-on:click="toggleContent" class="address-usage-toggle-link">{{ $t('donation_confirmation_address_usage_link') }}</a>
		<div class="address-usage-toggle-content">{{ $t('donation_confirmation_address_usage_content_vuei18n_v3') }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const contentOpen = ref<boolean>( false );

const toggleContent = (): void => {
	contentOpen.value = !contentOpen.value;
};

</script>
