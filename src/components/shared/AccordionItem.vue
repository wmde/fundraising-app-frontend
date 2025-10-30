<template>
	<div class="accordion-item" :class="{ 'accordion-item-open': isOpen }">
		<h3>
			<button v-if="isExpandable" class="accordion-item-title" @click="toggle" :aria-expanded="isOpen" :aria-controls="`${id}-content`">
				<span :id="id" class="accordion-item-title-text">{{ title }}</span>
				<slot name="title-postfix"/>
				<span class="accordion-item-title-icon" aria-hidden="true">
					<ArrowUp v-if="isExpandable && isOpen"/>
					<ArrowDown v-else-if="isExpandable && !isOpen"/>
				</span>
			</button>
			<span v-else class="accordion-item-title">
				<span class="accordion-item-title-text">{{ title }}</span>
				<slot name="title-postfix"/>
			</span>
		</h3>
		<div v-if="isExpandable" v-html="content" :id="`${id}-content`" class="accordion-item-content" aria-labelledby=""/>
	</div>
</template>

<script setup lang="ts">
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import { computed, ref, watch } from 'vue';

interface Props {
	isOpen?: boolean;
	title: String;
	id: string;
	content?: String;
}

const props = withDefaults( defineProps<Props>(), {
	isOpen: false,
	content: () => '',
} );
const emit = defineEmits( [ 'opened', 'closed' ] );

const isOpen = ref<boolean>( props.isOpen );
const isExpandable = computed<boolean>( () => props.content !== '' );

watch( () => props.isOpen, ( newValue: boolean ) => {
	isOpen.value = newValue;
} );

const toggle = () => {
	if ( !isExpandable.value ) {
		return;
	}

	isOpen.value = !isOpen.value;
	emit( isOpen.value ? 'opened' : 'closed' );
};

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use 'src/scss/settings/units';
@use 'sass:map';

.accordion-item {
	margin-bottom: map.get( units.$spacing, 'large' );

	&-title {
		display: flex;
		width: 100%;
		background: none;
		border: 0;
		border-bottom: 2px solid colors.$gray-light;
		cursor: pointer;
		font-size: 16px;
		padding: 0;
		margin: 0 0 map.get( units.$spacing, 'small' );

		&-text {
			flex: 1 1 auto;
			text-align: left;
			padding-right: 10px;
		}

		&-icon {
			text-align: right;
			flex: 0 0 30px;
			position: relative;
			top: -10px;
			height: 30px;
		}
	}

	&-item {
		border: none;
		box-sizing: content-box;
	}

	&-content {
		display: none;
		margin-bottom: 36px;
	}

	&-open {
		.accordion-item-title {
			color: colors.$primary;
		}
		.accordion-item-content {
			display: block;
		}
	}
}
</style>
