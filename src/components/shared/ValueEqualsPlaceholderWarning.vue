<template>
	<template v-if="valueEqualsPlaceholder">{{ $t( warning, { value } ) }}</template>
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
