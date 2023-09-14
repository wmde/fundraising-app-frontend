<template>
	<div class="accordion-item" v-bind:class="[ isOpen ? 'accordion' : '' ]">
		<div @click="toggle()">
			<div v-bind:class="[ isOpen ? 'has-text-primary has-text-weight-bold' : 'accordion-heading', 'icon-inline', 'accordion-title' ] ">
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

<script lang="ts">
import { defineComponent } from 'vue';
import { Supporter } from '@src/view_models/supporters';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';

export default defineComponent( {
	name: 'Supporter',
	components: { ArrowDown, ArrowUp },
	props: {
		content: {
			type: Object as () => Supporter,
		},
		visibleSupporterId: Number,
		supporterId: Number,
	},
	computed: {
		isOpen: {
			get: function (): boolean {
				return this.supporterId === this.visibleSupporterId;
			},
		},
		isExpandable: {
			get: function (): boolean {
				return this.content.comment !== '';
			},
		},
	},
	methods: {
		toggle: function () {
			if ( !this.isExpandable ) {
				return;
			}
			if ( !this.isOpen ) {
				this.$emit( 'supporter-opened', this.supporterId );
			} else {
				this.$emit( 'supporter-closed' );
			}
		},
	},
} );
</script>

<style lang="scss">
	.icon-aligned {
		width:20px;
		display: inline-block;
	}
</style>
