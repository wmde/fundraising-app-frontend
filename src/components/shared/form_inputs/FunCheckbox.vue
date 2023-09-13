<template>
	<label
		ref="label"
		class="fun-checkbox checkbox"
		:class="{ 'is-disabled': disabled }"
		:disabled="disabled"
		@click="focus"
		@keydown.prevent.enter="click"
		@keydown.prevent.space="click"
	>
		<input
			v-model="computedValue"
			type="checkbox"
			ref="input"
			:class="{ 'is-disabled': disabled }"
			:name="name"
			:value="nativeValue"
			:disabled="disabled"
			:required="required"
		>
		<span class="check checkbox"/><span class="control-label"><slot/></span>
	</label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// TODO: Merge this and RadioInput as a single component when converting to script setup
export default defineComponent( {
	name: 'FunCheckbox',
	props: {
		value: [ String, Number, Boolean, Function, Object, Array ],
		nativeValue: [ String, Number, Boolean, Function, Object, Array ],
		name: String,
		disabled: Boolean,
		required: Boolean,
	},
	data() {
		return {
			newValue: this.value,
		};
	},
	computed: {
		computedValue: {
			get() {
				return this.newValue;
			},
			set( value: any ) {
				this.newValue = value;
				this.$emit( 'input', value );
			},
		},
	},
	watch: {
		/**
		 * When v-model change, set internal value.
		 */
		value( value ) {
			this.newValue = value;
		},
	},
	methods: {
		focus() {
			// MacOS FireFox and Safari do not focus when clicked
			( this.$refs.input as HTMLInputElement ).focus();
		},
		click() {
			( this.$refs.label as HTMLLabelElement ).click();
		},
	},
} );
</script>

<style lang="scss">
@import "../../../scss/variables";

.fun-checkbox.checkbox {

	outline: none;
	display: inline-flex;
	align-items: flex-start;
	margin-right: 0.5em;

	input[type="checkbox"] {
		position: absolute;
		left: 0;
		opacity: 0;
		outline: none;
		z-index: -1;
	}

	input[type="checkbox"] + .check {
		width: 1.25em;
		height: 1.25em;
		flex-shrink: 0;
		border-radius: 2px;
		border: 2px solid hsl( 0, 0%, 48% );
		transition: background 150ms ease-out;
		background: transparent;
	}

	input[type="checkbox"]:checked + .check {
		background: $primary $checkbox-checkmark no-repeat center center;
		border-color: $primary;
	}
}
</style>
