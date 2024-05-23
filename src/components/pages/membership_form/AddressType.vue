<template>
	<RadioField
		name="addressType"
		:options="[
			{
				value: AddressTypeModel.PERSON,
				label: $t( 'donation_form_addresstype_option_private' ),
				id: 'addressType-0',
			},
			{
				value: AddressTypeModel.COMPANY,
				label: $t( 'donation_form_addresstype_option_company' ),
				id: 'addressType-1',
			},
		]"
		:disabled="disabledAddressTypes"
		:show-error="addressTypeIsInvalid"
		:error-message="$t( 'donation_form_section_address_error' )"
		v-model="addressType"
		alignment="column"
	>
	</RadioField>
</template>

<script setup lang="ts">

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { ref, watch } from 'vue';

interface Props {
	disabledAddressTypes: AddressTypeModel[]
	isDirectDebit: boolean;
	addressTypeIsInvalid: boolean;
	initialAddressType?: AddressTypeModel;
}
const props = defineProps<Props>();

const emit = defineEmits( [ 'field-changed' ] );

const addressType = ref<AddressTypeModel>( props.initialAddressType ?? AddressTypeModel.UNSET );

watch( addressType, newAddressType => {
	emit( 'field-changed', newAddressType );
} );

// When disabled address type is selected, revert to person type
watch( () => props.disabledAddressTypes, disabledAddressTypes => {
	// TODO This assumes that person will never be disabled.
	//      If this assumption is wrong, we need to have a fallback.
	if ( disabledAddressTypes !== undefined &&
		disabledAddressTypes.includes( addressType.value ) ) {
		addressType.value = AddressTypeModel.PERSON;
	}
} );

</script>
