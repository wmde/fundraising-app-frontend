<template>
	<input
		id="iban"
		class="input"
		:placeholder="placeholder"
		:value="displayValue"
		@blur="$emit( 'validate' )"
		@input="onInput"
		@paste="onInput"
	/>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue';

interface Props {
	id?: string;
	placeholder: String;
	accountId: string;
	characterGroupSize?: number;
}

const props = withDefaults( defineProps<Props>(), {
	id: 'iban',
	characterGroupSize: 4,
} );

const emit = defineEmits( [ 'input', 'validate' ] );

const getDisplayValue = ( newValue: string ) => {
	const characters = newValue.split( '' );

	let newFormattedValue = '';
	for ( let i = 0; i < characters.length; i++ ) {
		newFormattedValue += characters[ i ];

		if ( ( i + 1 ) % props.characterGroupSize === 0 ) {
			newFormattedValue += ' ';
		}
	}

	return newFormattedValue;
};

const displayValue = ref( getDisplayValue( props.accountId ) );

watch( () => props.accountId, ( newValue: string ) => {
	displayValue.value = getDisplayValue( newValue );
} );

const onInput = ( e: Event ) => {
	const newValue = ( e.target as HTMLInputElement ).value
		.replace( /\s/g, '' );

	emit( 'input', newValue );
};

</script>
