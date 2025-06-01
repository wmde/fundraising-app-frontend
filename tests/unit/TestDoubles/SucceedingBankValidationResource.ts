import type { BankAccountResponse } from '@src/view_models/BankAccount';
import type { BankValidationResource } from '@src/api/BankValidationResource';
import { accountNumber, bankCode, bankName, BIC, IBAN } from '@test/data/bankdata';

export const newSucceedingBankValidationResource = ( apiReturnValue: BankAccountResponse = null ): BankValidationResource => {
	const returnValue: BankAccountResponse = apiReturnValue ?? {
		accountNumber,
		bankCode,
		bankName,
		iban: IBAN,
		bic: BIC,
	};
	return {
		validateBankNumber: jest.fn( () => Promise.resolve( returnValue ) ),
		validateIban: jest.fn( () => Promise.resolve( returnValue ) ),
	};
};
