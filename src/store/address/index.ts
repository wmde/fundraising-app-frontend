import { Module } from 'vuex';
import { AddressState } from '@/view_models/Address';
import { Validity } from '@/view_models/Validity';
import { actions } from '@/store/address/actions';
import { getters } from '@/store/address/getters';
import { mutations } from '@/store/address/mutations';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { AddressRequirements } from '@/store/address/constants';

export default function ( requiredFields: AddressRequirements ): Module<AddressState, any> {
	const state: AddressState = {
		serverSideValidationCount: 0,
		addressType: AddressTypeModel.PERSON,
		newsletterOptIn: false,
		receiptOptOut: false,
		requiredFields: requiredFields,
		values: {
			salutation: '',
			title: '',
			firstName: '',
			lastName: '',
			companyName: '',
			street: '',
			postcode: '',
			city: '',
			country: 'DE',
			email: '',
		},
		validity: {
			salutation: Validity.INCOMPLETE,
			title: Validity.VALID,
			firstName: Validity.INCOMPLETE,
			lastName: Validity.INCOMPLETE,
			companyName: Validity.INCOMPLETE,
			street: Validity.INCOMPLETE,
			postcode: Validity.INCOMPLETE,
			city: Validity.INCOMPLETE,
			country: Validity.VALID,
			email: Validity.INCOMPLETE,
			addressType: Validity.VALID,
		},
	};

	const namespaced = true;

	return {
		namespaced,
		state,
		getters,
		mutations,
		actions,
	};
}
