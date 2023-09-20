<template>
	<button
		:class="[ 'form-button', { 'form-button-outlined': isOutlined, 'form-button-loading' : isLoading } ]"
		:type="buttonType"
	>
		<slot/>
	</button>
</template>

<script setup lang="ts">
interface Props {
	buttonType?: 'submit' | 'reset' | 'button',
	isOutlined?: boolean,
	isLoading?: boolean,
}

withDefaults( defineProps<Props>(), {
	buttonType: 'button',
	isOutlined: false,
	isLoading: false,
} );

</script>

<style scoped lang="scss">

</style>
