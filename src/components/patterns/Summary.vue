<template>
	<div class="summary switcher" aria-live="polite">
		<div class="flow" v-if="$slots.left">
			<slot name="left"/>
		</div>
		<div class="flow" v-if="$slots.right">
			<slot name="right"/>
		</div>
	</div>
</template>
