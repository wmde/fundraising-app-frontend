import { InitialMembershipFeeValues } from '@src/view_models/MembershipFee';

export default class FilteredUrlMembershipValues implements InitialMembershipFeeValues {
	private params: URLSearchParams;
	public validateFeeUrl: string;
	public paymentType: string|null;

	constructor( params: URLSearchParams, validateFeeUrl: string ) {
		this.params = params;
		this.validateFeeUrl = validateFeeUrl;
		this.paymentType = null;
	}

	get fee() {
		const feeValue = this.params.get( 'fee' ) ?? '';
		return feeValue.match( /^\d+$/ ) ? feeValue : '';
	}

	get interval() {
		const rawInterval = this.params.get( 'interval' ) ?? '';
		return [ '1', '3', '6', '12' ].indexOf( rawInterval ) > -1 ? rawInterval : '';
	}

	get type() {
		return this.paymentType;
	}

	public setTypeFromAvailablePaymentTypes( paymentTypes: string[] ) {
		if ( paymentTypes.length === 1 ) {
			this.paymentType = paymentTypes[ 0 ];
		}
	}
}
