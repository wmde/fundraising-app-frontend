export const QUERY_STRING_INJECTION_KEY = 'campaignQueryString';

const campaignIndependentTrackingKeys = [
	'piwik_kwd',
	'piwik_campaign',
	'impCount',
	'bImpCount',
];

/**
 * Filter URL query parameters to return a URL query parameter that only contains allowed parameters and their values from the URL
 *
 * Example query string: spenden.wikimedia.de/?piwik_kw=123&id=5&utoken=badcafee&des=1&at=0
 */
export function createCampaignQueryString( query: string, allowedCampaignParameters: string[] ): string {
	const urlSearchParams = new URLSearchParams( query );
	const campaignSearchParams = new URLSearchParams();
	const allAllowedParameters = [ ...campaignIndependentTrackingKeys, ...allowedCampaignParameters ];

	allAllowedParameters.forEach( ( item: string ) => {
		if ( urlSearchParams.has( item ) ) {
			const valueInUrl = urlSearchParams.get( item );
			campaignSearchParams.set( item, valueInUrl );
		}
	} );

	return campaignSearchParams.toString();
}
