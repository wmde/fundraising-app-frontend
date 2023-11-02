import { createCampaignQueryString } from '@src/util/createCampaignQueryString';

describe( 'createCampaignQueryString', () => {

	test.each( [
		[ 'test1=test1&test2=test2', 'test1=test1&test2=test2' ],
		[ 'test1=test1&utoken=TESTX&token=1&accessToken=2&id=123456', 'test1=test1' ],
		[ 'addressType=test1&amount=TESTX&interval=1&paymentType=2', '' ],
	] )( 'given query %p outputs %p', ( query: string, expected: string ) => {
		expect( createCampaignQueryString( query ) ).toStrictEqual( expected );
	} );

} );
