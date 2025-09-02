export interface PageTools {
	scrollTo( options: { left: number; top: number; behaviour: string } ): void;
	setLocation( location: string ): void;
	reload(): void;
	setModalOpened(): void;
	setModalClosed(): void;
}

export const windowPageTools: PageTools = {
	scrollTo: ( options: { left: number; top: number; behaviour: string } ) => window.scrollTo( options ),
	setLocation: ( location: string ) => {
		window.location.href = location;
	},
	reload: () => window.location.reload(),
	/**
	 * When a modal is open we set the body to fixed in order to hide the scroll bar
	 * and stop it interfering with the modal's scrollbar.
	 *
	 * We also set the top style so the page doesn't jump.
	 */
	setModalOpened: () => {
		const scrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${ scrollY }px`;
	},
	/**
	 * Remove the body position fixed and jump the window to where the user was before
	 * they opened the modal.
	 */
	setModalClosed: () => {
		const scrollY = document.body.style.top;
		document.body.style.position = '';
		document.body.style.top = '';
		window.scrollTo( 0, parseInt( scrollY || '0' ) * -1 );
	},
};
