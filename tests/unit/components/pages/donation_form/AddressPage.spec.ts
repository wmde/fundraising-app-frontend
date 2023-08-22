import { mount, VueWrapper } from '@vue/test-utils';

import AddressPage from '@src/components/pages/donation_form/subpages/AddressPage.vue';
import { createStore, StoreKey } from '@src/store/donation_store';
import { action } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { initializePayment } from '@src/store/payment/actionTypes';
import PaymentBankData from '@src/components/shared/PaymentBankData.vue';
import { setAddressType } from '@src/store/address/actionTypes';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import AddressType from '@src/components/pages/donation_form/AddressTypeAllOptions.vue';
import { createFeatureToggle } from '@src/createFeatureToggle';
import { Store } from 'vuex';

describe( 'AddressPage.vue', () => {
	const getWrapper = (): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const store = createStore();
		const wrapper = mount( AddressPage, {
			props: {
				countries: [],
				salutations: [],
				payment: {
					paymentType: 'payment_type',
				},
				validateBankDataUrl: 'https://localhost:8082',
				validateLegacyBankDataUrl: 'https://localhost:8082',
			},
			global: {
				plugins: [ store ],
				stubs: {
					Address: true,
				},
				provide: {
					[ StoreKey as symbol ]: store,
				},
				components: {
					FeatureToggle: createFeatureToggle( { activeFeatures: [ 'campaigns.address_type_steps.preselect' ] } ),
				},
			},
		} );

		return { wrapper, store };
	};

	const setPaymentType = ( store: Store<any>, paymentType: string ): Promise<any> => {
		return store.dispatch( action( NS_PAYMENT, initializePayment ), {
			amount: '100',
			type: paymentType,
			paymentIntervalInMonths: '0',
			isCustomAmount: false,
		} );
	};

	it( 'shows bank data fields if payment type is direct debit', async () => {
		const { wrapper, store } = getWrapper();

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeFalsy();

		await setPaymentType( store, 'BEZ' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeTruthy();
	} );

	it( 'hides bank data fields if payment type is not direct debit', async () => {
		const { wrapper, store } = getWrapper();

		await setPaymentType( store, 'BEZ' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeTruthy();

		await setPaymentType( store, 'UEB' );

		expect( wrapper.findComponent( PaymentBankData ).exists() ).toBeFalsy();
	} );

	it( 'sets address type in store when it receives address-type event', () => {
		const { wrapper, store } = getWrapper();

		store.dispatch = jest.fn();
		const expectedAction = action( NS_ADDRESS, setAddressType );
		const expectedPayload = AddressTypeModel.ANON;

		wrapper.findComponent( AddressType ).vm.$emit( 'address-type', AddressTypeModel.ANON );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

} );
