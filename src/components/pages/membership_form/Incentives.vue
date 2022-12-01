<template>
	<div class="option-checkbox">
		<b-checkbox
			v-for="incentive in incentiveChoices"
			:key="incentive"
			type="checkbox"
			class="is-inline-checkbox"
			:class="'incentive-' + incentive.replace( ' ', '-' )"
			:native-value="incentive"
			v-model="incentives"
			@change.native="onChange()">
			{{ message }}
		</b-checkbox>
	</div>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'Incentives',
	data: function () {
		return {
			incentives: this.$props.defaultIncentives,
		};
	},
	props: {
		message: String,
		incentiveChoices: Array as () => Array<String>,
		defaultIncentives: Array as () => Array<String>,
	},
	methods: {
		onChange: function () {
			this.$emit( 'incentives-changed', this.incentives );
		},
	},
} );
</script>
