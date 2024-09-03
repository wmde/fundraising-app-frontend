import FakeDataPersister from '../TestDoubles/FakeDataPersister';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import persistenceAddress from '@src/store/data_persistence/address';
import {
	createInitialBankDataValues,
	createInitialDonationAddressValues,
	createInitialDonationPaymentValues,
	createInitialMembershipAddressValues,
	createInitialMembershipFeeValues,
} from '@src/store/dataInitializers';
import { InitialBankAccountData } from '@src/view_models/BankAccount';

describe( 'createInitialDonationAddressValues', () => {
	it( 'fills data from storage', () => {
		const firstName = { key: 'firstName', value: 'Spooky' };
		const lastName = { key: 'lastName', value: 'Magoo' };
		const addressType = 'anonym';

		const dataPersister = new FakeDataPersister( [ firstName, lastName ] );
		const values = createInitialDonationAddressValues( dataPersister, { addressType: addressType } );

		const firstNameValue = values.fields.find( field => field.name === firstName.key );
		const lastNameValue = values.fields.find( field => field.name === lastName.key );

		expect( firstNameValue ).toBeDefined();
		expect( ( firstNameValue || {} ).value ).toEqual( firstName.value );
		expect( lastNameValue ).toBeDefined();
		expect( ( lastNameValue || {} ).value ).toEqual( lastName.value );
		expect( values.addressType ).toEqual( AddressTypeModel.ANON );
	} );

	it( 'uses initial address type over stored address type over', () => {
		const storedAddressType = { key: 'addressType', value: AddressTypeModel.PERSON };
		const initialAddressType = 'firma';

		const dataPersister = new FakeDataPersister( [ storedAddressType ] );
		const values = createInitialDonationAddressValues( dataPersister, { addressType: initialAddressType } );

		expect( values.addressType ).toEqual( AddressTypeModel.COMPANY );
	} );

	it( 'uses stored address type when initial address type is empty', () => {
		const storedAddressType = { key: 'addressType', value: AddressTypeModel.PERSON };
		const initialAddressType = '';

		const dataPersister = new FakeDataPersister( [ storedAddressType ] );
		const values = createInitialDonationAddressValues( dataPersister, { addressType: initialAddressType } );

		expect( values.addressType ).toEqual( AddressTypeModel.PERSON );
	} );

	it( 'converts initial testType from string to AddressTypeModel', () => {
		const initialAddressType = 'person';
		const dataPersister = new FakeDataPersister( [] );

		const values = createInitialDonationAddressValues( dataPersister, { addressType: initialAddressType } );

		expect( values.addressType ).toEqual( AddressTypeModel.PERSON );
	} );
} );

describe( 'createInitialDonationPaymentValues', () => {
	it( 'fills data from storage', () => {
		const amount = '1200';
		const type = 'person';
		const paymentIntervalInMonths = '1';
		const storageValues = [
			{ key: 'amount', value: amount },
			{ key: 'type', value: type },
			{ key: 'interval', value: paymentIntervalInMonths },
		];

		const dataPersister = new FakeDataPersister( storageValues );
		const values = createInitialDonationPaymentValues( dataPersister, {} );

		expect( values.amount ).toEqual( amount );
		expect( values.type ).toEqual( type );
		expect( values.paymentIntervalInMonths ).toEqual( paymentIntervalInMonths );
	} );

	it( 'fills data from initial data', () => {
		const initialValues = {
			amount: '1200',
			paymentType: 'person',
			paymentIntervalInMonths: '1',
			isCustomAmount: true,
		};

		const dataPersister = new FakeDataPersister( [] );
		const values = createInitialDonationPaymentValues( dataPersister, initialValues );

		expect( values.amount ).toEqual( initialValues.amount );
		expect( values.type ).toEqual( initialValues.paymentType );
		expect( values.paymentIntervalInMonths ).toEqual( initialValues.paymentIntervalInMonths );
		expect( values.isCustomAmount ).toEqual( initialValues.isCustomAmount );
	} );

	it( 'uses initial data over stored data', () => {
		const storageValues = [
			{ key: 'amount', value: '1400' },
			{ key: 'type', value: 'company' },
			{ key: 'paymentIntervalInMonths', value: '2' },
			{ key: 'isCustomAmount', value: false },
		];

		const initialValues = {
			amount: '1200',
			paymentType: 'person',
			paymentIntervalInMonths: '1',
			isCustomAmount: true,
		};

		const dataPersister = new FakeDataPersister( storageValues );
		const values = createInitialDonationPaymentValues( dataPersister, initialValues );

		expect( values.amount ).toEqual( initialValues.amount );
		expect( values.type ).toEqual( initialValues.paymentType );
		expect( values.paymentIntervalInMonths ).toEqual( initialValues.paymentIntervalInMonths );
		expect( values.isCustomAmount ).toEqual( initialValues.isCustomAmount );
	} );
} );

describe( 'createInitialMembershipAddressValues', () => {
	it( 'fills data from storage', () => {
		const firstName = { key: 'firstName', value: 'Spooky' };
		const lastName = { key: 'lastName', value: 'Magoo' };
		const date = { key: 'date', value: '01.01.1980' };
		const addressType = { key: 'addressType', value: AddressTypeModel.PERSON };
		const membershipType = { key: 'membershipType', value: MembershipTypeModel.SUSTAINING };

		const dataPersister = new FakeDataPersister( [ firstName, lastName, date, addressType, membershipType ] );
		const values = createInitialMembershipAddressValues( dataPersister, new Map() );

		const firstNameValue = values.fields.find( field => field.name === firstName.key );
		const lastNameValue = values.fields.find( field => field.name === lastName.key );

		expect( firstNameValue ).toBeDefined();
		expect( ( firstNameValue || {} ).value ).toEqual( firstName.value );
		expect( lastNameValue ).toBeDefined();
		expect( ( lastNameValue || {} ).value ).toEqual( lastName.value );
		expect( values.addressType ).toEqual( addressType.value );
		expect( values.membershipType ).toEqual( membershipType.value );
		expect( values.date ).toEqual( date.value );
	} );

	it( 'fills data from initial data', () => {
		const initialValues = {
			addressType: 'person',
			salutation: 'Mr',
			title: 'Dr',
			firstName: 'Spooky',
			lastName: 'Magoo',
			companyName: 'ACME',
			street: 'Sesame',
			city: 'Berlin',
			postcode: '12345',
			country: 'de',
			email: 'spookymagoo@email.com',
			date: '12.12.1980',
		};

		const dataPersister = new FakeDataPersister( [] );
		const values = createInitialMembershipAddressValues( dataPersister, new Map( Object.entries( initialValues ) ) );

		expect( values.addressType ).toEqual( AddressTypeModel.PERSON );
		expect( values.membershipType ).toBeUndefined();
		expect( values.date ).toBeNull();

		persistenceAddress( 'membership_address' ).fields.forEach( key => {
			const field = values.fields.find( f => f.name === key );
			expect( field ).toBeDefined();
			expect( ( field || {} ).value ).toEqual( ( initialValues as any )[ key ] );
		} );
	} );

	it( 'uses stored data over initial data', () => {
		const firstName = { key: 'firstName', value: 'Spooky' };
		const lastName = { key: 'lastName', value: 'Magoo' };
		const date = { key: 'date', value: '01.01.1980' };
		const addressType = { key: 'addressType', value: AddressTypeModel.PERSON };
		const membershipType = { key: 'membershipType', value: MembershipTypeModel.SUSTAINING };

		const initialValues = {
			addressType: 'firma',
			firstName: 'Kooky',
			lastName: 'Magee',
			salutation: '',
			title: '',
			companyName: '',
			street: '',
			city: '',
			postcode: '',
			country: '',
			email: '',
		};

		const dataPersister = new FakeDataPersister( [ firstName, lastName, date, addressType, membershipType ] );
		const values = createInitialMembershipAddressValues( dataPersister, new Map( Object.entries( initialValues ) ) );

		const firstNameValue = values.fields.find( field => field.name === firstName.key );
		const lastNameValue = values.fields.find( field => field.name === lastName.key );

		expect( firstNameValue ).toBeDefined();
		expect( ( firstNameValue || {} ).value ).toEqual( firstName.value );
		expect( lastNameValue ).toBeDefined();
		expect( ( lastNameValue || {} ).value ).toEqual( lastName.value );
		expect( values.addressType ).toEqual( addressType.value );
		expect( values.membershipType ).toEqual( membershipType.value );
		expect( values.date ).toEqual( date.value );
	} );

	it( 'converts initial testType from string to AddressTypeModel', () => {
		const initialAddressType = 'person';
		const dataPersister = new FakeDataPersister( [] );

		const values = createInitialMembershipAddressValues( dataPersister, new Map( Object.entries( { addressType: initialAddressType } ) ) );

		expect( values.addressType ).toEqual( AddressTypeModel.PERSON );
	} );
} );

describe( 'createInitialMembershipFeeValues', () => {
	it( 'fills data from storage', () => {
		const validateFeeUrl = 'https://wikipedia.de';
		const fee = { key: 'fee', value: 'Spooky' };
		const interval = { key: 'interval', value: 'Magoo' };
		const type = { key: 'type', value: 'UEB' };

		const dataPersister = new FakeDataPersister( [ fee, interval, type ] );
		const values = createInitialMembershipFeeValues( dataPersister, { validateFeeUrl: 'https://wikipedia.de', fee: null, interval: null } );

		expect( values.validateFeeUrl ).toEqual( validateFeeUrl );
		expect( values.fee ).toEqual( fee.value );
		expect( values.interval ).toEqual( interval.value );
		expect( values.type ).toEqual( type.value );
	} );

	it( 'fills data from initial values when there are none in storage', () => {
		const validateFeeUrl = 'https://wikipedia.de';

		const dataPersister = new FakeDataPersister( [] );
		const values = createInitialMembershipFeeValues( dataPersister, { validateFeeUrl: 'https://wikipedia.de', fee: '1299', interval: '1', type: null } );

		expect( values.validateFeeUrl ).toEqual( validateFeeUrl );
		expect( values.fee ).toEqual( '1299' );
		expect( values.interval ).toEqual( '1' );
		expect( values.type ).toEqual( null );
	} );

	it( 'overrides initial values with values form storage where they exist', () => {
		const validateFeeUrl = 'https://wikipedia.de';
		const fee = { key: 'fee', value: 'Spooky' };

		const dataPersister = new FakeDataPersister( [ fee ] );
		const values = createInitialMembershipFeeValues( dataPersister, { validateFeeUrl: 'https://wikipedia.de', fee: '1299', interval: '1' } );

		expect( values.validateFeeUrl ).toEqual( validateFeeUrl );
		// Value from storage
		expect( values.fee ).toEqual( 'Spooky' );
		// Value from initial values
		expect( values.interval ).toEqual( '1' );
	} );
} );

describe( 'createInitialBankDataValues', () => {
	it( 'fills data from initial data', () => {
		const dataPersister = new FakeDataPersister( [] );
		const initialValues: InitialBankAccountData = {
			accountNumber: 'fakeAccountID',
			bankCode: 'IAmBIC',
			bankName: 'Bank of fakey fake',
			iban: 'IBANANA',
			bic: 'BISCUIT',
		};

		const values = createInitialBankDataValues( dataPersister, initialValues );

		expect( values.accountNumber ).toEqual( initialValues.accountNumber );
		expect( values.bankCode ).toEqual( initialValues.bankCode );
		expect( values.bankName ).toEqual( initialValues.bankName );
		expect( values.iban ).toEqual( initialValues.iban );
		expect( values.bic ).toEqual( initialValues.bic );
	} );
} );
