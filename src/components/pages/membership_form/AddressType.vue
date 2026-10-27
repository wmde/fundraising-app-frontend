<template>
	<RadioField
		name="addressType"
		id="address-form-type"
		:label="$t('membership_form_section_address_header_type')"
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
		:is-max-width-field="isMaxWidthField"
	>
		<template #[companyTooltipSlotName]>
			<Tooltip v-if="disabledAddressTypes.includes( AddressTypeModel.COMPANY )">
				{{ $t( 'membership_form_address_type_company_disabled_info' ) }}
			</Tooltip>
		</template>
	</RadioField>
</template>

<script setup lang="ts">

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import Tooltip from '@src/components/patterns/Tooltip.vue';
import { ref, watch } from 'vue';

interface Props {
	disabledAddressTypes: AddressTypeModel[];
	isDirectDebit: boolean;
	addressTypeIsInvalid: boolean;
	initialAddressType?: AddressTypeModel;
	isMaxWidthField?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits( [ 'field-changed' ] );

const addressType = ref<AddressTypeModel>( props.initialAddressType ?? AddressTypeModel.UNSET );

const companyTooltipSlotName = `tooltip-${ AddressTypeModel.COMPANY }`;

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
