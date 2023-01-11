<template>
	<form id="address-update-form" name="address-update-form" v-on:submit.prevent="submit" method="post" ref="addressForm" class="modal-card">
		<div v-if="hasErrored" class="help is-danger has-margin-top-18">
			{{ $t( 'donation_confirmation_address_update_error' ) }}
		</div>
		<div v-if="hasSucceeded" class="has-margin-top-18">
			{{ $t( 'donation_confirmation_address_update_success' ) }}
		</div>
		<div v-if="!hasErrored && !hasSucceeded">
			<AutofillHandler v-on:autofill="onAutofill">
				<address-type-full v-on:address-type="setAddressType( $event )" :initial-address-type="addressTypeString"/>
				<name :show-error="fieldErrors" :form-data="formData" :address-type="addressType" :salutations="salutations" v-on:field-changed="onFieldChange"/>
				<postal :show-error="fieldErrors" :form-data="formData" :countries="countries" v-on:field-changed="onFieldChange"/>
				<email :show-error="fieldErrors.email" :form-data="formData" v-on:field-changed="onFieldChange" :common-mail-providers="mailHostList" />
			</AutofillHandler>
			<newsletter-option/>
			<div class="columns has-margin-top-18 has-padding-bottom-18">
				<div class="column">
					<b-button type="is-primary is-main has-margin-top-18 level-item" @click="$parent.close()" outlined>
						{{ $t( 'donation_confirmation_address_update_cancel' ) }}
					</b-button>
				</div>
				<div class="column">
					<b-button type="is-primary is-main has-margin-top-18 level-item"
								:class="isValidating ? 'is-loading' : ''"
								native-type="submit">
						{{ $t( 'donation_confirmation_address_update_confirm' ) }}
					</b-button>
				</div>
			</div>
			<div v-if="serverMessage !== ''" class="columns">
				<div class="column has-text-danger has-text-centered has-text-weight-bold">
					{{ $t( serverMessage ) }}
				</div>
			</div>
		</div>
		<div v-else class="columns has-margin-top-18 has-padding-bottom-18">
			<div class="column">
				<b-button type="is-primary is-main has-margin-top-18" @click="$parent.close()" outlined>
					{{ $t( 'back_to_donation_summary' ) }}
				</b-button>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import Vue from 'vue';
import AddressTypeFull from '@/components/pages/donation_confirmation/AddressTypeFull.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import ReceiptOption from '@/components/shared/ReceiptOption.vue';
import Email from '@/components/shared/Email.vue';
import NewsletterOption from '@/components/pages/donation_form/NewsletterOption.vue';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import { AddressValidity, AddressFormData, ValidationResult, Address } from '@/view_models/Address';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';
import { Validity } from '@/view_models/Validity';
import { NS_ADDRESS } from '@/store/namespaces';
import { setAddressField, validateAddress, validateEmail, setAddressType, validateAddressField } from '@/store/address/actionTypes';
import { action } from '@/store/util';
import PaymentBankData from '@/components/shared/PaymentBankData.vue';
import SubmitValues from '@/components/pages/update_address/SubmitValues.vue';
import axios, { AxiosResponse } from 'axios';
import { trackDynamicForm, trackFormSubmission } from '@/tracking';
import { mergeValidationResults } from '@/merge_validation_results';
import { camelizeName } from '@/camlize_name';
import { Country } from '@/view_models/Country';
import { AddressValidation } from '@/view_models/Validation';
import { Salutation } from '@/view_models/Salutation';
import { useMailHostList } from '@/components/shared/useMailHostList';

export default Vue.extend( {
	name: 'AddressModal',
	components: {
		Name,
		Postal,
		AddressTypeFull,
		ReceiptOption,
		Email,
		NewsletterOption,
		PaymentBankData,
		SubmitValues,
		AutofillHandler,
	},
	setup() {
		const { mailHostList } = useMailHostList();
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
		updateDonorUrl: String,
		validateEmailUrl: String,
		validateAddressUrl: String,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
		hasErrored: Boolean,
		hasSucceeded: Boolean,
		addressValidationPatterns: Object as () => AddressValidation,
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
					return 'anon';
			}
		},
	},
	methods: {
		validateForm(): Promise<ValidationResult> {
			return Promise.all( [
				this.$store.dispatch( action( NS_ADDRESS, validateAddress ), this.$props.validateAddressUrl ),
				this.$store.dispatch( action( NS_ADDRESS, validateEmail ), this.$props.validateEmailUrl ),
			] ).then( mergeValidationResults );
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
		submit() {
			this.$data.isValidating = true;
			this.$data.serverMessage = '';
			this.validateForm().then( ( validationResult: ValidationResult ) => {
				if ( validationResult.status !== 'OK' ) {
					this.$data.isValidating = false;
					return;
				}
				let form = this.$refs.addressForm as HTMLFormElement;
				trackFormSubmission( form );

				const data = {} as any;
				Object.keys( this.$data.formData ).forEach( fieldName => {
					data[ fieldName ] = this.$data.formData[ fieldName ].value;
				} );
				data.updateToken = this.$props.donation.updateToken;
				data.donationId = this.$props.donation.id;
				data.addressType = addressTypeName( this.$store.getters[ NS_ADDRESS + '/addressType' ] );
				axios.put(
					this.$props.updateDonorUrl,
					data,
					{ headers: { 'Content-Type': 'application/json' } }
				).then( ( response: AxiosResponse<Address> ) => {
					this.$data.isValidating = false;
					let addressData = {
						street: response.data.street,
						postcode: response.data.postcode,
						city: response.data.city,
						country: response.data.country,
						email: response.data.email,
						salutation: response.data.salutation,
						firstName: response.data.firstName,
						lastName: response.data.lastName,
						fullName: response.data.fullName,
					} as Address;
					this.$emit( 'address-updated', {
						addressData,
						addressType: response.data.addressType,
					} );
				} ).catch( ( error: any ) => {
					this.$emit( 'address-update-failed' );
					this.$data.isValidating = false;
					this.$data.serverMessage = error.response.data.errors[ 0 ];
				} );
			} );
		},
	},
} );
</script>
