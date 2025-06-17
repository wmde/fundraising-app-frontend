export interface Page {
	url: string;
	name: string;
	content: string;
	codeSamples: [ { name: string; code: string } ] | undefined;
}
