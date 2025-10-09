<template>

	<RadioField
		name="addressType"
		id="address-form-type"
		:options="[
			{
				value: AddressTypeModel.PERSON,
				label: $t( 'donation_form_addresstype_option_private_addresstype_basic' ),
				id: 'addressType-0'
			},
			{
				value: AddressTypeModel.COMPANY,
				label: $t( 'donation_form_addresstype_option_company_addresstype_basic' ),
				id: 'addressType-1'
			},
			{
				value: AddressTypeModel.ANON,
				label: $t( 'donation_form_addresstype_option_anonymous_addresstype_basic' ),
				id: 'addressType-2'
			},
		]"
		:label="$t( 'donation_form_address_choice_title_addresstype_basic' )"
		:disabled="disabledAddressTypes"
		:show-error="addressTypeIsInvalid"
		:error-message="$t( 'donation_form_section_address_error' )"
		v-model="addressType"
		alignment="column"
	>
		<template #tooltip-4>
			<RadioFieldHelpText v-if="isDirectDebit">
				{{ $t( 'donation_form_address_choice_direct_debit_disclaimer_addresstype_basic') }}
			</RadioFieldHelpText>
		</template>
	</RadioField>

</template>

<script setup lang="ts">

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { ref, watch } from 'vue';
import RadioFieldHelpText from '@src/components/shared/form_elements/RadioFieldTooltip.vue';

interface Props {
	disabledAddressTypes: AddressTypeModel[];
	isDirectDebit: boolean;
	addressTypeIsInvalid: boolean;
	initialAddressType?: AddressTypeModel;
}
const props = defineProps<Props>();

const emit = defineEmits( [ 'address-type' ] );

const addressType = ref<AddressTypeModel>( props.initialAddressType ?? AddressTypeModel.UNSET );

watch( addressType, newAddressType => {
	emit( 'address-type', newAddressType );
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
