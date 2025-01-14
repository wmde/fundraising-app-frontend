<template>
	<div class="form-section">
		<h2 v-if="title" class="form-section-title" :class="`form-section-title-${titleMargin}`">{{ title }}</h2>
		<slot/>
	</div>
</template>

<script setup lang="ts">

interface Props {
	title?: String;
	titleMargin?: 'x-small' | 'small' | 'medium';
}

withDefaults( defineProps<Props>(), {
	titleMargin: 'small',
} );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.form-section {
	.form-section-title {
		font-size: 18px;
		font-weight: 400;

		&-x-small {
			margin-bottom: map.get( units.$spacing, 'x-small' );
		}

		&-small {
			margin-bottom: map.get( units.$spacing, 'small' );
		}

		&-medium {
			margin-bottom: map.get( units.$spacing, 'medium' );
		}
	}
}
</style>
