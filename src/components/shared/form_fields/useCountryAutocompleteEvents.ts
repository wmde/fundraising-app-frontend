import { nextTick, Ref, ref } from 'vue';
import { Country } from '@src/view_models/Country';

export function useCountryAutocompleteEvents( countryName: Ref<string>, wasRestored: boolean, emit: ( event: string, payload?: Country ) => void ) {
	const wasFocusedBefore = ref<Boolean>( false );
	const autocompleteIsActive = ref<Boolean>( false );

	let itemWasJustSelectedFromList = false;

	const isFirstFocusOnDefaultValue = (): boolean => {
		return !wasFocusedBefore.value && !wasRestored;
	};

	const onFocus = ( event: Event ) => {
		if ( isFirstFocusOnDefaultValue() ) {
			countryName.value = '';
		}
		wasFocusedBefore.value = true;

		autocompleteIsActive.value = true;
		( event.target as HTMLInputElement ).select();
	};

	const onBlur = ( country: Country ) => {
		setTimeout( () => {
			autocompleteIsActive.value = false;

			if ( !itemWasJustSelectedFromList ) {
				emit( 'field-changed', country );
			}
			itemWasJustSelectedFromList = false;
		}, 200 );
	};

	const onSelectItem = async ( country: Country ) => {
		itemWasJustSelectedFromList = true;
		countryName.value = country.countryFullName;
		await nextTick();
		emit( 'field-changed', country );
	};

	return {
		autocompleteIsActive,
		onFocus,
		onBlur,
		onSelectItem,
	};
}
