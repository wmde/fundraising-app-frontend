import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';

const getWrapper = ( addressType: AddressTypeModel ) => {
	const store = new Vuex.Store( {
		modules: {
			[ 'address' ]: {
				namespaced: true,
				state: {
					addressType: addressType,
					values: {
						firstName: 'Victor',
						lastName: 'van Doom',
						salutation: 'Herr',
						title: 'Dr.',
						street: 'Untere Straße 5',
						postcode: '08114',
						city: 'Haasenstadt',
						country: 'DE',
						email: 'doom@untergang.biz',
					},
				},
				getters: {
					willGetNewsletter() {
						return true;
					},
					willGetReceipt() {
						return true;
					},
				},
			},
			[ 'bankdata' ]: {
				namespaced: true,
				state: {
					values: {
						accountNumber: 'DE12500105170648489890',
						bankCode: 'INGDDEFFXXX',
					},
				},
			},
			[ 'payment' ]: {
				namespaced: true,
				state: {
					values: {
						amount: '2349',
						interval: '3',
						type: 'BEZ',
					},
				},
			},
		},
	} );

	return mount( SubmitValues, {
		props: {
			trackingData: {
				bannerImpressionCount: 1,
				impressionCount: 5,
			},
			campaignValues: {
				campaign: 'nicholas',
				keyword: 'cage',
			},
		},
		global: {
			plugins: [ store ],
		},
	} );
};

describe( 'SubmitValues.vue', () => {
	it( 'renders input fields for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders input fields for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders input fields for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders the amount as an integer for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );
		expect( ( wrapper.find( 'input[name=amount]' ).element as HTMLInputElement ).value ).toBe( '2349' );
	} );

	it( 'renders the amount as an integer for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );
		expect( ( wrapper.find( 'input[name=amount]' ).element as HTMLInputElement ).value ).toBe( '2349' );
	} );

	it( 'renders the amount as an integer for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );
		expect( ( wrapper.find( 'input[name=amount]' ).element as HTMLInputElement ).value ).toBe( '2349' );
	} );

	it( 'renders the address type as string for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );
		expect( ( wrapper.find( 'input[name=addressType]' ).element as HTMLInputElement ).value ).toBe(
			addressTypeName( AddressTypeModel.ANON )
		);
	} );

	it( 'renders the address type as string for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );
		expect( ( wrapper.find( 'input[name=addressType]' ).element as HTMLInputElement ).value ).toBe(
			addressTypeName( AddressTypeModel.EMAIL )
		);
	} );

	it( 'renders the address type as string for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );
		expect( ( wrapper.find( 'input[name=addressType]' ).element as HTMLInputElement ).value ).toBe(
			addressTypeName( AddressTypeModel.PERSON )
		);
	} );

	it( 'sends tracking values for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );

		expect( ( wrapper.find( 'input[name=bImpCount]' ).element as HTMLInputElement ).value ).toBe( '1' );
		expect( ( wrapper.find( 'input[name=impCount]' ).element as HTMLInputElement ).value ).toBe( '5' );
	} );

	it( 'sends tracking values for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );

		expect( ( wrapper.find( 'input[name=bImpCount]' ).element as HTMLInputElement ).value ).toBe( '1' );
		expect( ( wrapper.find( 'input[name=impCount]' ).element as HTMLInputElement ).value ).toBe( '5' );
	} );

	it( 'sends tracking values for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );

		expect( ( wrapper.find( 'input[name=bImpCount]' ).element as HTMLInputElement ).value ).toBe( '1' );
		expect( ( wrapper.find( 'input[name=impCount]' ).element as HTMLInputElement ).value ).toBe( '5' );
	} );

	it( 'sends campaign values for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );

		expect( ( wrapper.find( 'input[name=piwik_campaign]' ).element as HTMLInputElement ).value ).toBe( 'nicholas' );
		expect( ( wrapper.find( 'input[name=piwik_kwd]' ).element as HTMLInputElement ).value ).toBe( 'cage' );
	} );

	it( 'sends campaign values for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );

		expect( ( wrapper.find( 'input[name=piwik_campaign]' ).element as HTMLInputElement ).value ).toBe( 'nicholas' );
		expect( ( wrapper.find( 'input[name=piwik_kwd]' ).element as HTMLInputElement ).value ).toBe( 'cage' );
	} );

	it( 'sends campaign values for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );

		expect( ( wrapper.find( 'input[name=piwik_campaign]' ).element as HTMLInputElement ).value ).toBe( 'nicholas' );
		expect( ( wrapper.find( 'input[name=piwik_kwd]' ).element as HTMLInputElement ).value ).toBe( 'cage' );
	} );
} );
