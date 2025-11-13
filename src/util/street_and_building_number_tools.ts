export const separator = '|||';

export function splitStreetAndBuildingNumber( street: string ): { street: string; buildingNumber: string } {
	const values = street.split( separator );
	return {
		street: values[ 0 ] ?? '',
		buildingNumber: values[ 1 ] ?? '',
	};
}

export function joinStreetAndBuildingNumber( streetName: string, buildingNumber: string ): string {
	return streetName + separator + buildingNumber;
}

export function clearStreetAndBuildingNumberSeparator( street: string ): string {
	return street.replace( separator, ' ' ).trim();
}
