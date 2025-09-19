import { mount, VueWrapper } from '@vue/test-utils';
import MembershipFeeUpgrade from '@src/components/pages/MembershipFeeUpgrade.vue';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';

const uuid = '28178402-56ef-4977-87d9-c681c29bb823';
const currentAmountInCents = 1000;
const suggestedAmountInCents = 1600;
const currentInterval = 3;
const feeChangeFrontendFlag = 'SHOW_FEE_CHANGE_FORM';

describe( 'MembershipFeeUpgrade.vue', () => {
	const getWrapper = (): VueWrapper<any> => {
		return mount( MembershipFeeUpgrade, {
			props: {
				uuid,
				currentAmountInCents,
				suggestedAmountInCents,
				currentInterval,
				feeChangeFrontendFlag,
			},
			global: {
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
					membershipFeeChangeResource: { put: () => Promise.resolve( { status: 'OK' } ) },
				},
			},
		} );
	};

	test( 'suggestedAmountIsPreselected', () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#suggested-amount' ).element.checked ).toBeTruthy();
	} );
	test( 'selectingCustomAmountsDeselectsSuggestedAmount', () => {
	} );
	test( 'reselectingCustomAmountDeselectsSuggestedAmount', () => {
	} );
	test( 'customAmountGetsCleared', () => {
	} );
	test( 'externalMemberIDIsVisibleInSidebar', () => {
	} );
	test( 'showsMemberNameErrorMessage', () => {
	} );
	test( 'HidesMemberNameErrorMessage', () => {
	} );
	test( 'showsIbanErrorMessage', () => {
	} );
	test( 'HidesIbanErrorMessage', () => {
	} );

} );
