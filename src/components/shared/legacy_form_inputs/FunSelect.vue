<template>
	<div class="control">
		<span class="select">
			<select
				v-model="computedValue"
				ref="select"
				:multiple="multiple"
				:name="name"
				:id="selectId"
				@blur="$emit('blur', $event )"
				@focus="$emit('focus', $event )"
			>
                <template v-if="placeholder">
                    <option
						v-if="computedValue == null"
						:value="null"
						disabled
						hidden
					>
                        {{ placeholder }}
                    </option>
                </template>
                <slot/>
            </select>
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent( {
	name: 'FunSelect',
	props: {
		selectId: String,
		name: String,
		modelValue: {
			type: [ String, Number, Boolean, Object, Array, Function, Date ],
			default: null,
		},
		placeholder: String,
		multiple: Boolean,
	},
	data() {
		return {
			selected: this.modelValue,
		};
	},
	computed: {
		computedValue: {
			get() {
				return this.selected;
			},
			set( value: any ) {
				this.selected = value;
				this.$emit( 'update:modelValue', value );
			},
		},
	},
	watch: {
		modelValue( modelValue ) {
			this.selected = modelValue;
		},
	},
} );
</script>

<style lang="scss">

</style>
