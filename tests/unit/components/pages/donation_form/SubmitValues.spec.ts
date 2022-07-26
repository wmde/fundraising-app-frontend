import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import SubmitValues from '@/components/pages/donation_form/SubmitValues.vue';
import { NS_BANKDATA, NS_ADDRESS, NS_PAYMENT } from '@/store/namespaces';
import { AddressTypeModel, addressTypeName } from '@/view_models/AddressTypeModel';

const localVue = createLocalVue();
localVue.use( Vuex );

const getWrapper = () => {
	return mount( SubmitValues, {
		localVue,
		propsData: {
			trackingData: {
				bannerImpressionCount: 1,
				impressionCount: 5,
			},
			campaignValues: {
				campaign: 'nicholas',
				keyword: 'cage',
			},
		},
		store: new Vuex.Store( {
			modules: {
				[ NS_ADDRESS ]: {
					namespaced: true,
					state: {
						receiptOptOut: false,
						newsletterOptIn: true,
						addressType: AddressTypeModel.PERSON,
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

				},
				[ NS_BANKDATA ]: {
					namespaced: true,
					state: {
						values: {
							iban: 'DE12500105170648489890',
							bic: 'INGDDEFFXXX',
						},
					},
				},
				[ NS_PAYMENT ]: {
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
		} ),
	} );
};

describe( 'SubmitValues.vue', () => {
	it( 'renders input fields', () => {
		const wrapper = getWrapper();
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders the amount as an integer', () => {
		const wrapper = getWrapper();
		expect( ( wrapper.find( 'input[name=amount]' ).element as HTMLInputElement ).value ).toBe( '2349' );
	} );

	it( 'renders the address type as string', () => {
		const wrapper = getWrapper();
		expect( ( wrapper.find( 'input[name=addressType]' ).element as HTMLInputElement ).value ).toBe( addressTypeName( AddressTypeModel.PERSON ) );
	} );

	it( 'sends tracking values', () => {
		const wrapper = getWrapper();

		expect( ( wrapper.find( 'input[name=bImpCount]' ).element as HTMLInputElement ).value ).toBe( '1' );
		expect( ( wrapper.find( 'input[name=impCount]' ).element as HTMLInputElement ).value ).toBe( '5' );
	} );

	it( 'sends campaign values', () => {
		const wrapper = getWrapper();

		expect( ( wrapper.find( 'input[name=piwik_campaign]' ).element as HTMLInputElement ).value ).toBe( 'nicholas' );
		expect( ( wrapper.find( 'input[name=piwik_kwd]' ).element as HTMLInputElement ).value ).toBe( 'cage' );
	} );
} );
