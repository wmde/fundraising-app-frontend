<template>
	<div class="form-summary">
		<slot name="summary-content"/>
		<div class="form-summary-buttons">
			<slot name="summary-buttons"/>
		</div>
		<slot name="summary-notice"/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	showBorder?: boolean;
}

withDefaults( defineProps<Props>(), {
	showBorder: true,
} );

</script>