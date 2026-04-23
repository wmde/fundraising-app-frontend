import { vi } from 'vitest';
import type { BankValidationResource } from '@src/api/BankValidationResource';

export const newFailingBankValidationResource = (): BankValidationResource => {
	return {
		validateBankNumber: vi.fn().mockRejectedValue( 'ERR' ),
		validateIban: vi.fn().mockRejectedValue( 'ERR' ),
	};
};
