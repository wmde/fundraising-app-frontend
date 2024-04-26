import { mount } from '@vue/test-utils';
import IncentivesField from '@src/components/shared/form_fields/IncentivesField.vue';

describe( 'IncentivesField', () => {

	it( 'incentive checkbox is checked when set on initial render', async () => {
		const wrapper = mount( IncentivesField, {
			props: {
				incentiveFormFieldOptions: [ { value: 'tote_bag', label: 'some descriptive label', id: 'tote_bag' } ],
				modelValue: [ 'tote_bag' ],
			},
		} );
		const checkBox = wrapper.find<HTMLInputElement>( '.form-field-incentives input' );

		expect( checkBox.element.checked ).toBeTruthy();
	} );

	it( 'incentive checkbox is not checked when not set on initial render', () => {
		const wrapper = mount( IncentivesField, {
			props: {
				incentiveChoices: [ '' ],
				incentiveFormFieldOptions: [ { value: 'tote_bag', label: 'some descriptive label', id: 'tote_bag' } ],
				modelValue: [ '' ],
			},
		} );
		const checkBox = wrapper.find<HTMLInputElement>( '.form-field-incentives input' );

		expect( checkBox.element.checked ).toBeFalsy();
	} );

	it( 'emits toggle event on change', async () => {
		const wrapper = mount( IncentivesField, {
			props: {
				incentiveFormFieldOptions: [ { value: 'tote_bag', label: 'some descriptive label', id: 'tote_bag' } ],
				modelValue: [],
			},
		} );
		const event = 'update:modelValue';
		const checkBox = wrapper.find( '.form-field-incentives input' );

		await checkBox.setValue( true );

		expect( wrapper.emitted( event )![ 0 ] ).not.toBeUndefined();
		expect( wrapper.emitted( event ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( event )![ 0 ][ 0 ] ).toStrictEqual( [ 'tote_bag' ] );
	} );
} );
