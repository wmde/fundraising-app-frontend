import { Validity } from './Validity';

export interface BankAccount {
	isValidating: boolean;
	validity: {
		iban: Validity;
	};
	values: {
		bankName: string;
		iban: string;
		bic: string;
	};
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
