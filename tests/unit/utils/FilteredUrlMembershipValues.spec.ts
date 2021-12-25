import FilteredUrlMembershipValues from '@/util/FilteredUrlMembershipValues';
import UrlQueryParams from '@/util/UrlQueryParams';
import each from 'jest-each';

describe( 'FilteredUrlMembershipValues', function () {
	it( 'returns validation url', function () {
		const urlValues = new FilteredUrlMembershipValues( new UrlQueryParams( '' ), 'https://example.com/' );

		expect( urlValues.validateFeeUrl ).toEqual( 'https://example.com/' );
	} );

	it( 'returns fee when it is an integer', function () {
		const urlValues = new FilteredUrlMembershipValues( new UrlQueryParams( 'fee=1450' ), 'https://example.com/' );

		expect( urlValues.fee ).toEqual( '1450' );
	} );

	each( [
		// Descriptions are optional, see https://stackoverflow.com/questions/45348083/how-to-add-custom-message-to-jest-expect
		[ '14.50', 'float values' ],
		[ 'hello', 'string values' ],
		[ '0xff', 'hex values' ],
		[ '123hello', 'string value starting with numbers' ],
	] ).test( 'returns empty fee for non-integers', function ( fee ) {
		const urlValues = new FilteredUrlMembershipValues( new UrlQueryParams( `fee=${fee}` ), 'https://example.com/' );

		expect( urlValues.fee ).toEqual( '' );
	} );

	each( [
		[ '1' ],
		[ '3' ],
		[ '6' ],
		[ '12' ],
	] ).test( 'allows valid intervals', function ( inputInterval ) {
		const urlValues = new FilteredUrlMembershipValues( new UrlQueryParams( `interval=${inputInterval}` ), 'https://example.com/' );

		expect( urlValues.interval ).toEqual( inputInterval );
	} );

	each( [
		[ '0' ],
		[ '00' ],
		[ '21' ],
		[ '' ],
		[ ' ' ],
		[ 'abdc' ],
		[ '12.99' ],
	] ).test( 'disallows invalid intervals', function ( inputInterval ) {
		const urlValues = new FilteredUrlMembershipValues( new UrlQueryParams( `interval=${inputInterval}` ), 'https://example.com/' );

		expect( urlValues.interval ).toEqual( '' );
	} );
} );
