import { ActionContext } from 'vuex';
import type { MembershipFee } from '@src/view_models/MembershipFee';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import type { ValidationResponse } from '@src/store/ValidationResponse';
import axios, { AxiosResponse } from 'axios';

// Membership fee call

function postFeeData(
	validateFeeUrl: string,
	membershipFee: string,
	interval: string,
	addressType: AddressTypeModel,
	paymentType: string,
): Promise<ValidationResponse> {
	const bodyFormData = new FormData();
	bodyFormData.append( 'membershipFee', membershipFee );
	bodyFormData.append( 'paymentIntervalInMonths', interval );
	bodyFormData.append( 'addressType', addressTypeName( addressType ) );
	bodyFormData.append( 'paymentType', paymentType );
	return axios.post(
		validateFeeUrl,
		bodyFormData,
		{ headers: { 'Content-Type': 'multipart/form-data' } }
	).then( ( validationResult: AxiosResponse<ValidationResponse> ) => {
		return Promise.resolve( validationResult.data );
	} );
}

export function validateFeeDataRemotely(
	context: ActionContext<MembershipFee, any>,
	validateFeeUrl: string,
	feeValue: string,
	interval: string,
	paymentType: string,
): Promise<ValidationResponse> {
	const feeAmount = feeValue;
	const paymentInterval = interval;
	const addressType = context.rootState.membership_address.addressType;
	return postFeeData( validateFeeUrl, feeAmount, paymentInterval, addressType, paymentType );
}
