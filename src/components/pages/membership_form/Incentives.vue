<template>
	<div class="option-checkbox">
		<FunCheckbox
			v-for="incentive in incentiveChoices"
			:key="incentive"
			class="is-inline-checkbox"
			:class="'incentive-' + incentive.replace( ' ', '-' )"
			:native-value="incentive"
			v-model="incentives"
			name="incentives"
			@change.native="onChange()"
		>
			{{ message }}
		</FunCheckbox>
	</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FunCheckbox from '@src/components/shared/legacy_form_inputs/FunCheckbox.vue';

export default defineComponent( {
	name: 'Incentives',
	components: { FunCheckbox },
	data: function () {
		return {
			incentives: this.$props.defaultIncentives,
		};
	},
	props: {
		message: String,
		incentiveChoices: Array as () => Array<string>,
		defaultIncentives: Array as () => Array<string>,
	},
	methods: {
		onChange: function () {
			this.$emit( 'incentives-changed', this.incentives );
		},
	},
} );
</script>
