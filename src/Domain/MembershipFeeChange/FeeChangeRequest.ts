export interface FeeChangeRequest {
	uuid: string;
	memberName: string;
	amountInEuroCents: number;
	paymentType: string;
	iban?: string;
	bic?: string;
}
