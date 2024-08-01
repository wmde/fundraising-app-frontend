import { mount, VueWrapper } from '@vue/test-utils';
import Address from '@src/components/pages/membership_form/Address.vue';
import { createStore, StoreKeyMembership } from '@src/store/membership_store';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { action } from '@src/store/util';
import countries from '@src/../tests/data/countries';
import { Validity } from '@src/view_models/Validity';
import { addressValidationPatterns, dateOfBirthValidationPattern } from '@test/data/validation';
import { Store } from 'vuex';
import NameFields from '@src/components/shared/NameFields.vue';
import PostalAddressFields from '@src/components/shared/PostalAddressFields.vue';
import IncentivesField from '@src/components/shared/form_fields/IncentivesField.vue';
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import { EXAMPLE_SALUTATIONS } from '@test/unit/components/pages/donation_form/AddressForms.spec';
import { InitialMembershipAddressValues } from '@src/view_models/Address';

describe( 'Address.vue', () => {

	const getWrapper = ( store: Store<any> = createStore() ): { wrapper: VueWrapper<any>, store: Store<any> } => {
		const wrapper = mount( Address, {
			props: {
				validateEmailUrl: 'validate-email',
				salutations: EXAMPLE_SALUTATIONS,
				dateOfBirthValidationPattern: dateOfBirthValidationPattern,
				validateAddressUrl: 'validate-address',
				countries: countries,
				addressValidationPatterns: addressValidationPatterns,
			},
			global: {
				plugins: [ store ],
				provide: {
					[ StoreKeyMembership as symbol ]: store,
				},
			},
		} );

		return { wrapper, store };
	};

	it( 'renders components which are part of the membership address page', () => {
		const { wrapper } = getWrapper();
		expect( wrapper.findComponent( NameFields ).exists() ).toBe( true );
		expect( wrapper.findComponent( PostalAddressFields ).exists() ).toBe( true );
		expect( wrapper.findComponent( CheckboxSingleFormInput ).exists() ).toBe( true );
		expect( wrapper.find<HTMLInputElement>( '#receipt-option-person' ).exists() ).toBe( true );
		expect( wrapper.findComponent( IncentivesField ).exists() ).toBe( true );
		expect( wrapper.find<HTMLInputElement>( '#date' ).exists() ).toBe( true );
		expect( wrapper.findComponent( EmailField ).exists() ).toBe( true );
	} );

	it( 'shows company related input fields when address type COMPANY is set in the store', async () => {
		const { wrapper, store } = getWrapper();

		expect( wrapper.find( '#company-name' ).exists() ).toBe( false );

		await store.dispatch( action( 'membership_address', 'setAddressType' ), AddressTypeModel.COMPANY );

		expect( wrapper.find( '#company-name' ).exists() ).toBe( true );
	} );

	it( 'sets address field in store when it receives field-changed event', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();
		const expectedAction = action( 'membership_address', 'setAddressField' );
		const firstNameValue = 'Vuetiful';
		await wrapper.find( '#first-name' ).setValue( firstNameValue );

		wrapper.findComponent( NameFields ).vm.$emit( 'field-changed', 'firstName' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'firstName',
			'optionalField': false,
			'pattern': addressValidationPatterns.firstName,
			'value': firstNameValue,
		} );
	} );

	it( 'sets receipt preference in store when it receives receipt-changed event', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();
		const expectedAction = action( 'membership_address', 'setReceiptChoice' );
		const expectedPayload = false;

		// assumes the receipt checkbox is the first checkbox on the address component
		expect( wrapper.findComponent( CheckboxSingleFormInput ).exists() ).toBe( true );
		await wrapper.findComponent( CheckboxSingleFormInput ).setValue( false );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );
	} );

	it( 'sets incentive preference in store when it receives field-change event', async () => {
		const { wrapper, store } = getWrapper();
		store.dispatch = jest.fn();
		const expectedAction = action( 'membership_address', 'setIncentives' );
		const expectedPayload = [ 'tote_bag' ];

		const inputElement = wrapper.findComponent( IncentivesField ).find<HTMLInputElement>( 'input' );
		await inputElement.setValue( true );

		expect( store.dispatch ).toBeCalledWith( expectedAction, expectedPayload );

	} );

	it( 'sets email in store when it receives email event', async () => {
		const { wrapper, store } = getWrapper();
		const testEmail = 'test@wikimedia.de';
		store.dispatch = jest.fn();
		await wrapper.find( '#email' ).setValue( testEmail );

		const expectedAction = action( 'membership_address', 'setAddressField' );
		wrapper.findComponent( EmailField ).vm.$emit( 'field-changed', 'email' );
		expect( store.dispatch ).toBeCalledWith( expectedAction, {
			'name': 'email',
			'optionalField': false,
			'pattern': addressValidationPatterns.email,
			'value': testEmail,
		} );
	} );

	it( 'populates form data and validates if initial data is available', async () => {
		const store = createStore();

		const firstName = { name: 'firstName', value: 'Spooky', validity: Validity.RESTORED };
		const lastName = { name: 'lastName', value: 'Magoo', validity: Validity.RESTORED };

		const initialMembershipAddressValues: InitialMembershipAddressValues = {
			addressType: AddressTypeModel.PERSON,
			fields: [ firstName, lastName ],
			receipt: false,
			incentives: [],
		};
		await store.dispatch( action( 'membership_address', 'initializeAddress' ), initialMembershipAddressValues );

		const localWrapper = mount( Address, {
			props: {
				validateEmailUrl: 'validate-email',
				salutations: EXAMPLE_SALUTATIONS,
				dateOfBirthValidationPattern: dateOfBirthValidationPattern,
				validateAddressUrl: 'validate-address',
				countries: countries,
				addressValidationPatterns: addressValidationPatterns,
			},
			global: {
				plugins: [ store ],
				provide: {
					[ StoreKeyMembership as symbol ]: store,
				},
			},
		} );

		expect( localWrapper.find<HTMLInputElement>( '#first-name' ).element.value ).toBe( firstName.value );
		expect( localWrapper.find<HTMLInputElement>( '#last-name' ).element.value ).toBe( lastName.value );
		expect( store.state.membership_address.validity.firstName ).not.toBe( Validity.RESTORED );
		expect( store.state.membership_address.validity.lastName ).not.toBe( Validity.RESTORED );
	} );

} );
