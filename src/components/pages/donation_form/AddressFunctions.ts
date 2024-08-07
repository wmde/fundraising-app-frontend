import { AddressFormData, AddressValidity } from '@src/view_models/Address';
import { computed, reactive } from 'vue';
import { Validity } from '@src/view_models/Validity';
import { action } from '@src/store/util';
import { camelizeName } from '@src/util/camlize_name';
import { AddressValidation } from '@src/view_models/Validation';

interface AddressFunctionParams {
	addressValidationPatterns: AddressValidation
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
				value: '',
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
		(): Boolean => store.state.address.receipt
	);

	// methods
	function onFieldChange( fieldName: string ): void {
		store.dispatch( action( 'address', 'setAddressField' ), formData[ fieldName ] );
	}

	function onAutofill( autofilledFields: { [key: string]: string; } ): void {
		Object.keys( autofilledFields ).forEach( key => {
			const fieldName = camelizeName( key );
			if ( formData[ fieldName ] ) {
				store.dispatch( action( 'address', 'setAddressField' ), formData[ fieldName ] );
			}
		} );
	}

	function setReceipt( choice: boolean ): void {
		store.dispatch( action( 'address', 'setReceiptChoice' ), choice );
	}

	/**
	 * Call this in onMounted function to pre-fill form with store values
	 */
	function initializeDataFromStore() {
		Object.entries( formData ).forEach( ( formItem ) => {
			const key: string = formItem[ 0 ];
			formData[ key ].value = store.state.address.values[ key ];
			if ( store.state.address.validity[ key ] === Validity.RESTORED ) {
				store.dispatch( action( 'address', 'validateAddressField' ), formData[ key ] );
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
		setReceipt,
	};
};
