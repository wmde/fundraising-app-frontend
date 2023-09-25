export interface FeatureFetcher {
	getFeatures(): string[];
}

export function createFeatureFetcher( selectedBuckets: string[], activeFeatures: string[] ): FeatureFetcher {
	return {
		getFeatures: () => [ ...selectedBuckets, ...activeFeatures ],
	};
}

export function createNullFeatureFetcher(): FeatureFetcher {
	return {
		getFeatures: () => [],
	};
}
