export interface PopStateEvent {
	state: string;
}

export interface HistoryHijacker {
	addHistoryCallback( callback: ( e: PopStateEvent ) => void ): void;

	addPushState( pageName: string ): void;

	back(): void;
}

export class WindowHistoryHijacker implements HistoryHijacker {
	private hasPushState: boolean = false;

	addHistoryCallback( callback: ( e: PopStateEvent ) => void ): void {
		window.addEventListener( 'popstate', callback );
	}

	addPushState( pageName: string ) {
		window.history.pushState( pageName, null, null );
		this.hasPushState = true;
	}

	back(): void {
		if ( !this.hasPushState ) {
			return;
		}

		this.hasPushState = false;
		window.history.back();
	}
}
