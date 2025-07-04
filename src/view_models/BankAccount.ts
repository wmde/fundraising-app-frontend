import { Validity } from './Validity';

export interface BankAccountValues {
	bankName: string;
	iban: string;
	bic: string;
}

export interface BankAccount {
	isValidating: boolean;
	validity: {
		iban: Validity;
	};
	values: BankAccountValues;
}

export interface InitialBankAccountData {
	bankName?: string;
	iban?: string;
	bic?: string;
}

export interface BankAccountNumberRequest {
	accountNumber: string;
	bankCode: string;
}

export interface BankIbanRequest {
	iban: string;
}

export interface BankAccountResponse {
	iban: string;
	bic: string;
	accountNumber: string;
	bankCode: string;
	bankName?: string;
}
