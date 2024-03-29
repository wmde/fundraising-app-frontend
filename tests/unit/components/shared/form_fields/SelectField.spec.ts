import { mount, VueWrapper } from '@vue/test-utils';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';

describe( 'SelectField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( SelectField, {
			props: {
				label: 'select',
				name: 'select',
				modelValue: 'rolly',
				options: [
					{ value: 'bingo', label: 'Bingo' },
					{ value: 'rolly', label: 'Rolly' },
				],
			},
		} );
	};

	it( 'sets options', () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'option[value=bingo]' ).exists() ).toBeTruthy();
		expect( wrapper.find( 'option[value=rolly]' ).exists() ).toBeTruthy();
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const select = wrapper.find<HTMLSelectElement>( 'select' );

		expect( select.element.value ).toStrictEqual( 'rolly' );

		await wrapper.setProps( { modelValue: 'bingo' } );

		expect( select.element.value ).toStrictEqual( 'bingo' );
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find<HTMLSelectElement>( 'select' ).setValue( 'bingo' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'bingo' );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'select' );
	} );
} );
