<template>
	<div class="accordion-item" :class="[isOpen ? 'accordion' : '']">
		<div @click="toggle">
			<div :class="[isOpen ? 'has-text-primary has-text-weight-bold' : 'accordion-heading', 'icon-inline', 'accordion-title']">
        <span class="container columns is-mobile">
          <span class="column">{{ content.name }}</span>
          <span class="column is-narrow">
            <span class="is-nowrap-whitespace is-narrow has-padding-right-18">{{ content.amount }}</span>
            <span class="icon-aligned">
              <ArrowUp v-if="isExpandable && isOpen"/>
              <ArrowDown v-else-if="isExpandable && !isOpen"/>
            </span>
          </span>
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

const isOpen: boolean = computed( () => props.supporterId === props.visibleSupporterId );

const isExpandable: boolean = computed( () => props.content.comment !== '' );

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
.icon-aligned {
	width: 20px;
	display: inline-block;
}
</style>
