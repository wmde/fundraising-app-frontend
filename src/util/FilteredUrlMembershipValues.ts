import { InitialMembershipFeeValues } from '@/view_models/MembershipFee';
import UrlQueryParams from '@/util/UrlQueryParams';

export default class FilteredUrlMembershipValues implements InitialMembershipFeeValues {
	private params: UrlQueryParams;
	public validateFeeUrl: string;

	constructor( params: UrlQueryParams, validateFeeUrl: string ) {
		this.params = params;
		this.validateFeeUrl = validateFeeUrl;
	}

	get fee() {
		const feeValue = this.params.get( 'fee' );
		return feeValue.match( /^\d+$/ ) ? feeValue : '';
	}
	get interval() {
		const rawInterval = this.params.get( 'interval' );
		return [ '1', '3', '6', '12' ].indexOf( rawInterval ) > -1 ? rawInterval : '';
	}
}
