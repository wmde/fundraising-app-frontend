export default function scrollToFirstError() {
	const errorElement = document.querySelector( '.help.is-danger' );

	if ( errorElement ) {
		errorElement.scrollIntoView( { behavior: 'smooth', block: 'center', inline: 'nearest' } );
	}
}
