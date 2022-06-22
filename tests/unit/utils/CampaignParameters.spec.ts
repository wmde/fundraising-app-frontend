import CampaignParameters, { campaignKey, cookieKey, defaultKeyword, keywordKey } from '@/util/CampaignParameters';
import Cookies from 'js-cookie';

describe( 'FilteredUrlMembershipValues', function () {
	it( 'returns correct values from url', function () {
		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=nicholas&${keywordKey}=cage` ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: 'nicholas', keyword: 'cage' } );
	} );

	it( 'Does not store cookie when values are blank', function () {
		let savedKey = null;
		let savedValue: null | string | object = null;

		jest.spyOn( Cookies, 'set' )
			.mockImplementation( ( name: string, value: string | object ): string | undefined => {
				savedKey = name;
				savedValue = value;
				return undefined;
			} );

		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=&${keywordKey}=` ) );

		campaignParameters.getCampaignValues();

		expect( savedKey ).toBeNull();
		expect( savedValue ).toBeNull();
	} );

	it( 'Stores cookie when values are in url', function () {
		let savedKey = '';
		let savedValue: string | object = '';

		jest.spyOn( Cookies, 'set' )
			.mockImplementation( ( name: string, value: string | object ): string | undefined => {
				savedKey = name;
				savedValue = value;
				return undefined;
			} );

		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=nicholas&${keywordKey}=cage` ) );

		campaignParameters.getCampaignValues();

		expect( savedKey ).toEqual( cookieKey );
		expect( savedValue ).toEqual( 'wmde' );
	} );

	it( 'Stores WMF cookie when campaign contains WMF keyword', function () {
		let savedKey = '';
		let savedValue: string | object = '';

		jest.spyOn( Cookies, 'set' )
			.mockImplementation( ( name: string, value: string | object ): string | undefined => {
				savedKey = name;
				savedValue = value;
				return undefined;
			} );

		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=nichorglas&${keywordKey}=cage` ) );

		campaignParameters.getCampaignValues();

		expect( savedKey ).toEqual( cookieKey );
		expect( savedValue ).toEqual( 'org' );
	} );

	it( 'returns parameters when values are in url and referrer is stored', function () {
		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( 'RAGECAGE' );

		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=nicholas&${keywordKey}=cage` ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: 'nicholas', keyword: 'cage' } );
	} );

	it( 'returns defaults when values are not in url and referrer is stored', function () {
		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( 'RAGECAGE' );

		const campaignParameters = new CampaignParameters( new URLSearchParams( '' ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: 'RAGECAGE', keyword: defaultKeyword } );
	} );

	it( 'returns empty strings when values are not in url', function () {
		// @ts-ignore
		jest.spyOn( Cookies, 'get' ).mockReturnValue( undefined );

		const campaignParameters = new CampaignParameters( new URLSearchParams( '' ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: '', keyword: '' } );
	} );
} );
