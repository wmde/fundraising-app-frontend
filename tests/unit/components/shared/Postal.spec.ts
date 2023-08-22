import { mount } from '@vue/test-utils';
import Postal from '@src/components/shared/Postal.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import countries from '@src/../tests/data/countries';
import { addressValidationPatterns } from '../../../data/validation';

function newTestProperties( overrides: Object ) {
	return Object.assign(
		{
			showError: {
				salutation: false,
				companyName: false,
				firstName: false,
				lastName: false,
				street: false,
				city: false,
				postcode: false,
			},
			formData: {
				salutation: {
					name: 'salutation',
					value: '',
					pattern: '^(Herr|Frau)$',
					optionalField: false,
				},
				title: {
					name: 'title',
					value: '',
					pattern: '',
					optionalField: true,
				},
				companyName: {
					name: 'companyName',
					value: '',
					pattern: '^.+$',
					optionalField: true,
				},
				firstName: {
					name: 'firstName',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				lastName: {
					name: 'lastName',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				street: {
					name: 'street',
					value: 'Testenhofen Ufer',
					pattern: '^.+$',
					optionalField: false,
				},
				city: {
					name: 'city',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				postcode: {
					name: 'postcode',
					value: '',
					pattern: '^.+$',
					optionalField: false,
				},
				country: {
					name: 'country',
					value: 'DE',
					pattern: '',
					optionalField: false,
				},
			},
			countries: countries,
			addressType: AddressTypeModel.PERSON,
			postCodeValidation: addressValidationPatterns.postcode,
		},
		overrides
	);
}

describe( 'Postal.vue', () => {
	it( 'shows street number warning if street field does not contain numbers', () => {
		const wrapper = mount( Postal, {
				props: newTestProperties( {} ),
			} ),
			street = wrapper.find( '#street' );
		street.trigger( 'blur' );
		expect( wrapper.vm.$data.showWarning ).toBe( true );
	} );

	it( 'emits field changed event on blur', () => {
		const wrapper = mount( Postal, {
				props: newTestProperties( {} ),
			} ),
			field = wrapper.find( '#post-code' );

		field.trigger( 'blur' );

		expect( wrapper.emitted( 'field-changed' )![ 0 ] ).toEqual( [ 'country' ] );
		expect( wrapper.emitted( 'field-changed' )![ 1 ] ).toEqual( [ 'postcode' ] );
	} );

	it( 'sets the correct postcode regex on country change', async () => {
		const wrapper = mount( Postal, {
			props: newTestProperties( {} ),
		} );

		await wrapper.setData( { country: countries[ 1 ] } );

		expect( wrapper.vm.$props.formData.postcode.pattern ).toEqual( countries[ 1 ].postCodeValidation );

		await wrapper.setData( { country: undefined } );

		expect( wrapper.vm.$props.formData.postcode.pattern ).toEqual( addressValidationPatterns.postcode );
	} );
} );
