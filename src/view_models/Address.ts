import { Validity } from './Validity';
import { MembershipTypeModel } from './MembershipTypeModel';
import { AddressRequirements } from '@src/store/address/constants';
import { FieldInitialization } from '@src/view_models/FieldInitialization';

export type AddressTypes = 'unset' | 'invalid' | 'person' | 'company' | 'company_with_contact' | 'email' | 'anonymous';

export interface Address {
    addressType: AddressTypes,
    salutation: string,
    title: string,
    firstName: string,
    lastName: string,
    fullName: string,
    companyName: string,
    street: string,
    city: string,
    postcode: string,
    country: string,
    email: string
}

export interface AddressValidity {
    [key: string]: boolean
}

export interface InputField {
    name: string,
    value: string,
    pattern: string,
    optionalField: boolean
}

export interface AddressFormData {
    [key: string]: InputField
}

export interface CountryValidationFields {
    country: InputField,
    postcode: InputField,
}

export interface FormValidity {
    [key: string]: Validity
}

export interface FormValues {
    [key: string]: string,
}

export interface AddressState {
    serverSideValidationCount: number,
    addressType: AddressTypes,
    newsletter: boolean,
    receipt: boolean,
    values: FormValues,
    validity: FormValidity,
    requiredFields: AddressRequirements,
}

export interface MembershipAddressState {
    serverSideValidationCount: number,
    addressType: AddressTypes,
    membershipType: MembershipTypeModel,
    receipt: boolean,
    incentives: string[],
    values: FormValues,
    validity: FormValidity,
}

export interface InitialAddressValues {
    addressType: AddressTypes,
    newsletter: boolean,
    receipt: boolean,
    fields: FieldInitialization[],
}

export interface InitialMembershipAddressValues {
    addressType?: AddressTypes,
    membershipType?: MembershipTypeModel,
    date?: string|null,
    receipt: boolean,
    incentives: string[],
    fields: FieldInitialization[],
}

export interface InitialMembershipData {
    addressType: string,
    salutation: string,
    title: string,
    firstName: string,
    lastName: string,
    companyName: string,
    street: string,
    city: string,
    postcode: string,
    country: string,
    email: string,
    iban?: string
    bic?: string,
    bankname?: string
}

export interface Payload {
    validateAddressUrl: string,
    validateEmailUrl: string,
    formData: AddressFormData
}

/**
 * Validation result JSON object from the server
 */
export interface ValidationResult {
    status: string,
    messages: object
}

export interface PostData {
    [key: string]: string
}

export interface SubmittedAddress {
    addressData: AddressFormData,
    addressType: string
}

export interface AddressTypeValidationRequest {
    type: AddressTypes,
    disallowed: AddressTypes[]
}
