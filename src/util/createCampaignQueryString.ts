const disallowList = [ 'token', 'accessToken', 'utoken', 'id' ];

export const QUERY_STRING_INJECTION_KEY = 'campaignQueryString';

export function createCampaignQueryString( query: string ): string {
	const searchParams = new URLSearchParams( query );

	disallowList.forEach( ( item: string ) => {
		searchParams.delete( item );
	} );

	return searchParams.toString();
}
