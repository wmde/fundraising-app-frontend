<template>
	<fieldset class="form-input form-input__vertical-option-list">
		<legend class="subtitle">{{ $t( 'donation_form_provisional_address_choice_title' ) }}</legend>
		<div v-show="isDirectDebit" class="info-message has-margin-top-18">
			{{ $t( 'donation_form_address_choice_direct_debit_disclaimer' ) }}
		</div>

		<div class="radio-container">

      <b-radio
          name="addressType"
          v-model="addressType"
          native-value="person"
      >{{ $t( 'donation_form_addresstype_option_private' ) }}
      </b-radio>

      <b-radio
          name="addressType"
          v-model="addressType"
          native-value="company"
      >
        {{ $t( 'donation_form_addresstype_option_company' ) }}
      </b-radio>

      <b-radio
          id="anonymous"
          name="addressType"
          v-model="addressType"
          native-value="anonymous"
          :disabled="disableAnonymous">
        {{ $t( 'donation_form_addresstype_option_anonymous' ) }}
      </b-radio>

		</div>

	</fieldset>
</template>

<script lang="ts">
import { addressTypeFromName, AddressTypeModel } from '@/view_models/AddressTypeModel';
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api';

// TODO: If this option wins the test add a store state to handle the pre-address type selection
//       This will allow it to be saved and restored from local storage and simplify states here
export default defineComponent( {
	name: 'BasicAddressType',
	props: {
		disabledAddressTypes: Array as PropType<Array<AddressTypeModel>>,
		disabledAnonymousType: Boolean,
		initialAddressType: String,
		isDirectDebit: Boolean,
	},
	setup( props, { emit } ) {

		const addressType = ref( '' );

		const initialAddressTypeString = props.initialAddressType ? props.initialAddressType : 'unset';

		switch ( addressTypeFromName( initialAddressTypeString ) ) {
			case AddressTypeModel.ANON:
				addressType.value = 'anonymous';
				break;
			case AddressTypeModel.UNSET:
				addressType.value = initialAddressTypeString;
				break;
			case AddressTypeModel.PERSON:
				addressType.value = 'person';
				break;
			case AddressTypeModel.COMPANY:
				addressType.value = 'company';
				break;
		}
		const type: Ref<AddressTypeModel> = ref( addressTypeFromName( initialAddressTypeString ) );

		emit( 'set-full-selected', true );

		const disableAnonymous = computed( (): boolean => props.disabledAddressTypes !== undefined && props.disabledAddressTypes.includes( AddressTypeModel.ANON ) );

		// When disabled address type is selected, revert to person type
		watch( () => props.disabledAddressTypes, disabledAddressTypes => {
			if ( disabledAddressTypes !== undefined && type.value !== null && disabledAddressTypes.includes( type.value ) ) {
				addressType.value = 'person';
			}
		} );

		// Convert addressType to AddressTypeModel
		watch( addressType, newAddressType => {
			switch ( newAddressType ) {
				case 'person':
					type.value = AddressTypeModel.PERSON;
					break;
				case 'company':
					type.value = AddressTypeModel.COMPANY;
					break;
				case 'anonymous':
					type.value = AddressTypeModel.ANON;
					break;
			}
			emit( 'address-type', type.value );
		} );

		return {
			type,
			addressType,
			disableAnonymous,
		};
	},
} );
</script>
