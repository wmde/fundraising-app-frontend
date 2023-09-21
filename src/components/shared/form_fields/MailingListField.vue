<template>
	<div class="form-field form-field-mailing-list">
		<CheckboxSingleFormInput
			v-model="fieldModel"
			name="info"
			input-id="newsletter"
			@update:modelValue="onUpdateModel"
		>
			<span class="form-field-mailing-list-label-content">
				<strong>{{ $t( 'donation_form_newsletter_label_paragraph_1' ) }}</strong>
				<span v-html="$t( 'donation_form_newsletter_label_paragraph_2_vuei18n_v3' )"/>
			</span>
		</CheckboxSingleFormInput>
	</div>
</template>

<script setup lang="ts">

import CheckboxSingleFormInput from '@src/components/shared/form_inputs/CheckboxSingleFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';

interface Props {
	modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue' ] );

const fieldModel = useFieldModel<boolean>( () => props.modelValue, props.modelValue );

const onUpdateModel = ( newValue: boolean ): void => {
	emit( 'update:modelValue', newValue );
};

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.form-field-mailing-list-label-content {
	strong {
		display: block;
		margin-bottom: map.get( units.$spacing, 'x-small' );
	}
}

</style>
