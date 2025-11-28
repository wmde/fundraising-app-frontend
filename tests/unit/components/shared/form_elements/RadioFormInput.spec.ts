import { mount, VueWrapper } from '@vue/test-utils';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';

describe( 'RadioFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( RadioFormInput, {
			props: {
				modelValue: '',
				nativeValue: 'elephant',
				name: '',
				id: '',
				disabled: false,
				required: false,
			},
		} );
	};

	describe( 'functionality tests', () => {
		it( 'sets checked', async () => {
			const wrapper = getWrapper();

			expect( wrapper.find<HTMLInputElement>( 'input' ).element.checked ).toBeFalsy();

			await wrapper.setProps( { modelValue: 'elephant' } );

			expect( wrapper.find<HTMLInputElement>( 'input' ).element.checked ).toBeTruthy();
		} );

		it( 'sets disabled', async () => {
			const wrapper = getWrapper();

			expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

			await wrapper.setProps( { disabled: true } );

			expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeDefined();
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
					id: '',
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
					id: '',
				},
			} );

			const radio = wrapper.find<HTMLInputElement>( 'input' );

			expect( radio.element.checked ).toBeFalsy();

			await wrapper.setProps( { modelValue: true } );

			expect( radio.element.checked ).toBeTruthy();
		} );

		it( 'emits blur event', async () => {
			const wrapper = mount( RadioFormInput, {
				props: {
					modelValue: false,
					nativeValue: true,
					name: '',
					id: '',
				},
			} );

			const radio = wrapper.find<HTMLInputElement>( 'input' );

			await radio.trigger( 'blur' );

			expect( wrapper.emitted( 'blur' ).length ).toStrictEqual( 1 );
		} );
	} );

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper();

			await wrapper.setProps( { ariaDescribedby: 'describedby-label' } );

			expect( wrapper.find( 'input' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'describedby-label' );
		} );
	} );
} );
