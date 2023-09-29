<template>

	<RadioField
			name="addressType"
			:options="addressTypeOptions"
			:label="$t( 'donation_form_address_choice_title_addresstype_basic' )"
			:disabled="disabledAddressTypesForModel"
      :show-error="addressTypeIsInvalid"
      :error-message="$t( 'donation_form_section_address_error' )"
			v-model="addressType"
			alignment="column"
	>
    <template #intro-message>
      <div v-show="isDirectDebit" class="info-message address-type-direct-debit-disclaimer">
        {{ $t( 'donation_form_address_choice_direct_debit_disclaimer_addresstype_basic' ) }}
      </div>
    </template>
  </RadioField>

</template>

<script setup lang="ts">

import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type AddressStates = 'anonymous' | 'person' | 'company' | 'unset';

interface Props {
	disabledAddressTypes: AddressTypeModel[]
	isDirectDebit: boolean;
  addressTypeIsInvalid: boolean;
	initialAddressType?: AddressStates;
}
const props = defineProps<Props>();

const emit = defineEmits( [ 'address-type', 'set-full-selected' ] );

const addressType = ref<AddressStates>( props.initialAddressType ?? 'unset' );
const disabledAddressTypesForModel = computed( () => props.disabledAddressTypes.reduce(
	( acc, cur ) => {
		if ( cur === AddressTypeModel.COMPANY ) {
			acc.push( 'company' );
		} else if ( cur === AddressTypeModel.ANON ) {
			acc.push( 'anonymous' );
		}
		// Don't push person, as it is the default
		return acc;
	},
	[] as AddressStates[]
) );
const addressTypeToAddressTypeModel = new Map<AddressStates, AddressTypeModel>( [
	[ 'anonymous', AddressTypeModel.ANON ],
	[ 'person', AddressTypeModel.PERSON ],
	[ 'company', AddressTypeModel.COMPANY ],
] );

const { t } = useI18n();

const addressTypeOptions = [
	{
		value: 'person',
		label: t( 'donation_form_addresstype_option_private_addresstype_basic' ),
	},
	{
		value: 'company',
		label: t( 'donation_form_addresstype_option_company_addresstype_basic' ),
	},
	{
		value: 'anonymous',
		label: t( 'donation_form_addresstype_option_anonymous_addresstype_basic' ),
	},
];

emit( 'set-full-selected', true );

watch( addressType, newAddressType => {
	emit( 'address-type', addressTypeToAddressTypeModel.get( newAddressType ) );
} );

// When disabled address type is selected, revert to person type
watch( () => props.disabledAddressTypes, disabledAddressTypes => {
	if ( disabledAddressTypes !== undefined &&
			disabledAddressTypes.includes( addressTypeToAddressTypeModel.get( addressType.value ) ) ) {
		addressType.value = 'person';
	}
} );

</script>
