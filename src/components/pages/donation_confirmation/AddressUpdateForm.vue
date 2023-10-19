<template>
	<form id="address-update-form" name="address-update-form" v-on:submit.prevent="submit" method="post" ref="addressForm">
		<div v-if="hasErrored" class="help is-danger has-margin-top-18">
			{{ $t( 'donation_confirmation_address_update_error' ) }}
		</div>
		<div v-if="hasSucceeded" class="has-margin-top-18">
			{{ $t( 'donation_confirmation_address_update_success' ) }}
		</div>
		<div v-if="!hasErrored && !hasSucceeded">
			<AutofillHandler v-on:autofill="onAutofill">
				<address-type-full v-on:address-type="updateAddressType( $event )" :initial-address-type="addressTypeString"/>
				<span v-if="addressTypeIsInvalid" class="help is-danger error-address-type">{{ $t( 'donation_form_section_address_error' ) }}</span>
				<name :show-error="fieldErrors" :form-data="formData" :address-type="addressType" :salutations="salutations" v-on:field-changed="onFieldChange"/>
				<postal :show-error="fieldErrors" :form-data="formData" :countries="countries" v-on:field-changed="onFieldChange"/>
				<EmailAddress :show-error="fieldErrors.email" :form-data="formData" v-on:field-changed="onFieldChange" :common-mail-providers="mailHostList" />
			</AutofillHandler>
			<NewsletterOption
				:checked-by-default="store.state.address.newsletter"
				@value-changed="updateNewsletterOption"
			/>
			<div class="columns has-margin-top-18 has-padding-bottom-18">
				<div class="column">
					<FunButton
						class="is-primary is-main is-outlined has-margin-top-18 level-item"
						@click="$emit( 'close' )"
					>
						{{ $t( 'donation_confirmation_address_update_cancel' ) }}
					</FunButton>
				</div>
				<div class="column">
					<FunButton
						:class="[ 'is-primary is-main has-margin-top-18 level-item modal-submit', { 'is-loading': isValidating } ]"
						button-type="submit"
					>
						{{ $t( 'donation_confirmation_address_update_confirm' ) }}
					</FunButton>
				</div>
			</div>
			<div v-if="serverMessage !== ''" class="columns error-server">
				<div class="column has-text-danger has-text-centered has-text-weight-bold">
					{{ $t( serverMessage ) }}
				</div>
			</div>
		</div>
		<div v-else class="columns has-margin-top-18 has-padding-bottom-18">
			<div class="column">
				<FunButton
					class="is-primary is-main is-outlined has-margin-top-18"
					@click="$emit( 'close' )"
				>
					{{ $t( 'back_to_donation_summary' ) }}
				</FunButton>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AddressTypeFull from '@src/components/pages/donation_confirmation/AddressTypeFull.vue';
import Name from '@src/components/shared/Name.vue';
import Postal from '@src/components/shared/Postal.vue';
import EmailAddress from '@src/components/shared/EmailAddress.vue';
import NewsletterOption from '@src/components/pages/donation_form/NewsletterOption.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import { Address, AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { NS_ADDRESS } from '@src/store/namespaces';
import {
	setAddressField,
	setAddressType,
	setNewsletterChoice,
	validateAddress,
	validateAddressField,
	validateAddressType,
	validateEmail,
} from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import DonorResource from '@src/api/DonorResource';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import { useStore } from 'vuex';
import { Donation } from '@src/view_models/Donation';

interface Props {
	donation: Donation;
	validateEmailUrl: String;
	validateAddressUrl: String;
	countries: Country[];
	salutations: Salutation[];
	hasErrored: Boolean;
	hasSucceeded: Boolean;
	addressValidationPatterns: AddressValidation;
	donorResource: DonorResource;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'address-updated', 'address-update-failed' ] );
const store = useStore();
const mailHostList = useMailHostList();

const addressForm = ref<HTMLFormElement>( null );
const isValidating = ref<boolean>( false );
const serverMessage = ref<string>( '' );
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

const fieldErrors = computed<AddressValidity>( () => {
	return Object.keys( formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
		if ( !formData[ fieldName ].optionalField ) {
			validity[ fieldName ] = store.state.address.validity[ fieldName ] === Validity.INVALID;
		}
		return validity;
	}, ( {} as AddressValidity ) );
} );

const addressType = computed( () => store.state.address.addressType );
// TODO: use the model value directly rather than convert it to a string
const addressTypeString = computed<string>( () => {
	switch ( store.state.address.addressType ) {
		case AddressTypeModel.COMPANY:
			return 'company';
		case AddressTypeModel.PERSON:
			return 'person';
		default:
			return 'unset';
	}
} );
const addressTypeIsInvalid = computed<boolean>( () => store.getters[ NS_ADDRESS + '/addressTypeIsInvalid' ] );

const validateForm = async (): Promise<ValidationResult> => {
	let response = await store.dispatch( action( NS_ADDRESS, validateAddressType ), {
		type: store.state.address.addressType,
		disallowed: [ AddressTypeModel.UNSET, AddressTypeModel.ANON ],
	} );
	if ( response.status !== 'OK' ) {
		return Promise.resolve( response );
	}
	let results = await Promise.all( [
		store.dispatch( action( NS_ADDRESS, validateAddress ), props.validateAddressUrl ),
		store.dispatch( action( NS_ADDRESS, validateEmail ), props.validateEmailUrl ),
	] );
	return mergeValidationResults( results );
};

const onFieldChange = ( fieldName: string ): void => {
	store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
};

const onAutofill = ( autofilledFields: { [key: string]: string; } ) => {
	Object.keys( autofilledFields ).forEach( key => {
		const fieldName = camelizeName( key );
		if ( formData[ fieldName ] ) {
			store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
		}
	} );
};

const updateAddressType = ( newAddressType: AddressTypeModel ): void => {
	store.dispatch( action( NS_ADDRESS, setAddressType ), newAddressType );
};

const getAddressData = (): Address => {
	const data = {
		updateToken: props.donation.updateToken,
		donationId: props.donation.id,
		addressType: addressTypeName( store.getters[ NS_ADDRESS + '/addressType' ] ),
	} as any;
	Object.keys( formData ).forEach( fieldName => {
		data[ fieldName ] = formData[ fieldName ].value;
	} );
	return data as Address;
};

const submit = async (): Promise<void> => {
	isValidating.value = true;
	serverMessage.value = '';

	const validationResult = await validateForm();

	if ( validationResult.status !== 'OK' ) {
		isValidating.value = false;
		return;
	}

	trackFormSubmission( addressForm.value );

	props.donorResource.put( getAddressData() ).then( ( addressData: Address ) => {
		isValidating.value = false;
		emit( 'address-updated', { addressData, addressType: addressData.addressType } );
	} ).catch( ( error: string ) => {
		emit( 'address-update-failed' );
		isValidating.value = false;
		serverMessage.value = error;
	} );
};

const updateNewsletterOption = ( wantsNewsletter: boolean ): void => {
	store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), wantsNewsletter );
};

onMounted( () => {
	trackDynamicForm();

	Object.entries( formData ).forEach( ( formItem ) => {
		const key: string = formItem[ 0 ];
		if ( formData[ key ].value !== '' ) {
			store.dispatch( action( NS_ADDRESS, validateAddressField ), formData[ key ] );
		}
	} );
} );

</script>
