const disallowList = [
	'addressType',
	'amount',
	'interval',
	'paymentType',
	'token',
	'accessToken',
	'utoken',
	'id',
	'addressToken',
	'donationId',
	'donationAccessToken',
	'banner_submission',
];

export const QUERY_STRING_INJECTION_KEY = 'campaignQueryString';

export function createCampaignQueryString( query: string ): string {
	const searchParams = new URLSearchParams( query );

	disallowList.forEach( ( item: string ) => {
		searchParams.delete( item );
	} );

	return searchParams.toString();
}
