import { Validity } from '@src/view_models/Validity';

export interface MembershipFeeValues {
	fee: string;
	type: string;
	interval: string;
}

export interface MembershipFee {
	isValidating: boolean;
	validity: {
		[key: string]: Validity;
	};
	values: MembershipFeeValues;
}

export interface InitialMembershipFeeValues {
	validateFeeUrl: string;
	fee: string | null;
	type: string | null;
	interval: string | null;
}

export interface GenericValuePayload {
	selectedValue: string;
	validateFeeUrl: string;
}

export class YearlyMembershipFee {
	public readonly paymentIntervalInMonths: number;
	public readonly membershipFeePerInterval: number;

	constructor( paymentIntervalInMonths: string | number, membershipFeePerInterval: string | number ) {
		this.paymentIntervalInMonths = typeof paymentIntervalInMonths === 'string' ? parseInt( paymentIntervalInMonths, 10 ) : paymentIntervalInMonths;
		this.membershipFeePerInterval = typeof membershipFeePerInterval === 'string' ? parseFloat( membershipFeePerInterval ) : membershipFeePerInterval;
	}

	get yearlyFee(): number {
		return ( 12 / this.paymentIntervalInMonths ) * this.membershipFeePerInterval;
	}
}

export enum FeeValidity {
	FEE_VALID,
	FEE_TOO_LOW,
	FEE_TOO_HIGH,
}
