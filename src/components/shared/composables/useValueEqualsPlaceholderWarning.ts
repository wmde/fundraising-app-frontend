import { computed, ComputedRef, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type ReturnType = {
	hasWarning: ComputedRef<boolean>;
	warning: string;
};

export function useValueEqualsPlaceholderWarning( value: Ref<string | number>, placeholder: string, warning: string | null ): ReturnType {
	const { t } = useI18n();
	return {
		hasWarning: computed<boolean>( () => value.value.toString().toLowerCase() === placeholder.toLowerCase() ),
		warning: warning ? t( warning, { value: placeholder } ) : '',
	};
}
