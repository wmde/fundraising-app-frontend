<template>
	<form id="address-update-form" class="flow" name="address-update-form" v-on:submit.prevent="submit" method="post" ref="addressForm">
		<MembershipAddressUpdateFormErrorSummaries :address-type="addressType" :show-error-summary="showErrorSummary"/>

		<AutofillHandler v-on:autofill="onAutofill">

			<RadioField
				v-if="!isActiveMembership"
				name="addressType"
				id="address-form-type"
				class="address-type-field"
				:options="[
					{
						value: AddressTypeModel.PERSON,
						label: $t( 'membership_form_addresstype_option_private' ),
						id: 'addressType-0'
					},
					{
						value: AddressTypeModel.COMPANY,
						label: $t( 'membership_form_addresstype_option_company' ),
						id: 'addressType-1'
					},
				]"
				:label="$t( 'membership_form_address_choice_title_addresstype_basic' )"
				:show-error="addressTypeIsInvalid"
				:error-message="$t( 'membership_form_section_address_error' )"
				v-model="addressTypeModel"
				alignment="column"
				:is-max-width-field="true"
			/>

			<MembershipApplicationNameFields
				:show-error="fieldErrors"
				:form-data="formData"
				:salutations="salutations"
				:address-type="addressTypeName"
				@field-changed="onFieldChange"
			/>

			<PostalAddressFields
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:country-was-restored="false"
				v-on:field-changed="onFieldChange"
			/>

			<EmailField
				:show-error="fieldErrors.email"
				v-model="formData.email.value"
				:is-max-width-field="true"
				@field-changed="onFieldChange"
			/>

		</AutofillHandler>

		<div class="switcher">
			<FormButton
				id="previous-btn"
				:is-outlined="true"
				@click="$emit( 'close' )"
			>
				{{ $t( 'membership_confirmation_address_update_cancel' ) }}
			</FormButton>
			<FormButton
				id="submit-btn"
				:is-loading="isValidating"
				button-type="submit"
			>
				{{ $t( 'membership_confirmation_address_update_confirm' ) }}
			</FormButton>
		</div>

		<ServerMessage :server-message="serverErrorMessage"/>

	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import type { AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { action } from '@src/store/util';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import type { Country } from '@src/view_models/Country';
import type { AddressValidation } from '@src/view_models/Validation';
import type { Salutation } from '@src/view_models/Salutation';
import { useStore } from 'vuex';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import { useMembershipAddressTypeFunctions } from '@src/components/shared/composables/useMembershipAddressTypeFunctions';
import ServerMessage from '@src/components/shared/ServerMessage.vue';
import { MembershipApplicantResource } from '@src/api/MembershipApplicantResource';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { UpdateMembershipApplicantRequest } from '@src/api/UpdateMembershipApplicantRequest';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import MembershipApplicationNameFields from '@src/components/shared/MembershipApplicationNameFields.vue';
import MembershipAddressUpdateFormErrorSummaries
	from '@src/components/pages/membership_confirmation/MembershipAddressUpdateFormErrorSummaries.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';

interface Props {
	addressValidationPatterns: AddressValidation;
	countries: Country[];
	membership: MembershipApplication;
	membershipApplicantResource: MembershipApplicantResource;
	salutations: Salutation[];
	validateAddressUrl: String;
	validateEmailUrl: String;
	updateToken: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'address-updated', 'close' ] );
const store = useStore();

const addressForm = ref<HTMLFormElement>( null );
const isValidating = ref<boolean>( false );
const serverErrorMessage = ref<string>( '' );
const showErrorSummary = ref<boolean>( false );

// TODO: Refactor useMembershipAddressTypeFunctions so it returns a model that it watches internally.
//       Currently it is not very reusable and doesn't integrate well with the new fields
const { addressType, addressTypeName, addressTypeIsInvalid, setAddressType } = useMembershipAddressTypeFunctions( store );

const formData: AddressFormData = {
	salutation: {
		name: 'salutation',
		value: store.state.address.values.salutation,
		pattern: props.addressValidationPatterns.salutation,
		optionalField: false,
	},
	title: {
		name: 'title',
		value: store.state.address.values.title,
		pattern: props.addressValidationPatterns.title,
		optionalField: true,
	},
	companyName: {
		name: 'companyName',
		value: store.state.address.values.companyName,
		pattern: props.addressValidationPatterns.companyName,
		optionalField: false,
	},
	firstName: {
		name: 'firstName',
		value: store.state.address.values.firstName,
		pattern: props.addressValidationPatterns.firstName,
		optionalField: false,
	},
	lastName: {
		name: 'lastName',
		value: store.state.address.values.lastName,
		pattern: props.addressValidationPatterns.lastName,
		optionalField: false,
	},
	street: {
		name: 'street',
		value: store.state.address.values.street,
		pattern: props.addressValidationPatterns.street,
		optionalField: false,
	},
	city: {
		name: 'city',
		value: store.state.address.values.city,
		pattern: props.addressValidationPatterns.city,
		optionalField: false,
	},
	postcode: {
		name: 'postcode',
		value: store.state.address.values.postcode,
		pattern: props.addressValidationPatterns.postcode,
		optionalField: false,
	},
	country: {
		name: 'country',
		value: store.state.address.values.country,
		pattern: props.addressValidationPatterns.country,
		optionalField: false,
	},
	email: {
		name: 'email',
		value: store.state.address.values.email,
		pattern: props.addressValidationPatterns.email,
		optionalField: false,
	},
};

const getAddressData = (): UpdateMembershipApplicantRequest => {
	return {
		membershipId: props.membership.id,
		updateToken: props.updateToken,
		addressType: addressTypeName.value,
		city: formData.city.value,
		companyName: formData.companyName.value,
		country: formData.country.value,
		email: formData.email.value,
		firstName: formData.firstName.value,
		lastName: formData.lastName.value,
		postcode: formData.postcode.value,
		salutation: formData.salutation.value,
		street: formData.street.value,
		title: formData.title.value,
	};
};

const fieldErrors = computed<AddressValidity>( () => {
	return Object.keys( formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
		if ( !formData[ fieldName ].optionalField ) {
			validity[ fieldName ] = store.state.address.validity[ fieldName ] === Validity.INVALID;
		}
		return validity;
	}, ( {} as AddressValidity ) );
} );

const addressTypeModel = ref<AddressTypeModel>( addressType.value );
watch( addressTypeModel, ( newAddressType: AddressTypeModel ) => setAddressType( newAddressType ) );

const isActiveMembership = computed<boolean>( () => props.membership.membershipType === 'active' );

const disallowedAddressTypes = computed<AddressTypeModel[]>( () =>
	isActiveMembership.value
		? [ AddressTypeModel.UNSET, AddressTypeModel.COMPANY ]
		: [ AddressTypeModel.UNSET ]
);

const validateForm = async (): Promise<ValidationResult> => {
	const results = await Promise.all( [
		store.dispatch( action( 'address', 'validateAddressType' ), {
			type: store.state.address.addressType,
			disallowed: disallowedAddressTypes.value,
		} ),
		store.dispatch( action( 'address', 'validateAddress' ), props.validateAddressUrl ),
		store.dispatch( action( 'address', 'validateEmail' ), props.validateEmailUrl ),
	] );
	return mergeValidationResults( results );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( 'address', 'setAndValidateAddressField' ), formData[ fieldName ] );
};

const onAutofill = ( autofilledFields: { [key: string]: string } ) => {
	Object.keys( autofilledFields ).forEach( key => {
		const fieldName = camelizeName( key );
		if ( formData[ fieldName ] ) {
			store.dispatch( action( 'address', 'setAndValidateAddressField' ), formData[ fieldName ] );
		}
	} );
};

const submit = async (): Promise<void> => {
	isValidating.value = true;
	serverErrorMessage.value = '';
	showErrorSummary.value = false;

	const validationResult = await validateForm();

	if ( validationResult.status !== 'OK' ) {
		isValidating.value = false;
		showErrorSummary.value = true;
		return;
	}

	trackFormSubmission( addressForm.value );

	props.membershipApplicantResource.put( getAddressData() ).then( ( addressData: MembershipAddress ) => {
		isValidating.value = false;
		emit( 'address-updated', { addressData, addressType: addressData.applicantType } );
	} ).catch( ( error: string ) => {
		isValidating.value = false;
		serverErrorMessage.value = error;
	} );
};

store.watch( ( state, getters ) => getters[ 'address/addressTypeIsInvalid' ], ( isInvalid: boolean ) => {
	if ( showErrorSummary.value && !isInvalid ) {
		showErrorSummary.value = false;
	}
} );

store.watch( ( state, getters ) => getters[ 'address/requiredFieldsAreValid' ], ( isValid: boolean ) => {
	if ( showErrorSummary.value && isValid ) {
		showErrorSummary.value = false;
	}
} );

onMounted( () => {
	if ( isActiveMembership.value && addressType.value !== AddressTypeModel.PERSON ) {
		setAddressType( AddressTypeModel.PERSON );
		addressTypeModel.value = AddressTypeModel.PERSON;
	}
	trackDynamicForm();

	Object.entries( formData ).forEach( ( formItem ) => {
		const key: string = formItem[ 0 ];
		if ( formData[ key ].value !== '' ) {
			store.dispatch( action( 'address', 'validateAddressField' ), formData[ key ] );
		}
	} );
} );

</script>
