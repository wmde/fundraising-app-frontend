import { BankAccountNumberRequest, BankAccountResponse, BankIbanRequest } from '@src/view_models/BankAccount';
import axios from 'axios';

export interface BankValidationResource {
	validateIban: ( data: BankIbanRequest ) => Promise<BankAccountResponse>;
	validateBankNumber: ( data: BankAccountNumberRequest ) => Promise<BankAccountResponse>;
}

export interface APIResponse {
	status: string;
	iban: string;
	bic: string;
	account: string;
	bankCode: string;
	bankName?: string;
}

export class ApiBankValidationResource implements BankValidationResource {
	validateIbanEndpoint: string;
	validateBankNumberEndpoint: string;

	constructor( validateIbanEndpoint: string, validateBankNumberEndpoint: string ) {
		this.validateIbanEndpoint = validateIbanEndpoint;
		this.validateBankNumberEndpoint = validateBankNumberEndpoint;
	}

	async validateIban( data: BankIbanRequest ): Promise<BankAccountResponse> {
		return this.validateBankData( this.validateIbanEndpoint, data ).then( ( response: APIResponse ) => {
			return {
				accountNumber: response.account,
				bankCode: response.bankCode,
				bankName: response.bankName,
				iban: response.iban,
				bic: response.bic,
			};
		} );
	}

	async validateBankNumber( data: BankAccountNumberRequest ): Promise<BankAccountResponse> {
		return this.validateBankData( this.validateBankNumberEndpoint, data ).then( ( response: APIResponse ) => {
			return {
				accountNumber: response.account,
				bankCode: response.bankCode,
				bankName: response.bankName,
				iban: response.iban,
				bic: response.bic,
			};
		} );
	}

	async validateBankData( endpoint: string, data: BankAccountNumberRequest | BankIbanRequest ): Promise<APIResponse> {
		let validationResult = await axios( endpoint, {
			method: 'get',
			headers: { 'Content-Type': 'multipart/form-data' },
			params: data,
		} );

		if ( validationResult.data.status === 'ERR' ) {
			return Promise.reject( 'ERR' );
		}

		return Promise.resolve( validationResult.data );
	}
}
