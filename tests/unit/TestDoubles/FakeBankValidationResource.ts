import { BankValidationResource } from '@src/api/BankValidationResource';
import { BankAccountResponse } from '@src/view_models/BankAccount';

export class FakeBankValidationResource implements BankValidationResource {
	async validateIban(): Promise<BankAccountResponse> {
		return {
			accountNumber: '',
			bankCode: '',
			bankName: '',
			iban: '',
			bic: '',
		};
	}

	async validateBankNumber(): Promise<BankAccountResponse> {
		return {
			accountNumber: '',
			bankCode: '',
			bankName: '',
			iban: '',
			bic: '',
		};
	}
}
