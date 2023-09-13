import { mount, VueWrapper } from '@vue/test-utils';
import RadioFormInput from '@src/components/shared/form_inputs/RadioFormInput.vue';

describe( 'RadioFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( RadioFormInput, {
			props: {
				modelValue: '',
				nativeValue: 'elephant',
				name: '',
				disabled: false,
				required: false,
			},
		} );
	};

	it( 'sets disabled', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

		await wrapper.setProps( { disabled: true } );

		expect( wrapper.classes() ).toContain( 'is-disabled' );
		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'sets required', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'required' ) ).toBeUndefined();

		await wrapper.setProps( { required: true } );

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'required' ) ).toBeDefined();
	} );

	it( 'emits on value change', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'elephant' );
	} );

	it( 'updates on model change', async () => {
		const wrapper = getWrapper();
		const radio = wrapper.find<HTMLInputElement>( 'input' );

		expect( radio.element.checked ).toBeFalsy();

		await wrapper.setProps( { modelValue: 'elephant' } );

		expect( radio.element.checked ).toBeTruthy();
	} );

	it( 'emits boolean values', async () => {
		const wrapper = mount( RadioFormInput, {
			props: {
				modelValue: false,
				nativeValue: true,
				name: '',
			},
		} );

		await wrapper.find( 'input' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( true );
	} );

	it( 'updates boolean on model change', async () => {
		const wrapper = mount( RadioFormInput, {
			props: {
				modelValue: false,
				nativeValue: true,
				name: '',
			},
		} );

		const radio = wrapper.find<HTMLInputElement>( 'input' );

		expect( radio.element.checked ).toBeFalsy();

		await wrapper.setProps( { modelValue: true } );

		expect( radio.element.checked ).toBeTruthy();
	} );
} );
