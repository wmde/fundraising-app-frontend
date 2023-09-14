import { CampaignValues } from '@src/view_models/CampaignValues';
import Cookies from 'js-cookie';

export const campaignKey = 'piwik_campaign';
export const keywordKey = 'piwik_kwd';
export const cookieKey = 'referrer';
export const defaultKeyword = 'general';

export default class CampaignParameters {
	private params: URLSearchParams;

	constructor( params: URLSearchParams ) {
		this.params = params;
	}

	public getCampaignValues(): CampaignValues {
		const campaign = this.params.get( campaignKey );
		const keyword = this.params.get( keywordKey );

		if ( campaign && keyword ) {
			Cookies.set( cookieKey, this.parseReferrer( campaign, keyword ) );
			return { campaign, keyword };
		}

		const referrer = Cookies.get( cookieKey );

		if ( referrer ) {
			return {
				campaign: referrer,
				keyword: defaultKeyword,
			};
		}

		return {
			campaign: '',
			keyword: '',
		};
	}

	private parseReferrer( campaign: string, keyword: string ): string {
		if ( campaign.includes( 'org' ) || keyword.includes( 'org' ) ) {
			return 'org';
		}

		return 'wmde';
	}
}
