export interface UpdateAddressResponse {
	identifier: string;
	previousIdentifier: string;
	address: Record<string, string>;
	donationReceipt: boolean;
	exportState: string;
}
