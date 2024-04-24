<template>
	<fieldset class="form-field form-field-radio" :class="{ 'is-invalid': showError }">
		<legend v-if="label" class="form-field-label">{{ label }}</legend>
		<slot name="intro-message"></slot>
		<div class="control form-field-radio-container" :class="alignment+ '-alignment'">
			<RadioFormInput
				v-for="( option, index ) in options"
				:key="index"
				input-type="radio"
				:id="`${name}-${option.value}`"
				:name="name"
				:disabled="disabled.includes( option.value )"
				:required="required"
				:native-value="option.value"
				:aria-describedby="showError ? `${name}-error-message` : ''"
				:aria-invalid="showError"
				v-model="fieldModel"
				@update:modelValue="onFieldChange"
			>
				{{ option.label }}
				<slot :name="`message-${option.value}`"/>
			</RadioFormInput>
		</div>
		<span v-if="showError" class="help is-danger" :id="`${name}-error-message`">{{ errorMessage }}</span>
	</fieldset>
</template>

<script setup lang="ts">
import { FormOption } from '@src/components/shared/form_fields/FormOption';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';

interface Props {
	label?: String;
	name: string;
	modelValue: string | number | boolean | null;
	options: FormOption[];
	disabled?: Array<string | number | boolean>;
	required?: boolean;
	showError?: boolean;
	errorMessage?: String;
	alignment: 'row' | 'column';
}

const props = withDefaults( defineProps<Props>(), {
	disabled: () => [],
	required: false,
	showError: false,
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const fieldModel = useFieldModel<string | number | boolean | null>( () => props.modelValue, props.modelValue );

const onFieldChange = ( newValue: string | number | boolean | null ): void => {
	emit( 'update:modelValue', newValue );
	emit( 'field-changed', props.name );
};

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/forms';
@use '@src/scss/settings/colors';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.form-field-radio {
	max-width: map.get( forms.$input, 'max-width' );
	flex-wrap: nowrap;

	&-container {
		display: flex;
		.radio + .radio {
			margin-left: 0;
		}
		&.row-alignment {
			flex-direction: column;

			@include breakpoints.tablet-up {
				flex-direction: row;

				.radio-form-input {
					margin: 0 map.get( units.$spacing, 'large' ) 0 0;
				}
			}
		}
		&.column-alignment {
			flex-direction: column;

			.radio-form-input {
				width: 100%;
				max-width: map.get( forms.$input, 'max-width' );
				display: inline-flex;
				align-items: flex-start;

				&:not( :last-child ) {
					margin-bottom: map.get( units.$spacing, 'small' );
				}

				input {
					display: flex;
					flex-shrink: 0;
				}

				label {
					padding-left: map.get( units.$spacing, 'small' ) * 3;
				}

				.option-info-message {
					color: rgba(0,0,0,.6);
					margin-top: map.get( units.$spacing, 'xx-small' );
				}

				&.is-disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		}
	}
}

</style>
