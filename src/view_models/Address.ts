import { Validity } from './Validity';
import { AddressTypeModel } from './AddressTypeModel';
import { MembershipTypeModel } from './MembershipTypeModel';
import type { AddressRequirements } from '@src/store/address/constants';
import type { FieldInitialization } from '@src/view_models/FieldInitialization';

export interface Address {
	addressType: string;
	salutation: string;
	title: string;
	firstName: string;
	lastName: string;
	fullName: string;
	companyName: string;
	street: string;
	city: string;
	postcode: string;
	country: string;
	email: string;
}

export interface AddressValidity {
	[key: string]: boolean;
}

export interface InputField {
	name: string;
	value: string;
	pattern: string;
	optionalField: boolean;
}

export interface AddressFormData {
	[key: string]: InputField;
}

export interface FormValidity {
	[key: string]: Validity;
}

export interface FormValues {
	[key: string]: string;
}

export interface AddressState {
	serverSideValidationCount: number;
	addressType: AddressTypeModel;
	newsletter: boolean;
	receipt: boolean;
	values: FormValues;
	validity: FormValidity;
	requiredFields: AddressRequirements;
}

export interface MembershipAddressState {
	serverSideValidationCount: number;
	addressType: AddressTypeModel;
	membershipType: MembershipTypeModel;
	receipt: boolean;
	incentives: string[];
	values: FormValues;
	validity: FormValidity;
}

export interface InitialAddressValues {
	addressType: AddressTypeModel;
	newsletter: boolean;
	receipt: boolean;
	fields: FieldInitialization[];
}

export interface InitialMembershipAddressValues {
	addressType?: AddressTypeModel;
	membershipType?: MembershipTypeModel;
	date?: string | null;
	receipt: boolean;
	incentives: string[];
	fields: FieldInitialization[];
}

export interface InitialMembershipData {
	addressType: string;
	salutation: string;
	title: string;
	firstName: string;
	lastName: string;
	companyName: string;
	street: string;
	city: string;
	postcode: string;
	country: string;
	email: string;
	iban?: string;
	bic?: string;
	bankname?: string;
}

export interface Payload {
	validateAddressUrl: string;
	validateEmailUrl: string;
	formData: AddressFormData;
}

/**
 * Validation result JSON object from the server
 */
export interface ValidationResult {
	status: string;
	messages: object;
}

export interface PostData {
	[key: string]: string;
}

export interface SubmittedAddress {
	addressData: AddressFormData;
	addressType: string;
}

export interface AddressTypeValidationRequest {
	type: AddressTypeModel;
	disallowed: AddressTypeModel[];
}
