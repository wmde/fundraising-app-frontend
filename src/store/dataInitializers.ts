import type { FieldInitialization } from '@src/view_models/FieldInitialization';
import persistenceAddress from '@src/store/data_persistence/address';
import { Validity } from '@src/view_models/Validity';
import type { DataPersister } from '@src/view_models/DataPersistence';
import type { InitialAddressValues, InitialMembershipAddressValues } from '@src/view_models/Address';
import { addressTypeFromName } from '@src/view_models/AddressTypeModel';
import type { InitialPaymentValues } from '@src/view_models/Payment';
import type { InitialBankAccountData } from '@src/view_models/BankAccount';
import type { InitialMembershipFeeValues } from '@src/view_models/MembershipFee';
import { trackFormFieldRestored } from '@src/util/tracking';
import { MAILING_LIST_ADDRESS_PAGE } from '@src/config';

const replaceInitialValue = ( defaultValue: any, replacement: any ): any => {
	if ( replacement !== undefined && replacement !== null && replacement !== '' ) {
		return replacement;
	}
	return defaultValue;
};

const nullifyZeroString = ( value: string ): string | null => {
	if ( value === '0' ) {
		return null;
	}
	return value;
};

/**
 * Look for address fields in local storage and get their values
 */
export const createInitialDonationAddressValues = ( dataPersister: DataPersister, initialFormValues: any ): InitialAddressValues => {
	const addressPersistItems: FieldInitialization[] = [];

	if ( initialFormValues.addressType ) {
		initialFormValues.addressType = addressTypeFromName( initialFormValues.addressType );
	}

	persistenceAddress( 'address' ).fields.forEach( field => {
		const value = dataPersister.getValue( field );
		if ( value ) {
			addressPersistItems.push( { name: field, value: value, validity: Validity.RESTORED } );
			trackFormFieldRestored( 'donation', field );
		}
	} );

	return {
		// The address type chosen by the user in the banner should override the choice made later, assuming that
		// reloading the page (and restoring from localStorage) happens less often than coming back from a banner
		addressType: replaceInitialValue( dataPersister.getValue( 'addressType' ), initialFormValues.addressType ),
		newsletter: replaceInitialValue( MAILING_LIST_ADDRESS_PAGE, dataPersister.getValue( 'newsletter' ) ),
		// The receipt chosen by the user in the banner should override the choice made later, assuming that
		// reloading the page (and restoring from localStorage) happens less often than coming back from a banner
		receipt: replaceInitialValue( dataPersister.getValue( 'receipt' ), initialFormValues.receipt ),
		fields: addressPersistItems,
	};
};

/**
 * Look for fields in initial form values and set them
 * If they don't exist check in local storage
 */
export const createInitialDonationPaymentValues = ( dataPersister: DataPersister, initialFormValues: any ): InitialPaymentValues => {
	let paymentIntervalInMonths = replaceInitialValue( '0', dataPersister.getValue( 'interval' ) );
	if ( initialFormValues.paymentIntervalInMonths !== undefined && initialFormValues.paymentIntervalInMonths !== null ) {
		paymentIntervalInMonths = replaceInitialValue(
			paymentIntervalInMonths,
			String( initialFormValues.paymentIntervalInMonths )
		);
	}
	return {
		amount: replaceInitialValue( dataPersister.getValue( 'amount' ), nullifyZeroString( initialFormValues.amount?.toString() ) ),
		type: replaceInitialValue( dataPersister.getValue( 'type' ), initialFormValues.paymentType ),
		paymentIntervalInMonths: paymentIntervalInMonths,
		isCustomAmount: initialFormValues.isCustomAmount,
	};
};

/**
 * Get address values from local storage and set them.
 * If one doesn't exist look for it in initial form values.
 */
export const createInitialMembershipAddressValues = ( dataPersister: DataPersister, initialFormValues: Map<string, any> ): InitialMembershipAddressValues => {
	const addressPersistItems: FieldInitialization[] = [];

	if ( initialFormValues.has( 'addressType' ) ) {
		const addressType = initialFormValues.get( 'addressType' );
		initialFormValues.set( 'addressType', addressTypeFromName( addressType ) );
	}

	persistenceAddress( 'membership_address' ).fields.forEach( field => {
		const value = dataPersister.getValue( field );
		if ( value ) {
			addressPersistItems.push( { name: field, value: value, validity: Validity.RESTORED } );
			trackFormFieldRestored( 'membership_application', field );
		} else if ( initialFormValues.has( field ) ) {
			// We consider all non-empty values from the backend valid because they come from the donation and were validated there
			addressPersistItems.push( { name: field, value: initialFormValues.get( field ), validity: Validity.VALID } );
		}
	} );

	return {
		addressType: replaceInitialValue( initialFormValues.get( 'addressType' ), dataPersister.getValue( 'addressType' ) ),
		membershipType: replaceInitialValue( initialFormValues.get( 'membershipType' ), dataPersister.getValue( 'membershipType' ) ),
		date: dataPersister.getValue( 'date' ),
		receipt: replaceInitialValue( null, dataPersister.getValue( 'receipt' ) ),
		incentives: replaceInitialValue( initialFormValues.get( 'incentives' ), dataPersister.getValue( 'incentives' ) ),
		fields: addressPersistItems,
	};
};

/**
 * Look for initial membership fee values in local storage
 */
export const createInitialMembershipFeeValues = ( dataPersister: DataPersister, initialFeeValues: any ): InitialMembershipFeeValues => {
	return {
		validateFeeUrl: initialFeeValues.validateFeeUrl,
		fee: replaceInitialValue( initialFeeValues.fee, dataPersister.getValue( 'fee' ) ),
		type: replaceInitialValue( initialFeeValues.type, dataPersister.getValue( 'type' ) ),
		interval: replaceInitialValue( initialFeeValues.interval, dataPersister.getValue( 'interval' ) ),
	};
};

/**
 * Look for initial bank fields in initial form data
 */
export const createInitialBankDataValues = ( dataPersister: DataPersister, initialFormValues: InitialBankAccountData ): InitialBankAccountData => {
	return {
		bankName: replaceInitialValue( initialFormValues.bankName, dataPersister.getValue( 'bankName' ) ),
		iban: replaceInitialValue( initialFormValues.iban, dataPersister.getValue( 'iban' ) ),
		bic: replaceInitialValue( initialFormValues.bic, dataPersister.getValue( 'bic' ) ),
	};
};
