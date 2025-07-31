<template>
	<div class="form-section">
		<h2 v-if="title" class="form-section-title" :class="`form-section-title-${titleMargin}`">{{ title }}</h2>
		<slot/>
	</div>
</template>

<script lang="ts">
/**
 * @deprecated Please don't use this component, you should use the ContentCard pattern component instead
 */
export default {
	name: 'FormSection',
	props: {
		'title': {
			type: String,
			default: '',
		},
		'titleMargin': {
			type: String,
			default: 'small',
		},
	},
};
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
