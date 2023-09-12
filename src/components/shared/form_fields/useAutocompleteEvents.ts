import { nextTick, Ref, ref } from 'vue';

export function useAutocompleteEvents( item: Ref<string>, emit: ( event: string ) => void ) {
	const autocompleteIsActive = ref<Boolean>( false );

	const onFocus = ( event: Event ) => {
		autocompleteIsActive.value = true;
		( event.target as HTMLInputElement ).select();
	};

	const onBlur = () => {
		setTimeout( () => {
			autocompleteIsActive.value = false;
		}, 200 );
		emit( 'field-changed' );
	};

	const onSelectItem = async ( newItem: string ) => {
		item.value = newItem;
		await nextTick();
		emit( 'field-changed' );
	};

	return {
		autocompleteIsActive,
		onFocus,
		onBlur,
		onSelectItem,
	};
}
