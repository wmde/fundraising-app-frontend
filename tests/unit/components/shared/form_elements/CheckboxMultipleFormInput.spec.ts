import { mount, VueWrapper } from '@vue/test-utils';
import CheckboxMultipleFormInput from '@src/components/shared/form_elements/CheckboxMultipleFormInput.vue';

describe( 'CheckboxMultipleFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( CheckboxMultipleFormInput, {
			props: {
				modelValue: [],
				nativeValue: 'pike',
				name: 'captain',
				inputId: 'captain',
				disabled: false,
				required: false,
			},
		} );
	};

	it( 'sets disabled', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

		const labelElement = wrapper.find<HTMLElement>( '.checkbox' );
		await wrapper.setProps( { disabled: true } );

		expect( labelElement.classes() ).toContain( 'is-disabled' );
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

		await wrapper.find( 'input' ).setValue();

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( [ 'pike' ] );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const radio = wrapper.find<HTMLInputElement>( 'input' );

		expect( radio.element.checked ).toBeFalsy();

		await wrapper.setProps( { modelValue: [ 'pike' ] } );

		expect( radio.element.checked ).toBeTruthy();
	} );
} );
