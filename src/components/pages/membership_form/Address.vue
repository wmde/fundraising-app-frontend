<template>
	<div class="address-section">
		<div class="has-margin-top-36">
			<address-type :initial-value="addressType" v-on:address-type="setAddressType( $event )"/>
		</div>
		<h1 class="has-margin-top-36 title is-size-5">{{ $t( 'donation_form_section_address_title' ) }}</h1>
		<AutofillHandler @autofill="onAutofill">
			<name :show-error="fieldErrors" :form-data="formData" :address-type="addressType" :salutations="salutations" v-on:field-changed="onFieldChange"/>
			<postal
					:show-error="fieldErrors"
					:form-data="formData"
					:countries="countries"
					:post-code-validation="addressValidationPatterns.postcode"
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
			<email
				:show-error="fieldErrors.email"
				:form-data="formData"
				v-on:field-changed="onFieldChange"
				:common-mail-providers="mailHostList" />
		</AutofillHandler>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import AddressType from '@/components/pages/membership_form/AddressType.vue';
import Name from '@/components/shared/Name.vue';
import Postal from '@/components/shared/Postal.vue';
import DateOfBirth from '@/components/pages/membership_form/DateOfBirth.vue';
import ReceiptOption from '@/components/shared/ReceiptOption.vue';
import Incentives from '@/components/pages/membership_form/Incentives.vue';
import Email from '@/components/shared/Email.vue';
import AutofillHandler from '@/components/shared/AutofillHandler.vue';
import { AddressValidity, AddressFormData, ValidationResult } from '@/view_models/Address';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { AddressValidation } from '@/view_models/Validation';
import { Validity } from '@/view_models/Validity';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@/store/namespaces';
import {
	setAddressField,
	validateAddress,
	validateEmail,
	setReceiptChoice,
	setIncentives,
	setAddressType,
	validateCountry,
	validateAddressField,
	validateDateOfBirth,
} from '@/store/membership_address/actionTypes';
import { validateFee } from '@/store/membership_fee/actionTypes';
import { action } from '@/store/util';
import { mergeValidationResults } from '@/merge_validation_results';
import { camelizeName } from '@/camlize_name';
import { Salutation } from '@/view_models/Salutation';
import { useMailHostList } from '@/components/shared/useMailHostList';

export default Vue.extend( {
	name: 'Address',
	components: {
		Name,
		Postal,
		DateOfBirth,
		ReceiptOption,
		Incentives,
		AddressType,
		Email,
		AutofillHandler,
	},
	data: function (): { formData: AddressFormData } {
		return {
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
		validateFeeUrl: String,
		countries: Array as () => Array<String>,
		salutations: Array as () => Array<Salutation>,
		initialFormValues: [ Object, String ],
		addressValidationPatterns: Object as () => AddressValidation,
		dateOfBirthValidationPattern: String,
	},
	setup() {
		const { mailHostList } = useMailHostList();
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
			'addressType',
			'email',
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
		setAddressType( addressType: AddressTypeModel ): void {
			this.$store.dispatch( action( NS_MEMBERSHIP_ADDRESS, setAddressType ), addressType ).then( () => {
				// Re-validate fee when address type changes, to apply server-side rules on minimum amounts
				const payload = {
					feeValue: this.$store.state[ NS_MEMBERSHIP_FEE ].values.fee,
					validateFeeUrl: this.$props.validateFeeUrl,
				};
				this.$store.dispatch( action( NS_MEMBERSHIP_FEE, validateFee ), payload );
			} );
		},
	},
} );
</script>
