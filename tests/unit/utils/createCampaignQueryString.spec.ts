import { createCampaignQueryString } from '@src/util/createCampaignQueryString';

describe( 'createCampaignQueryString', () => {

	test.each( [
		// URL contains all parameters
		[ 'test1=test1&test2=test2', 'test1=test1&test2=test2' ],
		// URL contains additional params - they should be filtered
		[ 'test1=test1&utoken=TESTX&token=1&accessToken=2&id=123456', 'test1=test1' ],
		// URL contains no parameters - all should be filtered
		[ 'addressType=test1&amount=TESTX&interval=1&paymentType=2', '' ],
		// URL contains non-campaign tracking params - the output should contain them
		[
			'test1=test1&piwik_kwd=testKeyword&piwik_campaign=testCampaign&impCount=3&bImpCount=1',
			'piwik_kwd=testKeyword&piwik_campaign=testCampaign&impCount=3&bImpCount=1&test1=test1',
		],
	] )( 'given query %p outputs %p', ( query: string, expected: string ) => {
		expect( createCampaignQueryString( query, [ 'test1', 'test2' ] ) ).toStrictEqual( expected );
	} );

} );
