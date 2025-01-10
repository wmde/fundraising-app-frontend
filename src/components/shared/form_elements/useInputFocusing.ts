import { ref, Ref } from 'vue';

type ReturnType = {
	labelRef: Ref<HTMLLabelElement>;
	inputRef: Ref<HTMLInputElement>;
	focus(): void;
	click(): void;
};

export function useInputFocusing(): ReturnType {
	const labelRef = ref<HTMLLabelElement>( null );
	const inputRef = ref<HTMLInputElement>( null );

	// MacOS FireFox and Safari do not focus when clicked
	const focus = (): void => inputRef.value.focus();
	const click = (): void => labelRef.value.click();

	return {
		labelRef,
		inputRef,
		focus,
		click,
	};
}
