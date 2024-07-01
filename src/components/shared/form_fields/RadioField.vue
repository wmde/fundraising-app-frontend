<template>
	<fieldset class="form-field form-field-radio" :class="[ alignment + '-alignment', { 'is-invalid': showError } ]" >
		<legend v-if="label" class="form-field-label">{{ label }}</legend>
		<slot name="intro-message"></slot>
		<div class="control form-field-radio-container">
			<RadioFormInput
				v-for="( option, index ) in options"
				:key="index"
				input-type="radio"
				:id="option.id"
				:name="name"
				:disabled="disabled.includes( option.value )"
				:required="required"
				:native-value="option.value"
				:aria-describedby="describedBy"
				:aria-invalid="showError"
				v-model="fieldModel"
				:autofocus="autofocus"
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
import { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { computed } from 'vue';

interface Props {
	label?: String;
	name: string;
	modelValue: string | number | boolean | null;
	options: CheckboxFormOption[];
	disabled?: Array<string | number | boolean>;
	required?: boolean;
	showError?: boolean;
	errorMessage?: String;
	alignment: 'row' | 'column';
	autofocus?: boolean;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	disabled: () => [],
	required: false,
	showError: false,
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const describedBy = computed<string|null>( () => {
	return props.ariaDescribedby + ( props.showError ? ` ${props.name}-error-message` : '' );
} );
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

		label {
			padding-left: map.get( units.$spacing, 'small' ) * 3;
		}

	}

	&.row-alignment {
		@include breakpoints.tablet-up {
			max-width: none;
		}

		.form-field-radio-container {
			flex-direction: column;

			.radio-form-input {
				margin: 0 0 map.get(units.$spacing, 'small');

				&:last-child {
					margin-bottom: 0;
				}
			}

			@include breakpoints.tablet-up {
				flex-direction: row;

				.radio-form-input {
					margin: 0 map.get(units.$spacing, 'large') 0 0;
				}

				label {
					padding-left: map.get(units.$spacing, 'x-large');
				}
			}
		}
	}

	&.column-alignment {
		.form-field-radio-container {
			flex-direction: column;

			.radio-form-input {
				width: 100%;
				max-width: map.get(forms.$input, 'max-width');
				display: inline-flex;
				align-items: flex-start;

				&:not( :last-child ) {
					margin-bottom: map.get(units.$spacing, 'small');
				}

				input {
					display: flex;
					flex-shrink: 0;
				}

				.option-info-message {
					color: rgba(0, 0, 0, .6);
					margin-top: map.get(units.$spacing, 'xx-small');
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
