import { createStore } from '@/store/membership_store';
import { Validity } from '@/view_models/Validity';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';
import { action } from '@/store/util';
import { NS_BANKDATA, NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@/store/namespaces';
import { initializeAddress } from '@/store/membership_address/actionTypes';
import { initializeMembershipFee } from '@/store/membership_fee/actionTypes';
import { initializeBankData } from '@/store/bankdata/actionTypes';
import { validateFeeDataRemotely } from '@/store/axios';

jest.mock( '@/store/axios' );

describe( 'Membership Store', () => {

	describe( 'Initialization', () => {

		it( 'initializes initial address data when available', async () => {
			const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
			const lastName = { name: 'lastName', value: 'Magoo', validity: Validity.RESTORED };
			const initialData = {
				addressType: AddressTypeModel.PERSON,
				fields: [ firstName, lastName ],
			};
			const store = createStore();
			await store.dispatch( action( NS_MEMBERSHIP_ADDRESS, initializeAddress ), initialData );

			expect( store.state.membership_address.values.firstName ).toBe( firstName.value );
			expect( store.state.membership_address.values.lastName ).toBe( lastName.value );
		} );

		it( 'initializes initial fee data when available', async () => {
			const initialData = {
				validateFeeUrl: 'https://wikipedia.de',
				fee: '1200',
				interval: '2',
			};
			const mockedValidateFeeDataRemotely = jest.mocked( validateFeeDataRemotely, true );
			mockedValidateFeeDataRemotely.mockResolvedValue( { status: 'OK' } );
			const store = createStore();
			await store.dispatch( action( NS_MEMBERSHIP_FEE, initializeMembershipFee ), initialData );

			expect( store.state.membership_fee.values.fee ).toBe( initialData.fee );
			expect( store.state.membership_fee.values.interval ).toBe( initialData.interval );
		} );

		it( 'initializes initial bank account data when available', async () => {
			const initialData = {
				accountId: 'fakeAccountID',
				bankId: 'IAmBIC',
				bankName: 'Bank of fakey fake',
			};

			const store = createStore();
			await store.dispatch( action( NS_BANKDATA, initializeBankData ), initialData );

			expect( store.state.bankdata.values.iban ).toBe( initialData.accountId );
			expect( store.state.bankdata.values.bic ).toBe( initialData.bankId );
			expect( store.state.bankdata.values.bankName ).toBe( initialData.bankName );
		} );
	} );
} );
