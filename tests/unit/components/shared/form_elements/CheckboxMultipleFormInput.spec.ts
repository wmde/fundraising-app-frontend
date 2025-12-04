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

	describe( 'functionality tests', () => {
		it( 'sets disabled', async () => {
			const wrapper = getWrapper();

			expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeUndefined();

			await wrapper.setProps( { disabled: true } );

			expect( wrapper.find<HTMLInputElement>( 'input' ).attributes( 'disabled' ) ).toBeDefined();
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

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper();
			expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

			await wrapper.setProps( { ariaDescribedby: 'describedby-label' } );

			expect( wrapper.find( 'input' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'describedby-label' );
		} );
	} );
} );
