<template>
	<transition :name="'zoom-out'">
		<div class="modal is-active">
			<div class="modal-background" @click="$emit( 'close' )"></div>
			<div class="animation-content">
				<slot/>
				<button type="button" class="modal-close is-large" aria-label="close" @click="$emit( 'close' )"/>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'FunModal',
	props: {
		active: Boolean,
	},
	data() {
		return {
			isActive: this.active || false,
		};
	},
	methods: {
		close() {
			this.isActive = false;
		},
	},
	watch: {
		active( value ) {
			this.isActive = value;
		},
	},
} );
</script>
