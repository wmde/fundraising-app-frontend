<template>
	<div class="address-update-form">
		<form name="laika-address-update" ref="form" :action="updateAddressURL" method="post">
			<h1 class="title is-size-1">{{ $t( 'address_change_form_title' ) }}</h1>
			<legend class="title is-size-6">{{ $t( 'address_change_form_label' ) }}</legend>
			<div>
				<receipt-option :message="$t( 'receipt_needed_donation_page' )" v-on:receipt-changed="setReceipt( $event )"/>
				<div> {{ $t( 'address_change_opt_out_hint') }}</div>
				<name :show-error="fieldErrors"
						:form-data="formData"
						:address-type="addressType"
						:salutations="salutations"
						v-on:field-changed="onFieldChange">
				</name>
				<postal :show-error="fieldErrors"
						:form-data="formData"
						:countries="countries"
						:post-code-validation="addressValidationPatterns.postcode"
						v-on:field-changed="onFieldChange">
				</postal>
				<submit-values :tracking-data="{}"></submit-values>
			</div>
			<div class="level has-margin-top-36">
				<div class="level-right">
					<FunButton
						id="next"
						:class="[ 'is-form-input-width is-primary is-main level-item', { 'is-loading': $store.getters.isValidating } ]"
						@click.prevent="submit()"
					>
						{{ $t( 'address_change_form_submit' ) }}
					</FunButton>
				</div>
			</div>
		</form>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Name from '@src/components/shared/Name.vue';
import Postal from '@src/components/shared/Postal.vue';
import ReceiptOption from '@src/components/shared/ReceiptOption.vue';
import SubmitValues from '@src/components/pages/update_address/SubmitValues.vue';
import { AddressFormData, AddressValidity, ValidationResult } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { Country } from '@src/view_models/Country';
import { NS_ADDRESS } from '@src/store/namespaces';
import { setAddressField, setAddressType, setReceiptChoice, validateAddress } from '@src/store/address/actionTypes';
import { action } from '@src/store/util';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { AddressValidation } from '@src/view_models/Validation';
import { mapGetters } from 'vuex';
import { trackFormSubmission } from '@src/tracking';
import { Salutation } from '@src/view_models/Salutation';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';

export default defineComponent( {
	name: 'UpdateAddress',
	components: {
		FunButton,
		Name,
		Postal,
		ReceiptOption,
		SubmitValues,
	},
	beforeMount() {
		this.setAddressType( this.isCompany ? AddressTypeModel.COMPANY : AddressTypeModel.PERSON );
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
			},
		};
	},
	props: {
		validateAddressUrl: String,
		updateAddressURL: String,
		isCompany: Boolean,
		countries: Array as () => Array<Country>,
		salutations: Array as () => Array<Salutation>,
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
		...mapGetters( NS_ADDRESS, [
			'addressType',
		] ),
		addressTypeString: {
			get: function (): string {
				return addressTypeName( ( this as any ).addressType );
			},
		},
		userOnlyWantsToDeclineReceipt: {
			get: function (): boolean {
				return !this.$store.state.address.receipt && this.$store.getters[ NS_ADDRESS + '/allRequiredFieldsEmpty' ];
			},
		},
	},
	methods: {
		validateForm(): Promise<ValidationResult> {
			return this.$store.dispatch( action( NS_ADDRESS, validateAddress ), this.$props.validateAddressUrl );
		},
		onFieldChange( fieldName: string ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressField ), this.$data.formData[ fieldName ] );
		},
		setReceipt( choice: boolean ): void {
			this.$store.dispatch( action( NS_ADDRESS, setReceiptChoice ), choice );
		},
		setAddressType( addressType: AddressTypeModel ): void {
			this.$store.dispatch( action( NS_ADDRESS, setAddressType ), addressType );
		},
		submit() {
			if ( this.userOnlyWantsToDeclineReceipt ) {
				const form = this.$refs.form as HTMLFormElement;
				trackFormSubmission( form );
				form.submit();
			}
			this.validateForm().then( ( validationResult: ValidationResult ) => {
				if ( validationResult.status === 'OK' ) {
					const form = this.$refs.form as HTMLFormElement;
					trackFormSubmission( form );
					form.submit();
				}
			} );
		},
	},
} );
</script>
