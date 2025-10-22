import { computed, Ref } from 'vue';

export const helpTextPostfix = '-help-text';
export const errorPostfix = '-error';
export const messagePostfix = '-message';

export const useAriaDescribedby = ( inputId: string, hasHelpText: Ref<boolean>, hasError: Ref<boolean>, hasMessage: Ref<boolean> ): Ref<string | null> => {
	return computed<string>( (): string => {
		let describedBy = '';

		if ( hasHelpText.value ) {
			describedBy += ' ' + inputId + helpTextPostfix;
		}

		if ( hasError.value ) {
			describedBy += ' ' + inputId + errorPostfix;
		} else if ( hasMessage.value ) {
			describedBy += ' ' + inputId + messagePostfix;
		}

		describedBy = describedBy.trim();
		return describedBy !== '' ? describedBy : null;
	} );
};
