<template>
	<div class="accordion-item" :class="{ 'accordion': isOpen }">
		<div @click="toggle">
			<div :class="[ isOpen ? 'has-text-primary' : 'accordion-heading', 'icon-inline', 'accordion-title' ]">
				<span class="accordion-title-text">{{ content.name }}</span>
				<span class="accordion-title-amount">{{ content.amount }}</span>
				<span class="accordion-title-icon">
					<ArrowUp v-if="isExpandable && isOpen"/>
					<ArrowDown v-else-if="isExpandable && !isOpen"/>
				</span>
			</div>
		</div>
		<div v-show="isOpen" v-html="content.comment" class="accordion-content"></div>
	</div>
</template>

<script setup lang="ts">
import { Supporter } from '@src/view_models/supporters';
import { computed } from 'vue';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';

interface Props {
	content: Supporter;
	visibleSupporterId: Number;
	supporterId: Number;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'supporter-opened', 'supporter-closed' ] );

const isOpen = computed<boolean>( () => props.supporterId === props.visibleSupporterId );
const isExpandable = computed<boolean>( () => props.content.comment !== '' );

const toggle = () => {
	if ( !isExpandable.value ) {
		return;
	}
	if ( !isOpen.value ) {
		emit( 'supporter-opened', props.supporterId );
	} else {
		emit( 'supporter-closed' );
	}
};
</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use 'src/scss/settings/units';
@use 'sass:map';

.accordion {
	&-item {
		margin-bottom: map.get( units.$spacing, 'medium' );
	}
	&-title {
		border-bottom: 2px solid colors.$gray-mid;
		cursor: pointer;

		&-text {
			flex: 1 1 auto;
			padding-right: 10px;
		}
		&-amount {
			white-space: nowrap;
			flex: 0 0;
		}
		&-icon {
			text-align: right;
			flex: 0 0 30px;
		}
	}
	&-content {
		padding: map.get( units.$spacing, 'small' ) 0;
	}
}
</style>
