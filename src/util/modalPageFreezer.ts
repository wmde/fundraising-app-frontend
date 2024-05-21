/**
 * When a modal is open we set the body to fixed in order to hide the scroll bar
 * and stop it interfering with the modal's scrollbar.
 *
 * We also set the top style so the page doesn't jump.
 */
export function setModalOpened(): void {
	const scrollY = window.scrollY;
	document.body.style.position = 'fixed';
	document.body.style.top = `-${ scrollY }px`;
}

/**
 * Remove the body position fixed and jump the window to where the user was before
 * they opened the modal.
 */
export function setModalClosed(): void {
	const scrollY = document.body.style.top;
	document.body.style.position = '';
	document.body.style.top = '';
	window.scrollTo( 0, parseInt( scrollY || '0' ) * -1 );
}
