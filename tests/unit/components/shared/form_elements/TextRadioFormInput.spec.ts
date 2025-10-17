import { mount, VueWrapper } from '@vue/test-utils';
import TextRadioFormInput from '@src/components/shared/form_elements/TextRadioFormInput.vue';

describe( 'TextFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( TextRadioFormInput, {
			props: {
				inputType: 'text',
				name: 'input',
				modelValue: 'Hans Olo',
				autocomplete: 'on',
				inputId: 'input',
				placeholder: 'input',
				hasMessage: false,
				radioChecked: false,
				hasError: false,
				disabled: false,
				required: false,
			},
		} );
	};

	it( 'sets disabled', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'input[type="text"]' ).attributes( 'disabled' ) ).toBeUndefined();

		await wrapper.setProps( { disabled: true } );

		expect( wrapper.find( 'input[type="text"]' ).attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[type="text"]' ).trigger( 'focus' );
		await wrapper.find( 'input[type="text"]' ).setValue( 'Chewy' );
		await wrapper.find( 'input[type="text"]' ).trigger( 'blur' );
		await wrapper.find( '.text-radio__radio' ).trigger( 'click' );

		expect( wrapper.emitted( 'focus' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'Chewy' );
		expect( wrapper.emitted( 'input' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'blur' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'radioClicked' ).length ).toStrictEqual( 1 );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const input = wrapper.find<HTMLInputElement>( 'input[type="text"]' );

		expect( input.element.value ).toStrictEqual( 'Hans Olo' );

		await wrapper.setProps( { modelValue: 'Chewy' } );

		expect( input.element.value ).toStrictEqual( 'Chewy' );
	} );

	it( 'shows errors', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { hasError: true } );

		expect( wrapper.find( 'input[type="text"]' ).attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );
		expect( wrapper.find( 'input[type="text"]' ).classes() ).toContain( 'is-danger' );
		expect( wrapper.find( '.is-danger' ).exists() ).toBeTruthy();
	} );

	it( 'sets the radio checked', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.text-radio__radio' ).classes() ).not.toContain( 'text-radio__radio--checked' );

		await wrapper.setProps( { radioChecked: true } );

		expect( wrapper.find( '.text-radio__radio' ).classes() ).toContain( 'text-radio__radio--checked' );
	} );
} );
