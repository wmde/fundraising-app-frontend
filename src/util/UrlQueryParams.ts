export default class UrlQueryParams {
	private params: Map<string, string>;

	constructor( queryString: string ) {
		// Until we drop support for IE11 (which does not support the URLSearchParams class) we have to manually parse the query string
		const entries = queryString
			.replace( /^\?/, '' )
			.split( '&' )
			.map( ( e: string ): [string, string] => {
				const [ p, v ] = e.split( '=', 2 );
				return [ p, v ];
			} );
		this.params = new Map( entries );
	}

	has( parameterName: string ): boolean {
		return this.params.has( parameterName );
	}

	get( parameterName: string ): string {
		return this.params.get( parameterName ) || '';
	}
}
