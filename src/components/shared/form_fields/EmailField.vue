<template>
	<FieldContainer :input-id="inputId ?? 'email'" :show-error="showError" :id="id">
		<template #label>{{ $t( 'donation_form_email_label' ) }}</template>
		<template #field>
			<TextFormInput
				input-type="text"
				:input-id="inputId ?? 'email'"
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
		<template #message>
			<button
				v-if="suggestedProvider"
				class="link-button"
				@click="onSuggestionClicked( suggestedProvider )"
				@keyup.enter.space="onSuggestionClicked( suggestedProvider )"
			>
				{{ $t( 'donation_form_email_suggestion' ) }} <strong>{{ suggestedProvider }}</strong>?
			</button>
			<slot v-else name="message"/>
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { useSuggestedEmailProvider } from '@src/components/shared/form_fields/useSuggestedEmailProvider';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';
import { useAriaDescribedby } from '@src/components/shared/form_fields/useAriaDescribedby';
import { computed } from 'vue';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	modelValue: string;
	showError: boolean;
	id?: string;
	inputId?: string;
	ariaDescribedby?: string;
}

const props = withDefaults( defineProps<Props>(), {
	id: 'address-form-email',
	ariaDescribedby: '',
} );
const emit = defineEmits( [ 'update:modelValue', 'field-changed' ] );

const mailHostList = useMailHostList();
const fieldModel = useFieldModel<string>( () => props.modelValue, props.modelValue );
const { suggestedProvider, onSuggestionClicked } = useSuggestedEmailProvider( fieldModel, mailHostList, emit );
const ariaDescribedby = useAriaDescribedby(
	computed<string>( () => props.ariaDescribedby ),
	`${( props.inputId ?? 'email' )}-error`,
	computed<boolean>( () => props.showError )
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

<style lang="scss">

</style>
