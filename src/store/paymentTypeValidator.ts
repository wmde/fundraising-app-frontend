import { PaymentType } from '@src/view_models/PaymentType';

export function isValidPaymentType( paymentType: string, interval: string, allowedPaymentTypes: string[] ): boolean {
	if ( !allowedPaymentTypes.includes( paymentType ) ) {
		return false;
	}

	// Sofort payments can't be recurring so clear the type if it is initialised with an interval
	if ( paymentType === PaymentType.SOFORT && ![ '', '0' ].includes( interval ) ) {
		return false;
	}

	return true;
}
