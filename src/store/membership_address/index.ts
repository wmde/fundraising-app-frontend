import { Module } from 'vuex';
import type { MembershipAddressState } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { actions } from '@src/store/membership_address/actions';
import { getters } from '@src/store/membership_address/getters';
import { mutations } from '@src/store/membership_address/mutations';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import { AddressRequirements, DefaultFields } from '@src/store/membership_address/constants';

export default function ( requiredFields: AddressRequirements, defaultFields: DefaultFields ): Module<MembershipAddressState, any> {
	const state: MembershipAddressState = {
		serverSideValidationCount: 0,
		addressType: AddressTypeModel.PERSON,
		membershipType: MembershipTypeModel.SUSTAINING,
		receipt: true,
		requiredFields: requiredFields,
		incentives: [],
		/* values: {
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
			date: '',
		}, */
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
			date: Validity.VALID,
			addressType: Validity.VALID,
			membershipType: Validity.VALID,
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
