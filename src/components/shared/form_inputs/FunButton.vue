<template>
	<button
		class="button"
		:type="buttonType"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<slot/>
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent( {
	name: 'FunButton',
	props: {
		buttonType: {
			type: String as PropType<'button'|'submit'|'reset'>,
			default: 'button',
		},
	},
} );
</script>
