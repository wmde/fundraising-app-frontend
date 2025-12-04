<template>
	<FieldContainer :input-id="inputId" :show-error="showError" :id="id" :is-max-width-field="isMaxWidthField">
		<template #label>{{ $t( 'donation_form_email_label' ) }}</template>
		<template #field>
			<TextFormInput
				input-type="text"
				:input-id="inputId"
				name="email"
				:placeholder="$t( 'form_for_example', { example: $t( 'donation_form_email_placeholder' ) } )"
				autocomplete="email"
				v-model="fieldModel"
				:has-error="showError"
				:has-message="suggestedProvider !== ''"
				:aria-describedby="ariaDescribedby"
				@update:modelValue="onUpdateModel"
				@blur="$emit('field-changed', 'email')"
				@input="onInput"
			/>
		</template>
		<template #error>{{ $t( 'donation_form_email_error' ) }}</template>
		<template #message v-if="suggestedProvider">
			<button
				class="link-button"
				@click="onSuggestionClicked( suggestedProvider )"
				@keyup.enter.space="onSuggestionClicked( suggestedProvider )"
			>
				{{ $t( 'donation_form_email_suggestion' ) }} <strong>{{ suggestedProvider }}</strong>?
			</button>
		</template>
		<template #message v-else-if="$slots.message"><slot name="message"/></template>
	</FieldContainer>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { useSuggestedEmailProvider } from '@src/components/shared/form_fields/useSuggestedEmailProvider';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { useAriaDescribedby } from '@src/components/shared/composables/useAriaDescribedby';
import { computed, useSlots } from 'vue';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import { useValueEqualsPlaceholderWarning } from '@src/components/shared/composables/useValueEqualsPlaceholderWarning';
import { useI18n } from 'vue-i18n';

interface Props {
	modelValue: string;
	showError: boolean;
	id?: string;
	inputId?: string;
	isMaxWidthField?: boolean;
	ariaDescribedby?: string | undefined;
}

const props = withDefaults( defineProps<Props>(), {
	id: 'address-form-email',
	inputId: 'email',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );
const { t } = useI18n();
const slots = useSlots();

const mailHostList = useMailHostList();
const fieldModel = useFieldModel<string>( () => props.modelValue, props.modelValue );
const { suggestedProvider, onSuggestionClicked } = useSuggestedEmailProvider( fieldModel, mailHostList, emit );
const valueEqualsPlaceholderWarning = useValueEqualsPlaceholderWarning( fieldModel, t( 'donation_form_email_placeholder' ), 'donation_form_email_placeholder_warning' );
const ariaDescribedby = useAriaDescribedby(
	props.inputId,
	computed<boolean>( () => false ),
	computed<boolean>( () => props.showError ),
	computed<boolean>( () => valueEqualsPlaceholderWarning.hasWarning.value || !!slots.message ),
	computed<string | undefined>( () => props.ariaDescribedby )
);

const onInput = (): void => {
	if ( props.showError ) {
		emit( 'field-changed', 'email' );
	}
};

const onUpdateModel = ( newValue: string ): void => {
	emit( 'update:modelValue', newValue );
};

</script>
