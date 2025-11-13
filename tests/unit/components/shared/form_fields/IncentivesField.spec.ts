import { mount, VueWrapper } from '@vue/test-utils';
import IncentivesField from '@src/components/shared/form_fields/IncentivesField.vue';

describe( 'IncentivesField', () => {

	const getWrapper = ( modelValue: string[] ): VueWrapper<any> => {
		return mount( IncentivesField, {
			props: {
				incentiveFormFieldOptions: [ { value: 'tote_bag', label: 'some descriptive label', id: 'tote_bag' } ],
				modelValue,
			},
		} );
	};

	describe( 'functionality tests', () => {
		it( 'incentive checkbox is checked when set on initial render', async () => {
			const wrapper = getWrapper( [ 'tote_bag' ] );

			const checkBox = wrapper.find<HTMLInputElement>( '#tote_bag' );

			expect( checkBox.element.checked ).toBeTruthy();
		} );

		it( 'incentive checkbox is not checked when not set on initial render', async () => {
			const wrapper = getWrapper( [ '' ] );
			await wrapper.setProps( { incentiveChoices: [ '' ] } );

			const checkBox = wrapper.find<HTMLInputElement>( '#tote_bag' );

			expect( checkBox.element.checked ).toBeFalsy();
		} );

		it( 'emits toggle event on change', async () => {
			const wrapper = getWrapper( [] );
			const event = 'update:modelValue';

			await wrapper.find( '#tote_bag' ).setValue( true );

			expect( wrapper.emitted( event )![ 0 ] ).not.toBeUndefined();
			expect( wrapper.emitted( event ).length ).toStrictEqual( 1 );
			expect( wrapper.emitted( event )![ 0 ][ 0 ] ).toStrictEqual( [ 'tote_bag' ] );
		} );
	} );

	describe( 'accessibility tests', () => {
		it( 'sets aria-describedby', async () => {
			const wrapper = getWrapper( [] );
			expect( wrapper.find( '[aria-describedby]' ).exists() ).toBeFalsy();

			await wrapper.setProps( { ariaDescribedby: 'describedby-label' } );

			expect( wrapper.find( 'input' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'describedby-label' );
		} );
	} );
} );
