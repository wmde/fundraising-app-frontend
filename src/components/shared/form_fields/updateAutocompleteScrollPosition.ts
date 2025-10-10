import { Ref } from 'vue';

export function updateAutocompleteScrollPosition( scrollElement: Ref<HTMLElement> ): void {
	const element = scrollElement.value.querySelector<HTMLElement>( '[aria-selected="true"]' );

	if ( element === null ) {
		scrollElement.value.scrollTop = 0;
		return;
	}

	const visMin = scrollElement.value.scrollTop;
	const visMax = scrollElement.value.scrollTop + scrollElement.value.clientHeight - element.clientHeight;

	if ( element.offsetTop < visMin ) {
		scrollElement.value.scrollTop = element.offsetTop;
	} else if ( element.offsetTop >= visMax ) {
		scrollElement.value.scrollTop = element.offsetTop - scrollElement.value.clientHeight + element.clientHeight;
	}
}
