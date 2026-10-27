import { computed } from 'vue';
import { AddressTypeModel, addressTypeName as getAddressTypeName } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';

export const useAddressTypeFunctions = ( store: any ) => {
	const disabledAddressTypes = computed(
		(): Array<AddressTypeModel> => {
			const disabledTypes: Array<AddressTypeModel> = store.getters[ 'payment/isDirectDebitPayment' ] ? [ AddressTypeModel.ANON ] : [];
			if ( store.state.membership_address.membershipType === MembershipTypeModel.ACTIVE ) {
				disabledTypes.push( AddressTypeModel.COMPANY );
			}
			return disabledTypes;
		}
	);
	const addressType = computed( () => store.getters[ 'membership_address/addressType' ] );

	const addressTypeName = computed(
		(): string => getAddressTypeName( store.state.membership_address.type )
	);

	const addressSummary = computed( () => {
		const addressValues = store.state.membership_address.values;

		const hasSomeAddressDataFilledOut = store.state.membership_address.companyName?.trim() ||
			( addressValues.firstName?.trim() && addressValues.lastName?.trim() ) ||
			addressValues.street?.trim() ||
			( addressValues.postcode?.trim() && addressValues.city?.trim() ) ||
			addressValues.email?.trim();

		if ( hasSomeAddressDataFilledOut ) {
			return {
				...addressValues,
				fullName: store.getters[ 'membership_address/fullName' ],
				street: addressValues.street,
				postcode: addressValues.postcode,
				country: store.state.membership_address.values.country,
				addressType: getAddressTypeName( store.getters[ 'membership_address/addressType' ] ),
			};
		}

		return undefined;
	} );

	function setAddressType( newAddressType: AddressTypeModel ): void {
		store.dispatch( action( 'membership_address', 'setAddressType' ), newAddressType );
	}

	return {
		disabledAddressTypes,
		addressType,
		addressTypeName,

		setAddressType,
		addressSummary,
	};
};
