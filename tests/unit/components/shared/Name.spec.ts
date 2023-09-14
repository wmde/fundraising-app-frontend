import { mount, VueWrapper } from '@vue/test-utils';
import Name from '@src/components/shared/Name.vue';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { nextTick } from 'vue';

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

describe( 'Name.vue', () => {

	const getWrapper = ( overrides: Object ): VueWrapper<any> => {
		return mount( Name, {
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

	it( 'adjusts salutation locale if needed', async () => {
		const testFormData = formData;
		testFormData.salutation = {
			name: 'salutation',
			value: 'Herr',
			pattern: '^(Herr|Frau|Mr|Ms)$',
			optionalField: false,
		};

		const wrapper = getWrapper( { formData: testFormData } );

		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#salutation-Mr input' ).element.checked ).toBeTruthy();
	} );
} );
