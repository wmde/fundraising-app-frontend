import { computed, ComputedRef } from 'vue';
import { Store } from 'vuex';
import { MembershipType, membershipTypeName } from '@src/view_models/MembershipTypeModel';

type ReturnType = {
	paymentSummary: ComputedRef<
		{
			paymentIntervalInMonths: string;
			membershipFee: number;
			paymentType: string;
			membershipType: MembershipType;
		}
		|
		undefined
	>;
};

export function useMembershipPaymentFunctions( store: Store<any> ): ReturnType {
	const paymentSummary = computed( () => {
		const payment = store.state.membership_fee.values;
		const hasPaymentData = payment.fee > 0 && Boolean( payment.interval );
		if ( hasPaymentData ) {
			return {
				paymentIntervalInMonths: payment.interval,
				membershipFee: payment.fee / 100,
				paymentType: payment.type,
				membershipType: membershipTypeName( store.getters[ 'membership_address/membershipType' ] ),
			};
		}
		return undefined;
	} );

	return {
		paymentSummary,
	};
}
