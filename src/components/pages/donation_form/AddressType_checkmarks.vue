<template>
	<fieldset class="form-input form-input__vertical-option-list address-list">
		<legend class="subtitle">{{ $t( 'C21_WMDE_Test_15_header' ) }}</legend>

		<div class="radio-container address-preselection">
			<b-radio
				v-model="addressType"
				native-value="full"
				name="addressType"
			>
				<div class="address-choice">
					{{ $t( 'C21_WMDE_Test_15_full_title' ) }}
				</div>
				<div class="info-message">
					<ul>
						<li class="info-message-first-item">
							<span class="icon-text">
								<span class="icon">
									<checkmark/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_full_line_1' ) }}</em>
							</span>
						</li>
						<li>
							<span class="icon-text">
								<span class="icon">
									<checkmark/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_full_line_2' ) }}</em>
							</span>
						</li>
					</ul>
				</div>
			</b-radio>
			<b-radio
				name="addressType"
				v-model="addressType"
				native-value="email"
				:disabled="disableEmail">
				<div class="address-choice">
					{{ $t( 'C21_WMDE_Test_15_email_title' ) }}
				</div>
				<div class="info-message">
					<ul>
						<li class="info-message-first-item">
							<span class="icon-text">
								<span class="icon">
									<checkmark/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_email_line_1' ) }}</em>
							</span>
						</li>
						<li>
							<span class="icon-text">
								<span class="icon">
									<cross/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_email_line_2' ) }}</em>
							</span>
						</li>
					</ul>
				</div>
			</b-radio>
			<b-radio
				id="anonymous"
				name="addressType"
				v-model="addressType"
				native-value="anonymous"
				:disabled="disableAnonymous">
				<div class="address-choice">
					{{ $t( 'C21_WMDE_Test_15_none_title' ) }}
				</div>
				<div class="info-message">
					<ul>
						<li class="info-message-first-item">
							<span class="icon-text">
								<span class="icon">
									<cross/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_none_line_1' ) }}</em>
							</span>
						</li>
						<li>
							<span class="icon-text">
								<span class="icon">
									<cross/>
								</span>
								<em>{{ $t( 'C21_WMDE_Test_15_none_line_2' ) }}</em>
							</span>
						</li>
					</ul>
				</div>
			</b-radio>
		</div>

		<legend class="subtitle address-type-subtitle" v-show="isFullAddressSelected">{{
				$t( 'donation_form_section_address_header_type' )
			}}
		</legend>
		<div class="radio-container" v-show="isFullAddressSelected">
			<b-radio
				name="addressTypeInternal"
				v-model="fullAddressType"
				native-value="person"
			>{{ $t( 'donation_form_addresstype_option_private' ) }}
			</b-radio>
			<b-radio
				v-show="isFullAddressSelected"
				name="addressTypeInternal"
				v-model="fullAddressType"
				native-value="company"
			>
				{{ $t( 'donation_form_addresstype_option_company' ) }}
			</b-radio>
		</div>

	</fieldset>
</template>

<script lang="ts">
import { addressTypeFromName, AddressTypeModel } from '@/view_models/AddressTypeModel';
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api';
import Checkmark from '@/components/pages/donation_form/Checkmark.vue';
import Cross from '@/components/pages/donation_form/Cross.vue';

type fullAddressStates = '' | 'person' | 'company';

const fullAddressTypeToModel: Record<fullAddressStates, AddressTypeModel> = {
	'': AddressTypeModel.UNSET,
	person: AddressTypeModel.PERSON,
	company: AddressTypeModel.COMPANY,
};

// TODO: If this option wins the test add a store state to handle the pre-address type selection
//       This will allow it to be saved and restored from local storage and simplify states here
export default defineComponent( {
	name: 'AddressTypeCheckmarks',
	components: { Cross, Checkmark },
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

<style lang="scss">
	.address-list {
		.subtitle {
			font-size: 14px;
			margin-top: 14px;
		}
		.address-type-subtitle {
			margin-top: 50px;
		}
		.address-choice {
			font-size: 16px;
			margin-bottom: 12px;
		}
		.address-preselection .b-radio.radio {
			padding: 24px 0 0;
		}
		.address-preselection .b-radio.radio .check {
			margin-top: 2px;
		}
		.info-message {
			font-size: 14px;
			margin-bottom: 12px;
		}
		.info-message-first-item {
			margin-bottom: 16px;
		}
	}
</style>
