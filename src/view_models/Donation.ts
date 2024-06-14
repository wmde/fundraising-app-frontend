export interface Donation {
	accessToken: string,
	amount: number,
	bankTransferCode: string,
	cookieDuration: string,
	creationDate: string,
	id: number,
	interval: number,
	receipt: boolean,
	newsletter: boolean,
	paymentType: string,
	status: string
	updateToken: string,
	isExported: boolean,
}
