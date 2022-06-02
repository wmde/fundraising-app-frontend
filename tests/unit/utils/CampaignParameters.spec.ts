import CampaignParameters, { campaignKey, keywordKey } from '@/util/CampaignParameters';

describe( 'FilteredUrlMembershipValues', function () {
	it( 'returns correct values from url', function () {
		const campaignParameters = new CampaignParameters( new URLSearchParams( `${campaignKey}=nicholas&${keywordKey}=cage` ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: 'nicholas', keyword: 'cage' } );
	} );

	it( 'returns empty strings when values are not in url', function () {
		const campaignParameters = new CampaignParameters( new URLSearchParams( '' ) );

		expect( campaignParameters.getCampaignValues() ).toEqual( { campaign: '', keyword: '' } );
	} );
} );
