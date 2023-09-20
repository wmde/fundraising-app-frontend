import { mount, VueWrapper } from '@vue/test-utils';
import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';

describe( 'CheckboxSingleFormInput.vue', () => {

	const getWrapper = ( modelValue: boolean ): VueWrapper<any> => {
		return mount( CheckboxSingleFormInput, {
			props: {
				modelValue,
				name: '',
				inputId: '',
				disabled: false,
				required: false,
			},
		} );
	};

	it( 'sets disabled', async () => {
		const wrapper = getWrapper( false );

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

		await wrapper.setProps( { disabled: true } );

		expect( wrapper.classes() ).toContain( 'is-disabled' );
		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'sets required', async () => {
		const wrapper = getWrapper( false );

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'required' ) ).toBeUndefined();

		await wrapper.setProps( { required: true } );

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'required' ) ).toBeDefined();
	} );

	it( 'emits on value change', async () => {
		const wrapper = getWrapper( true );

		await wrapper.find( 'input' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( true );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper( true );
		const radio = wrapper.find<HTMLInputElement>( 'input' );

		expect( radio.element.checked ).toBeTruthy();

		await wrapper.setProps( { modelValue: false } );

		expect( radio.element.checked ).toBeFalsy();
	} );
} );
