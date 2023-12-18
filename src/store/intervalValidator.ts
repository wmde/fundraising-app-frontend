export function isValidInterval( interval: string, allowedIntervals: number[] ): boolean {
	if ( !allowedIntervals.includes( Number( interval ) ) ) {
		return false;
	}

	return true;
}
