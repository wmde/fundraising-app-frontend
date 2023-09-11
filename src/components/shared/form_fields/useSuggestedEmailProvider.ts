import { computed, ComputedRef, Ref } from 'vue';
import { closest, distance } from '@src/util/fastest-levenshtein';

type ReturnType = {
	suggestedProvider: ComputedRef<string>,
	onSuggestionClicked: ( suggestion: string ) => void,
};

export function useSuggestedEmailProvider(
	modelValue: Ref<string>,
	commonMailProviders: Ref<string[]>,
	emit: ( event: string, value: string ) => void
): ReturnType {
	const suggestedProvider = computed( () => {
		if ( commonMailProviders.value.length === 0 ) {
			return '';
		}
		const mailUserInput = modelValue.value;
		if ( mailUserInput.indexOf( '@' ) === -1 ) {
			return '';
		}
		const mailHost = mailUserInput.slice( Math.max( 0, mailUserInput.lastIndexOf( '@' ) + 1 ) );
		if ( mailHost.match( /^\w+\.\w{2}/ ) ) {
			const closestFit = closest( mailHost, commonMailProviders.value );
			const calculatedDistance = distance( mailHost, closestFit );
			if ( calculatedDistance > 0 && calculatedDistance <= 3 ) {
				return closestFit;
			}
		}
		return '';
	} );

	const onSuggestionClicked = ( suggestion: string ) => {
		modelValue.value = modelValue.value.split( '@', 1 ).toString() + '@' + suggestion;
		emit( 'update:modelValue', modelValue.value );
		emit( 'field-changed', 'email' );
	};

	return {
		suggestedProvider,
		onSuggestionClicked,
	};
}
