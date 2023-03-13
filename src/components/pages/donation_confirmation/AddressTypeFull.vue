<template>
	<fieldset class="form-input form-input__vertical-option-list">
		<legend class="subtitle">{{ $t( 'donation_form_section_address_header_type' ) }}</legend>
		<div class="radio-container">
			<b-radio
					id="address-type-person"
					name="addressTypeInternal"
					v-model="addressType"
					native-value="person"
			>{{ $t( 'donation_form_addresstype_option_private' ) }}
			</b-radio>
			<b-radio
					id="address-type-company"
					name="addressTypeInternal"
					v-model="addressType"
					native-value="company"
			>{{ $t( 'donation_form_addresstype_option_company' ) }}
			</b-radio>
		</div>

	</fieldset>
</template>

<script lang="ts">
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent( {
	name: 'AddressTypeFull',
	props: {
		initialAddressType: String,
	},
	setup( props, { emit } ) {

		const addressType = ref<string>( props.initialAddressType ?? 'unset' );

		watch( addressType, newAddressType => {
			switch ( newAddressType ) {
				case 'person':
					emit( 'address-type', AddressTypeModel.PERSON );
					break;
				case 'company':
					emit( 'address-type', AddressTypeModel.COMPANY );
					break;
			}
		} );

		return {
			addressType,
		};
	},
} );
</script>
