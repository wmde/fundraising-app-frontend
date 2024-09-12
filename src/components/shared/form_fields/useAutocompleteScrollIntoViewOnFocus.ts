export const autoscrollMaxWidth = 769;

export function useAutocompleteScrollIntoViewOnFocus( target: string, maxWidth: number ): () => void {
	return (): void => {

		if ( window.innerWidth > maxWidth ) {
			return;
		}

		const scrollIntoViewElement = document.getElementById( target );
		if ( scrollIntoViewElement ) {
			scrollIntoViewElement.scrollIntoView( { behavior: 'smooth' } );
		}
	};
}
