import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createStore } from '@src/store/membership_applicant_update_store';
import MembershipAddressUpdateForm from '@src/components/pages/membership_confirmation/MembershipAddressUpdateForm.vue';
import { action } from '@src/store/util';
import { addressValidationPatterns } from '@test/data/validation';
import { sustainingMembershipConfirmationData, activeMembershipConfirmationData } from '@test/data/membershipConfirmationData';
import type { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Validity } from '@src/view_models/Validity';
import { Store } from 'vuex';
import type { MembershipApplicantResource } from '@src/api/MembershipApplicantResource';
import { errorSummaryItemIsFunctional } from '@test/unit/utils/errorSummaryItemIsFunctional';

const emptyAddress: MembershipAddress = {
	applicantType: 'person',
	salutation: '',
	title: '',
	firstName: '',
	lastName: '',
	fullName: '',
	companyName: '',
	streetAddress: '',
	postalCode: '',
	city: '',
	countryCode: '',
	email: '',
};

const inValidAddress: MembershipAddress = {
	...emptyAddress,
	email: 'not.a.real.email@domainlalalaxoxoxo.de',
};

const addressData = ( address: MembershipAddress, addressType: AddressTypeModel ) => {
	return {
		addressType,
		fields: [
			{ name: 'salutation', value: address.salutation, validity: Validity.INCOMPLETE },
			{ name: 'title', value: address.title, validity: Validity.INCOMPLETE },
			{ name: 'firstName', value: address.firstName, validity: Validity.INCOMPLETE },
			{ name: 'lastName', value: address.lastName, validity: Validity.INCOMPLETE },
			{ name: 'companyName', value: address.companyName, validity: Validity.INCOMPLETE },
			{ name: 'street', value: address.streetAddress, validity: Validity.INCOMPLETE },
			{ name: 'postcode', value: address.postalCode, validity: Validity.INCOMPLETE },
			{ name: 'city', value: address.city, validity: Validity.INCOMPLETE },
			{ name: 'country', value: address.countryCode, validity: Validity.INCOMPLETE },
			{ name: 'email', value: address.email, validity: Validity.INCOMPLETE },
		],
	};
};

const defaultMembershipApplicantResource: MembershipApplicantResource = {
	put(): Promise<MembershipAddress> {
		return Promise.resolve( undefined );
	},
};

// This is so the error summary scrollIntoView doesn't throw errors
const errorSummaryScrollElement = { scrollIntoView: () => {} };
Object.defineProperty( document, 'getElementById', { writable: true, configurable: true, value: () => errorSummaryScrollElement } );

describe( 'MembershipAddressUpdateForm.vue', () => {
	const getWrapper = (
		store: Store<any>,
		confirmationData: any = sustainingMembershipConfirmationData,
		membershipApplicantResource: MembershipApplicantResource = defaultMembershipApplicantResource
	): VueWrapper<any> => {
		return mount( MembershipAddressUpdateForm, {
			props: {
				addressValidationPatterns: addressValidationPatterns,
				membership: confirmationData.membershipApplication,
				membershipApplicantResource: membershipApplicantResource,
				validateEmailUrl: '',
				validateAddressUrl: '',
				updateToken: confirmationData.updateToken,
				countries: confirmationData.countries,
				salutations: confirmationData.salutations,
			},
			global: {
				plugins: [ store ],
			},
		} );
	};

	it( 'prefills address data if it exists', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( sustainingMembershipConfirmationData.address, AddressTypeModel.PERSON )
		);

		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '[name="salutation"]' ).element.value ).toBe( sustainingMembershipConfirmationData.address.salutation );
		expect( wrapper.find<HTMLInputElement>( '#title' ).element.value ).toBe( sustainingMembershipConfirmationData.address.title );
		expect( wrapper.find<HTMLInputElement>( '#first-name' ).element.value ).toBe( sustainingMembershipConfirmationData.address.firstName );
		expect( wrapper.find<HTMLInputElement>( '#last-name' ).element.value ).toBe( sustainingMembershipConfirmationData.address.lastName );
		expect( wrapper.find<HTMLInputElement>( '#street' ).element.value ).toBe( sustainingMembershipConfirmationData.address.streetAddress );
		expect( wrapper.find<HTMLInputElement>( '#post-code' ).element.value ).toBe( sustainingMembershipConfirmationData.address.postalCode );
		expect( wrapper.find<HTMLInputElement>( '#city' ).element.value ).toBe( sustainingMembershipConfirmationData.address.city );
		expect( wrapper.find<HTMLInputElement>( '#country' ).element.value ).toBe( 'Deutschland' );
		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toBe( sustainingMembershipConfirmationData.address.email );
	} );

	it( 'shows the address type radio for a sustaining membership', () => {
		const store = createStore();
		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );

		expect( wrapper.find( '#address-form-type' ).exists() ).toBeTruthy();
	} );

	it( 'hides the address type radio for an active membership and defaults to person', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( emptyAddress, AddressTypeModel.COMPANY )
		);

		const wrapper = getWrapper( store, activeMembershipConfirmationData );

		await wrapper.vm.$nextTick();

		expect( wrapper.find( '#address-form-type' ).exists() ).toBeFalsy();
		expect( wrapper.find( '#first-name' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#company-name' ).exists() ).toBeFalsy();
	} );

	it( 'marks address type invalid if a sustaining membership is submitted without selecting', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( emptyAddress, AddressTypeModel.UNSET )
		);

		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '#address-form-type' ).attributes( 'data-error' ) ).toBeTruthy();
	} );

	it( 'marks empty address fields invalid if submitted after selecting address type', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( emptyAddress, AddressTypeModel.UNSET )
		);

		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		await wrapper.vm.$nextTick();

		expect( wrapper.find( '#address-form-first-name' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '#address-form-last-name' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '#address-form-street' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '#address-form-post-code' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '#address-form-city' ).attributes( 'data-error' ) ).toBeTruthy();
		expect( wrapper.find( '#address-form-email' ).attributes( 'data-error' ) ).toBeTruthy();
	} );

	it( 'shows error summary when there are validation errors', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( inValidAddress, AddressTypeModel.PERSON )
		);

		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
	} );

	it( 'shows and hides the error summary', async () => {
		vi.useFakeTimers();

		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( inValidAddress, AddressTypeModel.UNSET )
		);

		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );

		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();

		await wrapper.find( '#salutation-0' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '14059' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await wrapper.find( '#country' ).setValue( 'Deutschland' );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await vi.runAllTimersAsync();

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();

		vi.restoreAllMocks();
	} );

	it( 'has a functional person error summary', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( emptyAddress, AddressTypeModel.UNSET )
		);
		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );
		await wrapper.find( '#addressType-0' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'address-form-salutation' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'address-form-first-name' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'address-form-last-name' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'address-form-street' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'address-form-post-code' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'address-form-city' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'address-form-country' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'address-form-email' ) ).toBeTruthy();
	} );

	it( 'has a functional company error summary', async () => {
		const store = createStore();
		await store.dispatch(
			action( 'address', 'initializeAddress' ),
			addressData( { ...emptyAddress, applicantType: 'firma' }, AddressTypeModel.COMPANY )
		);
		const wrapper = getWrapper( store, sustainingMembershipConfirmationData );
		await wrapper.find( '#addressType-1' ).trigger( 'change' );
		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-name', 'address-form-company-name' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'address-form-street' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'address-form-post-code' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'address-form-city' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'address-form-country' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'address-form-email' ) ).toBeTruthy();
	} );

	it( 'displays an error if one is returned from the server', async () => {
		const store = createStore();
		store.dispatch = vi.fn().mockResolvedValue( { status: 'OK', messages: {} } );

		const error = 'Get outta that garden!';
		const membershipApplicantResource = {
			put: vi.fn().mockRejectedValue( error ),
		};

		const wrapper = getWrapper( store, sustainingMembershipConfirmationData, membershipApplicantResource );

		await wrapper.find( '#address-update-form' ).trigger( 'submit' );
		await flushPromises();

		expect( wrapper.find( '.server-message' ).exists() ).toBe( true );
		expect( wrapper.find( '.server-message' ).text() ).toStrictEqual( error );
	} );
} );
