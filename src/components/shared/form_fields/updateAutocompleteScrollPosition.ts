import { Ref } from 'vue';

export function updateAutocompleteScrollPosition( scrollElement: Ref<HTMLElement> ): void {
	const element = document.querySelector<HTMLElement>( '.is-active-item' );
	const visMin = scrollElement.value.scrollTop;
	const visMax = scrollElement.value.scrollTop + scrollElement.value.clientHeight - element.clientHeight;

	if ( element.offsetTop < visMin ) {
		scrollElement.value.scrollTop = element.offsetTop;
	} else if ( element.offsetTop >= visMax ) {
		scrollElement.value.scrollTop = element.offsetTop - scrollElement.value.clientHeight + element.clientHeight;
	}
}
