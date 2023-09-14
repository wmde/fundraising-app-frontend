<template>
	<div class="control is-clearfix" :class="{ 'has-icons-right': hasError || hasMessage }">
		<input
			v-if="inputType === 'text'"
			class="input"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			type="text"
			:autocomplete="newAutocomplete"
			:maxlength="maxlength"
			:value="computedValue"
			:placeholder="placeholder"
			@input="updateValue"
			@change="updateValue"
			@blur="onBlur"
			@focus="onFocus"
		/>
		<textarea
			v-if="inputType === 'textarea'"
			class="textarea"
			:id="inputId"
			:class="{ 'is-danger': hasError }"
			:maxlength="maxlength"
			:value="computedValue"
			:placeholder="placeholder"
			@input="updateValue"
			@change="updateValue"
			@blur="onBlur"
			@focus="onFocus"
		/>
		<span v-if="hasError" class="icon is-right has-text-danger">
			<i class="mdi mdi-alert-circle mdi-24px"></i>
		</span>
		<span v-if="hasMessage" class="icon is-right has-text-warning">
			<i class="mdi mdi-alert mdi-24px"></i>
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'TextInput',
	props: {
		modelValue: [ String, Number ],
		autocomplete: String,
		maxlength: [ Number, String ],
		hasError: Boolean,
		hasMessage: Boolean,
		inputId: String,
		placeholder: String,
		inputType: {
			type: String,
			default: 'text',
		},
	},
	data() {
		return {
			newAutocomplete: this.autocomplete || 'on',
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
	methods: {
		updateValue( event: Event ) {
			this.computedValue = ( event.target as HTMLInputElement ).value;
		},
		onBlur( $event: Event ) {
			this.isFocused = false;
			this.$emit( 'blur', $event );
		},

		onFocus( $event: Event ) {
			this.isFocused = true;
			this.$emit( 'focus', $event );
		},
	},
	watch: {
		modelValue( modelValue: String|Number ) {
			this.newValue = modelValue;
		},
	},
} );
</script>
