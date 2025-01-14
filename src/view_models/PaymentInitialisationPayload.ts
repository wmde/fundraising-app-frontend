import { InitialPaymentValues } from '@src/view_models/Payment';

export interface PaymentInitialisationPayload {
	initialValues: InitialPaymentValues;
	allowedIntervals: number[];
	allowedPaymentTypes: string[];
}
