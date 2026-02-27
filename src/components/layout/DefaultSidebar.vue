<template>
	<ServiceTeamContact :assets-path="assetsPath"/>
	<BankInfo/>
</template>

<script setup lang="ts">
import BankInfo from '@src/components/shared/sidebar_cards/BankInfo.vue';
import ServiceTeamContact from '@src/components/shared/sidebar_cards/ServiceTeamContact.vue';

interface Props {
	assetsPath: string;
}

defineProps<Props>();
</script>
