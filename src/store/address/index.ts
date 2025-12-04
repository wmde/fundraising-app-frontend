import { Module } from 'vuex';
import type { AddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/address/actions';
import { getters } from '@src/store/address/getters';
import { mutations } from '@src/store/address/mutations';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AddressRequirements, DefaultFields } from '@src/store/address/constants';

export default function ( requiredFields: AddressRequirements, defaultFields: DefaultFields ): Module<AddressState, any> {
	const state: AddressState = {
		serverSideValidationCount: 0,
		addressType: AddressTypeModel.UNSET,
		newsletter: true,
		receipt: true,
		requiredFields: requiredFields,
		values: {
			salutation: defaultFields.salutation ?? '',
			title: defaultFields.title ?? '',
			firstName: defaultFields.firstName ?? '',
			lastName: defaultFields.lastName ?? '',
			companyName: defaultFields.companyName ?? '',
			street: defaultFields.street ?? '',
			postcode: defaultFields.postcode ?? '',
			city: defaultFields.city ?? '',
			country: defaultFields.country ?? '',
			email: defaultFields.email ?? '',
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
