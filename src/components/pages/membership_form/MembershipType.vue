<template>
	<fieldset class="has-margin-top-18">
		<legend class="title is-size-5">{{ $t('membership_form_membershiptype_legend') }}</legend>
		<div class="membership-type">
			<RadioInput :class="{ 'is-active': selectedType === MembershipTypeModel.SUSTAINING }"
					id="sustaining"
					name="type"
					v-model="selectedType"
					:native-value="MembershipTypeModel.SUSTAINING"
					@change.native="setType">
				{{ $t( 'membership_form_membershiptype_option_sustaining' ) }}
				<p class="has-text-dark-lighter">{{ $t( 'membership_form_membershiptype_option_sustaining_legend' ) }}</p>
			</RadioInput>
			<RadioInput :class="{ 'is-active': selectedType === MembershipTypeModel.ACTIVE && !isActiveTypeDisabled }"
					id="active"
					name="type"
					:type="isActiveTypeDisabled ? 'is-gray-dark' : ''"
					v-model="selectedType"
					:native-value="MembershipTypeModel.ACTIVE"
					:disabled="isActiveTypeDisabled"
					@change.native="setType">
				{{ $t( 'membership_form_membershiptype_option_active' ) }}
				<p class="has-text-dark-lighter">{{ $t( 'membership_form_membershiptype_option_active_legend' ) }}</p>
			</RadioInput>
			<span v-if="activeTypeSelectedAndDisabled" class="help is-danger">{{ $t( 'membership_form_membershiptype_error' ) }}</span>
		</div>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import { setMembershipType } from '@src/store/membership_address/actionTypes';
import { action } from '@src/store/util';
import { mapGetters } from 'vuex';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';

export default defineComponent( {
	name: 'MembershipType',
	components: { RadioInput },
	data: function () {
		return {
			selectedType: MembershipTypeModel.SUSTAINING,
		};
	},
	computed: {
		activeTypeSelectedAndDisabled: {
			get: function () {
				return ( this as any ).selectedType === MembershipTypeModel.ACTIVE && ( this as any ).isActiveTypeDisabled;
			},
		},
		MembershipTypeModel: {
			get: function () {
				return MembershipTypeModel;
			},
		},
		AddressTypeModel: {
			get: function () {
				return AddressTypeModel;
			},
		},
		...mapGetters( NS_MEMBERSHIP_ADDRESS, [ 'addressType' ] ),
		isActiveTypeDisabled: {
			get: function (): boolean {
				return ( this as any ).addressType === AddressTypeModel.COMPANY;
			},
		},
	},
	mounted() {
		this.$data.selectedType = this.$store.state[ NS_MEMBERSHIP_ADDRESS ].membershipType;
	},
	methods: {
		setType(): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setMembershipType ), this.$data.selectedType );
		},
	},
} );
</script>
<style lang="scss">
	.membership-type {
		.fun-radio.radio {
			height: auto;
			padding-bottom: .5em;
			& + .radio {
				margin-left: 0;
			}
		}
	}
</style>
