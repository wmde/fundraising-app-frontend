import { computed, Ref } from 'vue';

export const useAriaDescribedby = ( labelId: Ref<string>, errorId: string, hasError: Ref<boolean> ): Ref<string|null> => {
	return computed<string>( (): string => {
		let describedBy = labelId.value;
		if ( hasError.value ) {
			describedBy += ' ' + errorId;
		}
		describedBy = describedBy.trim();
		return describedBy !== '' ? describedBy : null;
	} );
};
