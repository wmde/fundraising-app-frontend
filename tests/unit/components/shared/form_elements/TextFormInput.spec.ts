import { mount, VueWrapper } from '@vue/test-utils';
import TextFormInput from '@src/components/shared/form_elements/TextFormInput.vue';

describe( 'TextFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( TextFormInput, {
			props: {
				inputType: 'text',
				name: 'input',
				modelValue: 'Hans Olo',
				autocomplete: 'on',
				inputId: 'input',
				placeholder: 'input',
				hasMessage: false,
				hasError: false,
				disabled: false,
			},
		} );
	};

	it( 'displays input field', () => {
		expect( getWrapper().find( 'input[type=text]' ).exists() ).toBeTruthy();
	} );

	it( 'displays textarea field', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { inputType: 'textarea' } );

		expect( wrapper.find( 'textarea' ).exists() ).toBeTruthy();
	} );

	it( 'sets disabled', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

		await wrapper.setProps( { disabled: true } );

		expect( wrapper.find( 'input' ).attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).trigger( 'focus' );
		await wrapper.find( 'input' ).setValue( 'Chewy' );
		await wrapper.find( 'input' ).trigger( 'blur' );

		expect( wrapper.emitted( 'focus' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'Chewy' );
		expect( wrapper.emitted( 'input' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'blur' ).length ).toStrictEqual( 1 );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const input = wrapper.find<HTMLInputElement>( 'input' );

		expect( input.element.value ).toStrictEqual( 'Hans Olo' );

		await wrapper.setProps( { modelValue: 'Chewy' } );

		expect( input.element.value ).toStrictEqual( 'Chewy' );
	} );

	it( 'shows errors', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { hasError: true } );

		expect( wrapper.find( 'input' ).attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );

		await wrapper.setProps( { inputType: 'textarea' } );

		expect( wrapper.find( 'textarea' ).attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );
	} );
} );
