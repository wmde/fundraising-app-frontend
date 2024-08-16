import { Validity } from './Validity';

export interface BankAccount {
    isValidating: boolean;
    validity: {
        accountNumber: Validity;
        bankCode: Validity;
    };
    values: {
        accountNumber: string;
        bankCode: string;
        bankName: string;
        iban: string;
        bic: string;
    };
}

export enum AccountNumberType {
    None,
    IBAN,
    Account
}

export interface BankAccountData {
    accountNumber: string;
    bankCode: string;
    bankName?: string;
}

export interface InitialBankAccountData {
    accountNumber?: string;
    bankCode?: string;
    bankname?: string;
}

export interface BankAccountRequest {
    validationUrl: string;
    requestParams: object;
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
