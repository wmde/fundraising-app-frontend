export function looksLikeIban( bankNumber: string ): boolean {
	return /^[A-Z]{2}[A-Z0-9\s]+$/i.test( bankNumber );
}

export function looksLikeBankAccountNumber( bankNumber: string ): boolean {
	return /^\d+$/.test( bankNumber );
}

export function looksLikeGermanIban( bankNumber: string ): boolean {
	return /^DE[0-9\s]+$/i.test( bankNumber );
}

export function looksLikeValidAccountNumber( bankNumber: string ): boolean {
	return looksLikeIban( bankNumber ) || looksLikeBankAccountNumber( bankNumber );
}
