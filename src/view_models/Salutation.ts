export interface Salutation {
	label: string,
	value: string,
	display: string,
	greetings: {
		formal: string,
		informal: string,
		lastNameInformal: string,
	},
}
