import { AddressFormData, AddressValidity } from '@/view_models/Address';
import { computed, reactive } from 'vue';
import { Validity } from '@/view_models/Validity';
import {
	setAddressField,
	setReceiptOptOut,
	validateAddressField,
} from '@/store/address/actionTypes';
import { NS_ADDRESS } from '@/store/namespaces';
import { action } from '@/store/util';
import { camelizeName } from '@/camlize_name';

interface AddressValidationPatterns {
	salutation: string,
	title: string,
	companyName: string,
	firstName: string,
	lastName: string,
	street: string,
	city: string,
	postcode: string,
	country: string,
	email: string
}

interface AddressFunctionParams {
	addressValidationPatterns: AddressValidationPatterns
}

export const useAddressFunctions = ( props: AddressFunctionParams, store: any ) => {
	const formData: AddressFormData = reactive(
		{
			salutation: {
				name: 'salutation',
				value: '',
				pattern: props.addressValidationPatterns.salutation,
				optionalField: false,
			},
			title: {
				name: 'title',
				value: '',
				pattern: props.addressValidationPatterns.title,
				optionalField: true,
			},
			companyName: {
				name: 'companyName',
				value: '',
				pattern: props.addressValidationPatterns.companyName,
				optionalField: false,
			},
			firstName: {
				name: 'firstName',
				value: '',
				pattern: props.addressValidationPatterns.firstName,
				optionalField: false,
			},
			lastName: {
				name: 'lastName',
				value: '',
				pattern: props.addressValidationPatterns.lastName,
				optionalField: false,
			},
			street: {
				name: 'street',
				value: '',
				pattern: props.addressValidationPatterns.street,
				optionalField: false,
			},
			city: {
				name: 'city',
				value: '',
				pattern: props.addressValidationPatterns.city,
				optionalField: false,
			},
			postcode: {
				name: 'postcode',
				value: '',
				pattern: props.addressValidationPatterns.postcode,
				optionalField: false,
			},
			country: {
				name: 'country',
				value: 'DE',
				pattern: props.addressValidationPatterns.country,
				optionalField: false,
			},
			email: {
				name: 'email',
				value: '',
				pattern: props.addressValidationPatterns.email,
				optionalField: false,
			},
		}
	);

	// computed
	const fieldErrors = computed(
		(): AddressValidity => {
			return Object.keys( formData ).reduce( ( validity: AddressValidity, fieldName: string ) => {
				if ( !formData[ fieldName ].optionalField ) {
					validity[ fieldName ] = store.state.address.validity[ fieldName ] === Validity.INVALID;
				}
				return validity;
			}, ( {} as AddressValidity ) );
		}
	);

	const receiptNeeded = computed(
		(): Boolean => !store.state.address.receiptOptOut
	);

	// methods
	function onFieldChange( fieldName: string ): void {
		store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
	}

	function onAutofill( autofilledFields: { [key: string]: string; } ): void {
		Object.keys( autofilledFields ).forEach( key => {
			const fieldName = camelizeName( key );
			if ( formData[ fieldName ] ) {
				store.dispatch( action( NS_ADDRESS, setAddressField ), formData[ fieldName ] );
			}
		} );
	}

	function setReceiptOptedOut( optedOut: boolean ): void {
		store.dispatch( action( NS_ADDRESS, setReceiptOptOut ), optedOut );
	}

	/**
	 * Call this in onMounted function to pre-fill form with store values
	 */
	function initializeDataFromStore() {
		Object.entries( formData ).forEach( ( formItem ) => {
			const key: string = formItem[ 0 ];
			formData[ key ].value = store.state.address.values[ key ];
			if ( store.state[ NS_ADDRESS ].validity[ key ] === Validity.RESTORED ) {
				store.dispatch( action( NS_ADDRESS, validateAddressField ), formData[ key ] );
			}
		} );
	}

	return {
		formData,
		fieldErrors,
		receiptNeeded,

		initializeDataFromStore,
		onFieldChange,
		onAutofill,
		setReceiptOptedOut,
	};
};
