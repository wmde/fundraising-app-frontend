<template>
	<fieldset class="form-input form-input__vertical-option-list">
		<legend class="subtitle">{{ $t( 'donation_form_address_choice_title_addresstype' ) }}</legend>
		<div v-show="isDirectDebit" class="info-message has-margin-top-18">
			{{ $t( 'donation_form_address_choice_direct_debit_disclaimer_addresstype' ) }}
		</div>

		<div class="radio-container">
			<RadioInput
					v-model="addressType"
					native-value="full"
					name="addressType"
			>
				{{ $t( 'donation_form_address_choice_fulladdress_addresstype' ) }}
				<div class="info-message has-margin-top-18">
					{{ $t( 'donation_form_address_choice_fulladdress_notice_addresstype' ) }}
				</div>
			</RadioInput>
			<RadioInput
					name="addressType"
					v-model="addressType"
					native-value="email"
					:disabled="disableEmail">
				{{ $t( 'donation_form_address_choice_emailonly_addresstype' ) }}
				<div class="info-message has-margin-top-18">
					{{ $t( 'donation_form_address_choice_emailonly_notice_addresstype' ) }}
				</div>
			</RadioInput>
			<RadioInput
					id="anonymous"
					name="addressType"
					v-model="addressType"
					native-value="anonymous"
					:disabled="disableAnonymous">
				{{ $t( 'donation_form_address_choice_noaddress_addresstype' ) }}
				<div class="info-message has-margin-top-18">
					{{ $t( 'donation_form_address_choice_noaddress_notice_addresstype' ) }}
				</div>
			</RadioInput>
		</div>

		<legend class="subtitle" v-show="isFullAddressSelected">{{
				$t( 'donation_form_section_address_header_type_addresstype' )
			}}
		</legend>
		<div class="radio-container" v-show="isFullAddressSelected">
			<RadioInput
					name="addressTypeInternal"
					v-model="fullAddressType"
					native-value="person"
			>{{ $t( 'donation_form_addresstype_option_private_addresstype' ) }}
			</RadioInput>
			<RadioInput
					v-show="isFullAddressSelected"
					name="addressTypeInternal"
					v-model="fullAddressType"
					native-value="company"
			>
				{{ $t( 'donation_form_addresstype_option_company_addresstype' ) }}
			</RadioInput>
		</div>

	</fieldset>
</template>

<script lang="ts">
import { addressTypeFromName, AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { computed, defineComponent, PropType, Ref, ref, watch } from 'vue';
import RadioInput from '@src/components/shared/legacy_form_inputs/RadioInput.vue';

type fullAddressStates = '' | 'person' | 'company';

const fullAddressTypeToModel: Record<fullAddressStates, AddressTypeModel> = {
	'': AddressTypeModel.UNSET,
	person: AddressTypeModel.PERSON,
	company: AddressTypeModel.COMPANY,
};

// TODO: If this option wins the test add a store state to handle the pre-address type selection
//       This will allow it to be saved and restored from local storage and simplify states here
export default defineComponent( {
	name: 'AddressType',
	components: { RadioInput },
	props: {
		disabledAddressTypes: Array as PropType<Array<AddressTypeModel>>,
		initialAddressType: String,
		isDirectDebit: Boolean,
	},
	setup( props, { emit } ) {

		const fullAddressType: Ref<fullAddressStates> = ref( '' );
		const addressType = ref( '' );

		const initialAddressTypeString = props.initialAddressType ? props.initialAddressType : 'unset';

		switch ( addressTypeFromName( initialAddressTypeString ) ) {
			case AddressTypeModel.ANON:
				fullAddressType.value = '';
				addressType.value = 'anonymous';
				break;
			case AddressTypeModel.EMAIL:
			case AddressTypeModel.UNSET:
				fullAddressType.value = '';
				addressType.value = initialAddressTypeString;
				break;
			case AddressTypeModel.PERSON:
				addressType.value = 'full';
				fullAddressType.value = 'person';
				break;
			case AddressTypeModel.COMPANY:
				addressType.value = 'full';
				fullAddressType.value = 'company';
				break;

		}
		const type: Ref<AddressTypeModel> = ref( addressTypeFromName( initialAddressTypeString ) );

		const disableEmail = computed( (): boolean => props.disabledAddressTypes !== undefined && props.disabledAddressTypes.includes( AddressTypeModel.EMAIL ) );
		const disableAnonymous = computed( (): boolean => props.disabledAddressTypes !== undefined && props.disabledAddressTypes.includes( AddressTypeModel.ANON ) );
		const isFullAddressSelected = computed( (): boolean => addressType.value === 'full' );

		// When disabled address type is selected, revert to person type
		watch( () => props.disabledAddressTypes, disabledAddressTypes => {
			if ( disabledAddressTypes !== undefined && type.value !== null && disabledAddressTypes.includes( type.value ) ) {
				addressType.value = 'full';
				fullAddressType.value = 'person';
			}
		} );

		// Convert addressType and fullAddressType to AddressTypeModel
		watch( addressType, newAddressType => {
			switch ( newAddressType ) {
				case 'full':
					type.value = AddressTypeModel.UNSET;
					break;
				case 'email':
					type.value = AddressTypeModel.EMAIL;
					fullAddressType.value = '';
					break;
				case 'anonymous':
					type.value = AddressTypeModel.ANON;
					fullAddressType.value = '';
					break;
			}
			emit( 'set-full-selected', newAddressType === 'full' );
			emit( 'address-type', type.value );
		} );

		watch( fullAddressType, newFullAddressType => {
			if ( newFullAddressType === '' ) {
				return;
			}
			type.value = fullAddressTypeToModel[ newFullAddressType ];
			emit( 'address-type', type.value );
		} );

		return {
			type,
			fullAddressType,
			addressType,
			disableEmail,
			disableAnonymous,
			isFullAddressSelected,
		};
	},
} );
</script>
