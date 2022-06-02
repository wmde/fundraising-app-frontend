import { CampaignValues } from '@/view_models/CampaignValues';
import 'core-js/features/url-search-params';

export const campaignKey = 'piwik_campaign';
export const keywordKey = 'piwik_kwd';

export default class CampaignParameters {
	private params: URLSearchParams;

	constructor( params: URLSearchParams ) {
		this.params = params;
	}

	public getCampaignValues(): CampaignValues {
		return {
			campaign: this.params.get( campaignKey ) ?? '',
			keyword: this.params.get( keywordKey ) ?? '',
		};
	}
}
