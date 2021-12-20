import UrlQueryParams from '@/util/UrlQueryParams';

describe( 'UrlQueryParams', function () {
	it( 'recognizes single parameters', function () {
		const qp = new UrlQueryParams( 'test=foo' );

		expect( qp.has( 'test' ) ).toBeTruthy();
		expect( qp.has( 'another_test' ) ).toBeFalsy();
		expect( qp.get( 'test' ) ).toEqual( 'foo' );
	} );

	it( 'recognizes multiple parameters', function () {
		const qp = new UrlQueryParams( 'test=foo&another-test=5' );

		expect( qp.has( 'test' ) ).toBeTruthy();
		expect( qp.has( 'another-test' ) ).toBeTruthy();
		expect( qp.get( 'test' ) ).toEqual( 'foo' );
		expect( qp.get( 'another-test' ) ).toEqual( '5' );
	} );

	it( 'allows empty parameters', function () {
		const qp = new UrlQueryParams( 'test=&another-test=' );

		expect( qp.has( 'test' ) ).toBeTruthy();
		expect( qp.has( 'another-test' ) ).toBeTruthy();
		expect( qp.get( 'test' ) ).toEqual( '' );
		expect( qp.get( 'another-test' ) ).toEqual( '' );
	} );

	it( 'removes leading question mark', function () {
		const qp = new UrlQueryParams( '?test=foo&another-test=5' );

		expect( qp.has( 'test' ) ).toBeTruthy();
	} );

	it( 'allows empty parameters', function () {
		const qp = new UrlQueryParams( '' );

		expect( qp.has( 'test' ) ).toBeFalsy();
		expect( qp.has( 'another_test' ) ).toBeFalsy();
		expect( qp.get( 'test' ) ).toEqual( '' );
		expect( qp.get( 'another_test' ) ).toEqual( '' );
	} );
} );
