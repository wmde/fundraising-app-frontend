import { VueWrapper } from '@vue/test-utils';

export const errorSummaryItemIsFunctional = ( wrapper: VueWrapper<any>, formElement: string, scrollElement: string ): boolean => {
	const errorItemExists = wrapper.find( `.error-summary a[href="#${formElement}"][data-scroll-element="${scrollElement}"]` ).exists();
	const formElementExists = wrapper.find( `#${formElement}` ).exists();
	const scrollElementExists = wrapper.find( `#${scrollElement}` ).exists();

	return errorItemExists && formElementExists && scrollElementExists;
};
