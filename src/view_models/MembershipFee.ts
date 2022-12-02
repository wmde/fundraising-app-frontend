import { Validity } from '@/view_models/Validity';

export interface MembershipFee {
	validity: {
		[key: string]: Validity
	},
	values: {
		[key: string]: string
	}
}

export interface InitialMembershipFeeValues {
	validateFeeUrl: string,
	fee: string|null,
	type: string|null,
	interval: string|null,
}

export interface TypeData {
	selectedType: string,
	validateFeeUrl: string,
}

export interface IntervalData {
	selectedInterval: string,
	validateFeeUrl: string,
}

export interface SetFeePayload {
	feeValue: string,
	validateFeeUrl: string,
}

export class YearlyMembershipFee {
	public readonly paymentIntervalInMonths: number;
	public readonly membershipFeePerInterval: number;

	constructor( paymentIntervalInMonths: string|number, membershipFeePerInterval: string|number ) {
		this.paymentIntervalInMonths = typeof paymentIntervalInMonths === 'string' ? parseInt( paymentIntervalInMonths, 10 ) : paymentIntervalInMonths;
		this.membershipFeePerInterval = typeof membershipFeePerInterval === 'string' ? parseFloat( membershipFeePerInterval ) : membershipFeePerInterval;
	}

	get yearlyFee(): number {
		return ( 12 / this.paymentIntervalInMonths ) * this.membershipFeePerInterval;
	}
}
