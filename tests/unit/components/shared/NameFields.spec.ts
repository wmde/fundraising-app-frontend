import { mount, VueWrapper } from '@vue/test-utils';
import NameFields from '@src/components/shared/NameFields.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Salutation } from '@src/view_models/Salutation';
import { AddressFormData, AddressValidity } from '@src/view_models/Address';

const formData = {
	salutation: {
		name: 'salutation',
		value: '',
		pattern: '^(Herr|Frau|Mr|Ms)$',
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
		value: '',
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
};

interface Props {
	addressType: AddressTypeModel
	salutations: Salutation[];
	formData: AddressFormData;
	showError: AddressValidity;
}

describe( 'NameFields.vue', () => {

	const getWrapper = ( overrides: Partial<Props> ): VueWrapper<any> => {
		return mount( NameFields, {
			props: Object.assign(
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
					formData: formData,
					addressType: AddressTypeModel.PERSON,
					salutations: [
						{
							label: 'Mr',
							value: 'Mr',
						},
						{
							label: 'Ms',
							value: 'Ms',
						},
					],
				},
				overrides
			),
		} );
	};

	it( 'emits field changed event on blur', () => {
		const wrapper = getWrapper( {} );
		const event = 'field-changed';
		const first = wrapper.find( '#first-name' );

		first.trigger( 'blur' );

		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ 'firstName' ] );
	} );

	it( 'hides personal name fields when address type is company', () => {
		const wrapper = getWrapper( { addressType: AddressTypeModel.COMPANY } );

		expect( wrapper.find( '#first-name' ).exists() ).toBe( false );
		expect( wrapper.find( '#last-name' ).exists() ).toBe( false );
		expect( wrapper.find( 'input[name=salutation]' ).exists() ).toBe( false );
		expect( wrapper.find( '#title' ).exists() ).toBe( false );
		expect( wrapper.find( '#company-name' ).exists() ).toBe( true );
	} );

	it( 'hides company name fields when address type personal', () => {
		const wrapper = getWrapper( { addressType: AddressTypeModel.PERSON } );

		expect( wrapper.find( '#first-name' ).exists() ).toBe( true );
		expect( wrapper.find( '#last-name' ).exists() ).toBe( true );
		expect( wrapper.find( 'input[name=salutation]' ).exists() ).toBe( true );
		expect( wrapper.find( '#title' ).exists() ).toBe( true );
		expect( wrapper.find( '#company-name' ).exists() ).toBe( false );
	} );

} );
