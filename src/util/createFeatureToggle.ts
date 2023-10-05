import { useSlots } from 'vue';

export function createFeatureToggle( activeFeatures?: string[] ) {
	return {
		props: {
			defaultTemplate: {
				type: String,
				default: '',
			},
		},
		setup() {
			const slots = useSlots();
			const usedSlotNames = Object.keys( slots );
			const slotsToShow = usedSlotNames.filter( ( slotName: string ) => activeFeatures.indexOf( slotName ) > -1 );

			return { slotsToShow };
		},
		template: `
			<slot v-if="slotsToShow.length > 0" v-for="( slotName, idx ) in slotsToShow" :key="idx" :name="slotName"/>
			<slot v-else :name="defaultTemplate"/>
		`,
	};
}
