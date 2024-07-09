import { createStore } from '@src/store/membership_store';
import { Validity } from '@src/view_models/Validity';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { validateFeeDataRemotely } from '@src/store/axios';
import { FeeValidity } from '@src/view_models/MembershipFee';

jest.mock( '@src/store/axios' );

describe( 'Membership Store', () => {

	describe( 'FeeValidator', () => {
		it( 'sets fees within the allowed range as valid', async () => {

			const validity = { fee: Validity.VALID };
			const values = { fee: '25' };
			const initialFeeData = {
				addressType: AddressTypeModel.PERSON,
				fields: [ validity, values ],
			};
			const initialAddressData = {
				addressType: AddressTypeModel.PERSON,
				fields: [],
			};
			const store = createStore();
			await store.dispatch( action( NS_MEMBERSHIP_FEE, 'initializeMembershipFee' ), initialFeeData );
			await store.dispatch( action( NS_MEMBERSHIP_ADDRESS, 'initializeAddress' ), initialAddressData );

			expect( store.getters.feeValidity ).toEqual( FeeValidity.FEE_VALID );

		} );
	} );

	describe( 'Initialization', () => {

		it( 'initializes initial address data when available', async () => {
			const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
			const lastName = { name: 'lastName', value: 'Magoo', validity: Validity.RESTORED };
			const initialData = {
				addressType: AddressTypeModel.PERSON,
				fields: [ firstName, lastName ],
			};
			const store = createStore();
			await store.dispatch( action( NS_MEMBERSHIP_ADDRESS, 'initializeAddress' ), initialData );

			expect( store.state.membership_address.values.firstName ).toBe( firstName.value );
			expect( store.state.membership_address.values.lastName ).toBe( lastName.value );
		} );

		it( 'initializes initial fee data when available', async () => {
			const initialData = {
				validateFeeUrl: 'https://wikipedia.de',
				fee: '1200',
				interval: '2',
			};
			const mockedValidateFeeDataRemotely = jest.mocked( validateFeeDataRemotely, { shallow: true } );
			mockedValidateFeeDataRemotely.mockResolvedValue( { status: 'OK' } );
			const store = createStore();
			await store.dispatch( action( NS_MEMBERSHIP_FEE, 'initializeMembershipFee' ), initialData );

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
			await store.dispatch( action( 'bankdata', 'initializeBankData' ), initialData );

			expect( store.state.bankdata.values.iban ).toBe( initialData.accountId );
			expect( store.state.bankdata.values.bic ).toBe( initialData.bankId );
			expect( store.state.bankdata.values.bankName ).toBe( initialData.bankName );
		} );
	} );
} );
