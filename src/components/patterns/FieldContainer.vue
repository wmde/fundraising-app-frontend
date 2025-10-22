<template>
	<component :is="type" class="field-container flow" :data-error="showError ? true : null">
		<template v-if="$slots.label">
			<label v-if="type === 'div'" :for="inputId"><slot name="label"/></label>
			<legend v-else><slot name="label"/></legend>
		</template>
		<p v-if="$slots.helpText" :id="`${inputId}-help-text`">
			<slot name="help-text"/>
		</p>
		<slot name="field"/>
		<p v-if="$slots.error" class="field-container__error-text" :id="`${inputId}-error`">
			<slot name="error"/>
		</p>
		<p v-if="!showError && $slots.message && $slots.message.toString() !== ''" class="field-container__message"><em><slot name="message"/></em></p>
	</component>
</template>

<script setup lang="ts">
interface Props {
	type?: 'div' | 'fieldset';
	showError?: boolean;
	inputId: string;
}

withDefaults( defineProps<Props>(), {
	type: 'div',
	showError: false,
} );

</script>
