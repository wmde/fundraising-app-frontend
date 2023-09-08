<template>
	<fieldset>
		<legend class="title is-size-5">{{ $t( 'membership_form_section_address_header_type' ) }}</legend>
		<div>
			<RadioInput id="personal"
					name="addressTypeInternal"
					v-model="type"
					:native-value="AddressTypeModel.PERSON"
					@change.native="setAddressType()">{{ $t( 'donation_form_addresstype_option_private' ) }}
			</RadioInput>
		</div>
		<div>
			<RadioInput id="company"
					name="addressTypeInternal"
					v-model="type"
					:native-value="AddressTypeModel.COMPANY"
					@change.native="setAddressType()">
				{{ $t( 'donation_form_addresstype_option_company' ) }}
			</RadioInput>
		</div>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';

export default defineComponent( {
	name: 'AddressType',
	components: { RadioInput },
	data: function () {
		return {
			type: this.$props.initialValue,
		};
	},
	props: {
		initialValue: [ Number as () => AddressTypeModel, String ],
	},
	computed: {
		AddressTypeModel: {
			get: function () {
				return AddressTypeModel;
			},
		},
	},
	methods: {
		setAddressType: function () {
			this.$emit( 'address-type', this.$data.type );
		},
	},
} );
</script>
