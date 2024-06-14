<template>
	<div
		v-if="serverMessage !== ''"
		ref="serverMessageElement"
		class="server-message"
		aria-live="assertive"
		tabindex="-1"
		aria-labelledby="server-message-text"
	>
		<p id="server-message-text">{{ $t( serverMessage ) }}</p>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

interface Props {
	serverMessage?: string;
}

const props = withDefaults( defineProps<Props>(), { serverMessage: '' } );
const serverMessageElement = ref<HTMLElement>( null );

watch( () => props.serverMessage, async ( newServerMessage: string ) => {
	if ( newServerMessage !== '' ) {
		await nextTick();
		serverMessageElement.value.focus();
	}
} );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.server-message {
	background: colors.$red100;
	border: 1px solid colors.$red700;
	padding: map.get( units.$spacing, 'small' );
	margin-bottom: map.get( units.$spacing, 'large' );

	&:focus {
		box-shadow: 0 0 0 1px colors.$red700;
	}
}
</style>
