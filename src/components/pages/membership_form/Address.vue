<template>
	<div class="address-section">
		<h1 class="has-margin-top-36 title is-size-5">{{ $t( 'membership_form_section_address_title' ) }}</h1>
		<AutofillHandler @autofill="onAutofill">
			<name :show-error="fieldErrors" :form-data="formData" :address-type="addressType" :salutations="salutations" v-on:field-changed="onFieldChange"/>
			<postal
				:show-error="fieldErrors"
				:form-data="formData"
				:countries="countries"
				:post-code-validation="addressValidationPatterns.postcode"
				:country-was-restored="countryWasRestored"
				v-on:field-changed="onFieldChange"
			/>
			<receipt-option
				:message="$t( 'receipt_needed_membership_page' )"
				:initial-receipt-needed="receiptNeeded"
				v-on:receipt-changed="setReceipt( $event )"
			/>
			<incentives
				:message="$t( 'membership_form_incentive' )"
				:incentive-choices="[ 'tote_bag' ]"
				:default-incentives="incentives"
				v-on:incentives-changed="setIncentives( $event )"
			/>
			<date-of-birth
				v-if="isPerson"
				v-on:field-changed="onFieldChange"
				:show-error="fieldErrors.date"
				:form-data="formData"/>
			<EmailAddress
				:show-error="fieldErrors.email"
				:form-data="formData"
				v-on:field-changed="onFieldChange"
				:common-mail-providers="mailHostList" />
		</AutofillHandler>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Name from '@src/components/shared/Name.vue';
import Postal from '@src/components/shared/Postal.vue';
import DateOfBirth from '@src/components/pages/membership_form/DateOfBirth.vue';
import ReceiptOption from '@src/components/shared/ReceiptOption.vue';
import Incentives from '@src/components/pages/membership_form/Incentives.vue';
import EmailAddress from '@src/components/shared/EmailAddress.vue';
import AutofillHandler from '@src/components/shared/AutofillHandler.vue';
import { AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { AddressValidation } from '@src/view_models/Validation';
import { Validity } from '@src/view_models/Validity';
import { NS_MEMBERSHIP_ADDRESS } from '@src/store/namespaces';
import {
	setAddressField,
	setIncentives,
	setReceiptChoice,
	validateAddress,
	validateAddressField,
	validateCountry,
	validateDateOfBirth,
	validateEmail,
} from '@src/store/membership_address/actionTypes';
import { action } from '@src/store/util';
import { mergeValidationResults } from '@src/util/merge_validation_results';
import { camelizeName } from '@src/util/camlize_name';
import { Salutation } from '@src/view_models/Salutation';
import { useMailHostList } from '@src/components/shared/useMailHostList';

export default defineComponent( {
	name: 'Address',
	components: {
		Name,
		Postal,
		DateOfBirth,
		ReceiptOption,
		Incentives,
		EmailAddress,
		AutofillHandler,
	},
	data: function (): { countryWasRestored: boolean, formData: AddressFormData } {
		return {
			countryWasRestored: false,
			formData: {
				salutation: {
					name: 'salutation',
					value: '',
					pattern: this.$props.addressValidationPatterns.salutation,
					optionalField: false,
				},
				title: {
					name: 'title',
					value: '',
					pattern: this.$props.addressValidationPatterns.title,
					optionalField: true,
				},
				companyName: {
					name: 'companyName',
					value: '',
					pattern: this.$props.addressValidationPatterns.companyName,
					optionalField: false,
				},
				firstName: {
					name: 'firstName',
					value: '',
					pattern: this.$props.addressValidationPatterns.firstName,
					optionalField: false,
				},
				lastName: {
					name: 'lastName',
					value: '',
					pattern: this.$props.addressValidationPatterns.lastName,
					optionalField: false,
				},
				street: {
					name: 'street',
					value: '',
					pattern: this.$props.addressValidationPatterns.street,
					optionalField: false,
				},
				city: {
					name: 'city',
					value: '',
					pattern: this.$props.addressValidationPatterns.city,
					optionalField: false,
				},
				postcode: {
					name: 'postcode',
					value: '',
					pattern: this.$props.addressValidationPatterns.postcode,
					optionalField: false,
				},
				country: {
					name: 'country',
					value: 'DE',
					pattern: this.$props.addressValidationPatterns.country,
					optionalField: false,
				},
				email: {
					name: 'email',
					value: '',
					pattern: this.$props.addressValidationPatterns.email,
					optionalField: false,
				},
				date: {
					name: 'date',
					value: '',
					pattern: this.$props.dateOfBirthValidationPattern,
					optionalField: true,
				},
			},
		};
	},
	props: {
		validateAddressUrl: String,
		validateEmailUrl: String,
		countries: Array as () => Array<String>,
		salutations: Array as () => Array<Salutation>,
		initialFormValues: [ Object, String ],
		addressValidationPatterns: Object as () => AddressValidation,
		dateOfBirthValidationPattern: String,
	},
	setup() {
		const mailHostList = useMailHostList();
		return { mailHostList };
	},
	// TODO move computed and state into composition-api's setup() method
	computed: {
		fieldErrors: {
			get: function (): AddressValidity {
				const validityResult = Object.keys( this.formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
					if ( !this.formData[ fieldName ].optionalField ) {
						validity[ fieldName ] = this.$store.state.membership_address.validity[ fieldName ] === Validity.INVALID;
					}
					return validity;
				}, ( {} as AddressValidity ) );
				validityResult.date = this.$store.state.membership_address.validity.date === Validity.INVALID;
				return validityResult;
			},
		},
		...mapGetters( NS_MEMBERSHIP_ADDRESS, [
			'email',
			'addressType',
			'isPerson',
		] ),
		receiptNeeded(): Boolean {
			return this.$store.state[ NS_MEMBERSHIP_ADDRESS ].receipt;
		},
		incentives(): String[] {
			return this.$store.state[ NS_MEMBERSHIP_ADDRESS ].incentives;
		},
	},
	beforeMount() {
		this.$data.countryWasRestored = this.$store.state[ NS_MEMBERSHIP_ADDRESS ].validity.country === Validity.RESTORED;
		Object.entries( this.$store.state[ NS_MEMBERSHIP_ADDRESS ].values ).forEach( ( entry ) => {
			const name: string = entry[ 0 ];
			const value: string = entry[ 1 ] as string;
			if ( !this.formData[ name ] ) {
				return;
			}
			this.formData[ name ].value = value;

			if ( this.$store.state[ NS_MEMBERSHIP_ADDRESS ].validity[ name ] === Validity.RESTORED ) {
				this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateAddressField ), this.$data.formData[ name ] );
			}
		} );
	},
	methods: {
		async validateForm(): Promise<ValidationResult> {
			await this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateCountry ), {
				country: this.$data.formData.country,
				postcode: this.$data.formData.postcode,
			} );
			return Promise.all( [
				this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateAddress ), this.$props.validateAddressUrl ),
				this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateEmail ), this.$props.validateEmailUrl ),
				this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, validateDateOfBirth ) ),
			] ).then( mergeValidationResults );

		},
		onFieldChange( fieldName: string ): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
		},
		onAutofill( autofilledFields: { [key: string]: string; } ) {
			Object.keys( autofilledFields ).forEach( key => {
				const fieldName = camelizeName( key );
				if ( this.$data.formData[ fieldName ] ) {
					this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
				}
			} );
		},
		setReceipt( choice: boolean ): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setReceiptChoice ), choice );
		},
		setIncentives( incentives: string[] ): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setIncentives ), incentives );
		},
	},
} );
</script>
