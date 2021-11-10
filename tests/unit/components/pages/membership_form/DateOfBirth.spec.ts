import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Buefy from 'buefy';
import DateOfBirth from '@/components/pages/membership_form/DateOfBirth.vue';
import { createStore } from '@/store/membership_store';
import { InputField } from '@/view_models/Address';

const localVue = createLocalVue();
localVue.use( Buefy );
localVue.use( Vuex );

const newDateImportFieldMetadata = ( value: string ): InputField => ( {
	name: 'date',
	optionalField: false,
	// The component doesn't use the validation pattern so we can leave it empty in this test
	pattern: '',
	value,
} );

describe( 'DateOfBirth.vue', () => {

	it( 'renders field', () => {
		const wrapper = mount( DateOfBirth, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => { },
			},
			propsData: {
				formData: {
					date: newDateImportFieldMetadata( '' ),
				},
			},
		} );
		expect( wrapper.element ).toMatchSnapshot();
	} );

	it( 'renders error message', () => {
		const wrapper = mount( DateOfBirth, {
			localVue,
			store: createStore(),
			mocks: {
				$t: () => { },
			},
			propsData: {
				formData: {
					date: newDateImportFieldMetadata( '12/27/1987' ),
				},
				showError: true,
			},
		} );
		expect( wrapper.element ).toMatchSnapshot();
	} );

} );
