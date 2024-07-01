import { Module } from 'vuex';
import { AddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/address/actions';
import { getters } from '@src/store/address/getters';
import { mutations } from '@src/store/address/mutations';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressRequirements } from '@src/store/address/constants';

export default function ( requiredFields: AddressRequirements ): Module<AddressState, any> {
	const state: AddressState = {
		serverSideValidationCount: 0,
		addressType: AddressTypeModel.UNSET,
		newsletter: true,
		receipt: true,
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
			receipt: Validity.INCOMPLETE,
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
