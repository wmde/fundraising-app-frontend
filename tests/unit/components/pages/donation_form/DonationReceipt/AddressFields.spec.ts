import { mount, VueWrapper } from '@vue/test-utils';
import AddressFields from '@src/components/pages/donation_form/DonationReceipt/AddressFields.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { InitialAddressValues } from '@src/view_models/Address';
import { Validity } from '@src/view_models/Validity';
import { Store } from 'vuex';
import { createStore } from '@src/store/donation_store';
import { action } from '@src/store/util';
import countries from '@test/data/countries';

const initialValues: InitialAddressValues = {
	addressType: AddressTypeModel.PERSON,
	fields: [
		{ name: 'salutation', value: 'Herr', validity: Validity.RESTORED },
		{ name: 'title', value: 'Prof. Dr.', validity: Validity.RESTORED },
		{ name: 'companyName', value: 'ACME', validity: Validity.RESTORED },
		{ name: 'firstName', value: 'Wiley', validity: Validity.RESTORED },
		{ name: 'lastName', value: 'Coyote', validity: Validity.RESTORED },
		{ name: 'street', value: 'Desert Street', validity: Validity.RESTORED },
		{ name: 'city', value: 'The Desert', validity: Validity.RESTORED },
		{ name: 'postcode', value: '666', validity: Validity.RESTORED },
		{ name: 'country', value: 'ie', validity: Validity.RESTORED },
		{ name: 'email', value: 'wiley.coyote@wikimedia.de', validity: Validity.RESTORED },
	],
	newsletter: false,
	receipt: true,
};

describe( 'AddressFields.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): VueWrapper<any> => {
		return mount( AddressFields, {
			props: {
				formData: {
					salutation: { name: 'salutation', value: 'Herr', pattern: '', optionalField: false },
					title: { name: 'title', value: 'Prof. Dr.', pattern: '', optionalField: true },
					companyName: { name: 'companyName', value: 'ACME', pattern: '', optionalField: false },
					firstName: { name: 'firstName', value: 'Wiley', pattern: '', optionalField: false },
					lastName: { name: 'lastName', value: 'Coyote', pattern: '', optionalField: false },
					street: { name: 'street', value: 'Desert Street', pattern: '', optionalField: false },
					city: { name: 'city', value: 'The Desert', pattern: '', optionalField: false },
					postcode: { name: 'postcode', value: '666', pattern: '', optionalField: false },
					country: { name: 'country', value: 'IE', pattern: '', optionalField: false },
					email: { name: 'email', value: 'wiley.coyote@wikimedia.de', pattern: '', optionalField: false },
				},
				showError: {
					salutation: false,
					title: false,
					companyName: false,
					firstName: false,
					lastName: false,
					street: false,
					city: false,
					postcode: false,
					country: false,
					email: false,
				},
				countries,
				postCodeValidation: '',
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'restores the country field when mounted', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), initialValues );

		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '#country' ).element.value ).toStrictEqual( 'Ireland' );
	} );

	it( 'sets the post code validation pattern when the country field is changed', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();

		await wrapper.find( '#country' ).setValue( 'Ireland' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.props( 'formData' ).postcode.pattern ).toStrictEqual( '^[0-9]{11}$' );

		await wrapper.find( '#country' ).setValue( 'Not a country' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		expect( wrapper.props( 'formData' ).postcode.pattern ).toStrictEqual( '' );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 4 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'country' );
		expect( wrapper.emitted( 'field-changed' )[ 1 ][ 0 ] ).toStrictEqual( 'postcode' );
		expect( wrapper.emitted( 'field-changed' )[ 2 ][ 0 ] ).toStrictEqual( 'country' );
		expect( wrapper.emitted( 'field-changed' )[ 3 ][ 0 ] ).toStrictEqual( 'postcode' );

		jest.restoreAllMocks();
	} );

	it( 'emits field changes', async () => {
		jest.useFakeTimers();

		const wrapper = getWrapper();

		await wrapper.find( '#street' ).setValue( 'Sesame' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'Big City' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 2 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'street' );
		expect( wrapper.emitted( 'field-changed' )[ 1 ][ 0 ] ).toStrictEqual( 'city' );

		jest.restoreAllMocks();
	} );
} );
