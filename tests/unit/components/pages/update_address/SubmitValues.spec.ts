import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from 'vuex';
import SubmitValues from '@src/components/pages/update_address/SubmitValues.vue';
import { AddressTypeModel, addressTypeName } from '@src/view_models/AddressTypeModel';

describe( 'SubmitValues.vue', () => {
	let wrapper: VueWrapper<any>;

	beforeEach( () => {
		const store = createStore( {
			modules: {
				[ 'address' ]: {
					namespaced: true,
					state: {
						receipt: true,
						newsletter: true,
						addressType: AddressTypeModel.PERSON,
						values: {
							firstName: 'Victoria',
							lastName: 'van Doom',
							salutation: 'Frau',
							title: 'Dr.',
							street: 'Untere Straße 5',
							postcode: '08114',
							city: 'Haasenstadt',
							country: 'DE',
							email: 'doom@untergang.biz',
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

		wrapper = mount( SubmitValues, {
			props: {
				trackingData: {
					bannerImpressionCount: 1,
					impressionCount: 5,
				},
			},
			global: {
				plugins: [ store ],
			},
		} );
	} );

	it( 'renders input fields', () => {
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders the address type as string', () => {
		const input = wrapper.find<HTMLInputElement>( 'input[name=addressType]' );
		expect( input.element.value ).toBe( addressTypeName( AddressTypeModel.PERSON ) );
	} );
} );
