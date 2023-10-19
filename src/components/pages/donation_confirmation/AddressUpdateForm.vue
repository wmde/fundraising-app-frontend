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
				<address-type-full v-on:address-type="setAddressType( $event )" :initial-address-type="addressTypeString"/>
				<span v-if="addressTypeIsInvalid" class="help is-danger error-address-type">{{ $t( 'donation_form_section_address_error' ) }}</span>
				<name :show-error="fieldErrors" :form-data="formData" :address-type="addressType" :salutations="salutations" v-on:field-changed="onFieldChange"/>
				<postal :show-error="fieldErrors" :form-data="formData" :countries="countries" v-on:field-changed="onFieldChange"/>
				<EmailAddress :show-error="fieldErrors.email" :form-data="formData" v-on:field-changed="onFieldChange" :common-mail-providers="mailHostList" />
			</AutofillHandler>
			<NewsletterOption
				:checked-by-default="$store.state.address.newsletter"
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

<script lang="ts">
import { defineComponent } from 'vue';
import AddressTypeFull from '@src/components/pages/donation_confirmation/AddressTypeFull.vue';
import Name from '@src/components/shared/Name.vue';
import Postal from '@src/components/shared/Postal.vue';
import ReceiptOption from '@src/components/shared/ReceiptOption.vue';
import EmailAddress from '@src/components/shared/EmailAddress.vue';
import NewsletterOption from '@src/components/pages/donation_form/NewsletterOption.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import { Address, AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { NS_ADDRESS } from '@src/store/namespaces';
import {
	setAddressField,
	setAddressType, setNewsletterChoice,
	validateAddress,
	validateAddressField,
	validateAddressType,
	validateEmail,
} from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import SubmitValues from '@src/components/pages/update_address/SubmitValues.vue';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';
import { Salutation } from '@src/view_models/Salutation';
import { useMailHostList } from '@src/components/shared/useMailHostList';
import DonorResource from '@src/api/DonorResource';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';

export default defineComponent( {
	name: 'AddressUpdateForm',
	components: {
		FunButton,
		Name,
		Postal,
		AddressTypeFull,
		ReceiptOption,
		EmailAddress,
		NewsletterOption,
		PaymentBankData,
		SubmitValues,
		AutofillHandler,
	},
	setup() {
		const mailHostList = useMailHostList();
		return { mailHostList };
	},
	// TODO move computed etc into composition-api's setup() method
	data: function (): { formData: AddressFormData, isValidating: boolean, serverMessage: string } {
		return {
			isValidating: false,
			serverMessage: '',
			formData: {
				salutation: {
					name: 'salutation',
					value: this.$store.state.address.values.salutation,
					pattern: this.$props.addressValidationPatterns.salutation,
					optionalField: false,
				},
				title: {
					name: 'title',
					value: this.$store.state.address.values.title,
					pattern: this.$props.addressValidationPatterns.title,
					optionalField: true,
				},
				companyName: {
					name: 'companyName',
					value: this.$store.state.address.values.companyName,
					pattern: this.$props.addressValidationPatterns.companyName,
					optionalField: false,
				},
				firstName: {
					name: 'firstName',
					value: this.$store.state.address.values.firstName,
					pattern: this.$props.addressValidationPatterns.firstName,
					optionalField: false,
				},
				lastName: {
					name: 'lastName',
					value: this.$store.state.address.values.lastName,
					pattern: this.$props.addressValidationPatterns.lastName,
					optionalField: false,
				},
				street: {
					name: 'street',
					value: this.$store.state.address.values.street,
					pattern: this.$props.addressValidationPatterns.street,
					optionalField: false,
				},
				city: {
					name: 'city',
					value: this.$store.state.address.values.city,
					pattern: this.$props.addressValidationPatterns.city,
					optionalField: false,
				},
				postcode: {
					name: 'postcode',
					value: this.$store.state.address.values.postcode,
					pattern: this.$props.addressValidationPatterns.postcode,
					optionalField: false,
				},
				country: {
					name: 'country',
					value: this.$store.state.address.values.country,
					pattern: this.$props.addressValidationPatterns.country,
					optionalField: false,
				},
				email: {
					name: 'email',
					value: this.$store.state.address.values.email,
					pattern: this.$props.addressValidationPatterns.email,
					optionalField: false,
				},
			},
		};
	},
	mounted: function () {
		trackDynamicForm();

		Object.entries( this.$data.formData ).forEach( ( formItem ) => {
			const key: string = formItem[ 0 ];
			if ( this.$data.formData[ key ].value !== '' ) {
				this.$store.dispatch( action( NS_ADDRESS, validateAddressField ), this.$data.formData[ key ] );
			}
		} );
	},
	props: {
		donation: Object,
		validateEmailUrl: String,
		validateAddressUrl: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		hasErrored: Boolean,
		hasSucceeded: Boolean,
		addressValidationPatterns: Object as () => AddressValidation,
		donorResource: Object as () => DonorResource,
	},
	computed: {
		fieldErrors: {
			get: function (): AddressValidity {
				return Object.keys( this.formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
					if ( !this.formData[ fieldName ].optionalField ) {
						validity[ fieldName ] = this.$store.state.address.validity[ fieldName ] === Validity.INVALID;
					}
					return validity;
				}, ( {} as AddressValidity ) );
			},
		},
		addressType: function () {
			return this.$store.state.address.addressType;
		},
		addressTypeString: function () {
			switch ( this.$store.state.address.addressType ) {
				case AddressTypeModel.COMPANY:
					return 'company';
				case AddressTypeModel.PERSON:
					return 'person';
				default:
					return 'unset';
			}
		},
		addressTypeIsInvalid: function () {
			return this.$store.getters[ NS_ADDRESS + '/addressTypeIsInvalid' ];
		},
	},
	methods: {
		validateForm(): Promise<ValidationResult> {
			return this.$store.dispatch( action( NS_ADDRESS, validateAddressType ), {
				type: this.$store.state.address.addressType,
				disallowed: [ AddressTypeModel.UNSET, AddressTypeModel.ANON ],
			} ).then( ( response: ValidationResult ) => {
				if ( response.status !== 'OK' ) {
					return Promise.resolve( response );
				}
				return Promise.all( [
					this.$store.dispatch( action( NS_ADDRESS, validateAddress ), this.$props.validateAddressUrl ),
					this.$store.dispatch( action( NS_ADDRESS, validateEmail ), this.$props.validateEmailUrl ),
				] ).then( mergeValidationResults );
			} );
		},
		onFieldChange( fieldName: string ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
		},
		onAutofill( autofilledFields: { [key: string]: string; } ) {
			Object.keys( autofilledFields ).forEach( key => {
				const fieldName = camelizeName( key );
				if ( this.$data.formData[ fieldName ] ) {
					this.$store.dispatch( action( NS_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
				}
			} );
		},
		setAddressType( addressType: AddressTypeModel ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressType ), addressType );
		},
		submit(): void {
			this.$data.isValidating = true;
			this.$data.serverMessage = '';
			this.validateForm().then( ( validationResult: ValidationResult ) => {
				if ( validationResult.status !== 'OK' ) {
					this.$data.isValidating = false;
					return;
				}
				let form = this.$refs.addressForm as HTMLFormElement;
				trackFormSubmission( form );

				this.$props.donorResource.put( this.getAddressData() ).then( ( addressData: Address ) => {
					this.$data.isValidating = false;
					this.$emit( 'address-updated', { addressData, addressType: addressData.addressType } );
				} ).catch( ( error: string ) => {
					this.$emit( 'address-update-failed' );
					this.$data.isValidating = false;
					this.$data.serverMessage = error;
				} );
			} );
		},
		getAddressData(): Address {
			const data = {
				updateToken: this.$props.donation.updateToken,
				donationId: this.$props.donation.id,
				addressType: addressTypeName( this.$store.getters[ NS_ADDRESS + '/addressType' ] ),
			} as any;
			Object.keys( this.$data.formData ).forEach( fieldName => {
				data[ fieldName ] = this.$data.formData[ fieldName ].value;
			} );
			return data as Address;
		},
		updateNewsletterOption( wantsNewsletter: boolean ): void {
			this.$store.dispatch( action( NS_ADDRESS, setNewsletterChoice ), wantsNewsletter );
		},
	},
} );
</script>
