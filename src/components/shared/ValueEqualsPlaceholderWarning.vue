<template>
	<span v-if="valueEqualsPlaceholder" class="help">{{ $t( warning, { value } ) }}</span>
</template>

<script lang="ts">
import Vue, { computed } from 'vue';

export default Vue.extend( {
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
