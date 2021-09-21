<template>
	<div class="cookie-checkbox" :class="{ open: open }">
			<b-checkbox
				type="checkbox"
				class="is-inline-checkbox cookie-checkbox-checkbox"
				:name="name"
				v-model="isChecked"
				:disabled="disabled"
				@change.native="$emit('toggle')"
			>
				<span class="cookie-checkbox-heading">{{ heading }}</span>
				<span class="cookie-checkbox-content" v-html="content"></span>
			</b-checkbox>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ref } from '@vue/composition-api';

export default Vue.extend( {
	name: 'CookieCheckbox',
	props: {
		heading: String,
		content: String,
		name: String,
		checked: Boolean,
		disabled: Boolean,
	},
	setup( props: any ) {
		const open = ref( false );
		const isChecked = ref( props.checked );
		const toggleOpen = () => {
			open.value = !open.value;
		};

		return { open, isChecked, toggleOpen };
	},
} );
</script>
