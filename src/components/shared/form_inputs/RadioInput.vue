<template>
	<label
		ref="label"
		class="fun-radio radio"
		:class="{ 'is-disabled': disabled }"
		@click="focus"
		@keydown.prevent.enter="click"
	>
		<input
			v-model="computedValue"
			type="radio"
			ref="input"
			:class="{ 'is-disabled': disabled }"
			:name="name"
			:value="nativeValue"
			:disabled="disabled"
			:required="required"
		/>
		<span class="check"/>
		<span class="control-label"><slot/></span>
	</label>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

// TODO: Merge this and FunCheckbox as a single component when converting to script setup
export default defineComponent( {
	name: 'RadioInput',
	props: {
		modelValue: [ String, Number, Boolean, Function, Object, Array ],
		nativeValue: [ String, Number, Boolean, Function, Object, Array ],
		name: String,
		disabled: Boolean,
		required: Boolean,
	},
	data() {
		return {
			newValue: this.modelValue,
		};
	},
	computed: {
		computedValue: {
			get() {
				return this.newValue;
			},
			set( value: any ) {
				this.newValue = value;
				this.$emit( 'update:modelValue', value );
			},
		},
	},
	watch: {
		/**
		 * When v-model change, set internal value.
		 */
		modelValue( modelValue ) {
			this.newValue = modelValue;
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

.radio.fun-radio {
	margin-right: 0.5em;
	outline: none;
	display: inline-flex;

	&.is-disabled {
		opacity: .5;
	}

	input {
		position: absolute;
		left: 0;
		opacity: 0;
		outline: none;
		z-index: -1;

		&:focus {
			+ .check {
				box-shadow: 0 0 0.5em rgba( $fun-color-gray-dark, 0.8 );
			}
			&:checked + .check {
				box-shadow: 0 0 0.5em rgba( $primary, 0.8 );
			}
		}
	}

	input + .check {
		display: flex;
		flex-shrink: 0;
		position: relative;
		cursor: pointer;
		width: 1.25em;
		height: 1.25em;
		transition: background 150ms ease-out;
		border-radius: 50%;
		border: 2px solid $fun-color-gray-dark;

		&::before {
			content: "";
			display: flex;
			position: absolute;
			left: 50%;
			margin-left: calc(-1.25em * 0.5);
			bottom: 50%;
			margin-bottom: calc(-1.25em * 0.5);
			width: 1.25em;
			height: 1.25em;
			transition: transform 150ms ease-out;
			border-radius: 50%;
			transform: scale(0);
			background-color: $primary;
		}
	}

	input:checked + .check {
		border-color: $primary;

		&::before {
			transform: scale(0.5);
		}
	}
}
</style>
