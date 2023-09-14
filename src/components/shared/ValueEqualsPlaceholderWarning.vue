<template>
	<span v-if="valueEqualsPlaceholder" class="help">{{ $t( warning, { value } ) }}</span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent( {
	name: 'ValueEqualsPlaceholderWarning',
	props: {
		value: String,
		placeholder: String,
		warning: String,
	},
	setup( props ) {
		const placeholders = props.placeholder.split( '|' );
		const valueEqualsPlaceholder = computed( () => placeholders.includes( props.value ) );
		return { valueEqualsPlaceholder };
	},
} );
</script>
