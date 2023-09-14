import { useSlots } from 'vue';

export interface FeatureTogglePluginOptions {
	activeFeatures: string[],
}

export function createFeatureToggle( options?: FeatureTogglePluginOptions ) {
	return {
		setup() {
			const activeFeatures = options?.activeFeatures;
			const slots = useSlots();
			const usedSlotNames = Object.keys( slots );
			const slotsToShow: string[] = [];
			usedSlotNames.forEach( ( slotName: string ): void => {
				if ( activeFeatures.indexOf( slotName ) > -1 ) {
					slotsToShow.push( slotName );
				}
			} );

			return { slotsToShow };
		},
		template: `<template v-for="( slotName, idx ) in slotsToShow" :key="idx">
			<slot :name="slotName" />
		</template>`,
	};
}
