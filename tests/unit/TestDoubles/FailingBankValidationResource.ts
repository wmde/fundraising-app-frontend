import { BankValidationResource } from '@src/api/BankValidationResource';

export const newFailingBankValidationResource = (): BankValidationResource => {
	return {
		validateBankNumber: jest.fn().mockRejectedValue( 'ERR' ),
		validateIban: jest.fn().mockRejectedValue( 'ERR' ),
	};
};
