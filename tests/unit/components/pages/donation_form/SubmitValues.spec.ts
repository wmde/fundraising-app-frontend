import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import SubmitValues from '@src/components/pages/donation_form/SubmitValues.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';
import { separator } from '@src/util/street_and_building_number_tools';

const getWrapper = ( addressType: AddressTypeModel, street: string = 'Untere Straße 5' ) => {
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
						street,
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
						iban: 'DE12500105170648489890',
						bic: 'INGDDEFFXXX',
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
		expect( wrapper.find<HTMLInputElement>( 'input[name=amount]' ).element.value ).toBe( '2349' );
	} );

	it( 'renders the amount as an integer for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );
		expect( wrapper.find<HTMLInputElement>( 'input[name=amount]' ).element.value ).toBe( '2349' );
	} );

	it( 'renders the amount as an integer for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );
		expect( wrapper.find<HTMLInputElement>( 'input[name=amount]' ).element.value ).toBe( '2349' );
	} );

	it( 'renders the address type as string for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );
		expect( wrapper.find<HTMLInputElement>( 'input[name=addressType]' ).element.value ).toBe(
			addressTypeName( AddressTypeModel.ANON )
		);
	} );

	it( 'renders the address type as string for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );
		expect( wrapper.find<HTMLInputElement>( 'input[name=addressType]' ).element.value ).toBe(
			addressTypeName( AddressTypeModel.EMAIL )
		);
	} );

	it( 'renders the address type as string for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );
		expect( wrapper.find<HTMLInputElement>( 'input[name=addressType]' ).element.value ).toBe(
			addressTypeName( AddressTypeModel.PERSON )
		);
	} );

	it( 'sends tracking values for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );

		expect( wrapper.find<HTMLInputElement>( 'input[name=bImpCount]' ).element.value ).toBe( '1' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=impCount]' ).element.value ).toBe( '5' );
	} );

	it( 'sends tracking values for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );

		expect( wrapper.find<HTMLInputElement>( 'input[name=bImpCount]' ).element.value ).toBe( '1' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=impCount]' ).element.value ).toBe( '5' );
	} );

	it( 'sends tracking values for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );

		expect( wrapper.find<HTMLInputElement>( 'input[name=bImpCount]' ).element.value ).toBe( '1' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=impCount]' ).element.value ).toBe( '5' );
	} );

	it( 'sends campaign values for ANON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.ANON );

		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_campaign]' ).element.value ).toBe( 'nicholas' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_kwd]' ).element.value ).toBe( 'cage' );
	} );

	it( 'sends campaign values for EMAIL address type', () => {
		const wrapper = getWrapper( AddressTypeModel.EMAIL );

		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_campaign]' ).element.value ).toBe( 'nicholas' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_kwd]' ).element.value ).toBe( 'cage' );
	} );

	it( 'sends campaign values for PERSON address type', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON );

		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_campaign]' ).element.value ).toBe( 'nicholas' );
		expect( wrapper.find<HTMLInputElement>( 'input[name=piwik_kwd]' ).element.value ).toBe( 'cage' );
	} );

	it( 'clears the street name and building number separator', () => {
		const wrapper = getWrapper( AddressTypeModel.PERSON, `sesame street${ separator }42` );

		expect( wrapper.find<HTMLInputElement>( 'input[name=street]' ).element.value ).toStrictEqual( 'sesame street 42' );
	} );
} );
