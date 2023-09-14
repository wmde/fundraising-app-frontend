import { mount, VueWrapper } from '@vue/test-utils';
import DateOfBirth from '@src/components/pages/membership_form/DateOfBirth.vue';
import { InputField } from '@src/view_models/Address';

const newDateImportFieldMetadata = ( value: string ): InputField => ( {
	name: 'date',
	optionalField: false,
	// The component doesn't use the validation pattern so we can leave it empty in this test
	pattern: '',
	value,
} );

describe( 'DateOfBirth.vue', () => {

	const getWrapper = ( date: string, showError: boolean ): VueWrapper<any> => {
		return mount( DateOfBirth, {
			props: {
				formData: {
					date: newDateImportFieldMetadata( date ),
				},
				showError,
			},
		} );
	};

	it( 'renders field', () => {
		const wrapper = getWrapper( '', false );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders error message', () => {
		const wrapper = getWrapper( '12/27/1987', true );
		expect( wrapper.element ).toMatchSnapshot();
	} );

} );
