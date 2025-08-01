import { Validity } from './Validity';

export interface PaymentValues {
	amount: string;
	type: string;
	interval: string;
}

export interface Payment {
	isValidating: boolean;
	validity: {
		[key: string]: Validity;
	};
	values: PaymentValues;
}

export interface AmountData {
	amountValue: string;
	amountCustomValue: string;
}

export interface IntervalData {
	selectedInterval: String;
}

export interface TypeData {
	selectedType: string;
}

export interface InitialPaymentValues {
	amount: string;
	type: string;
	paymentIntervalInMonths: string;
	isCustomAmount: boolean;
}

export enum AmountValidity {
	AMOUNT_VALID,
	AMOUNT_TOO_LOW,
	AMOUNT_TOO_HIGH,
}
