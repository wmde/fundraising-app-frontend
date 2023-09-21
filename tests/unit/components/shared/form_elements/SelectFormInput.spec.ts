import { mount, VueWrapper } from '@vue/test-utils';
import SelectFormInput from '@src/components/shared/form_elements/SelectFormInput.vue';

describe( 'SelectFormInput.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( SelectFormInput, {
			props: {
				name: 'select',
				modelValue: 'rolly',
				selectId: 'select',
				disabled: false,
				required: false,
			},
			slots: {
				default: `<option value="bingo">Bingo</option><option value="rolly">Rolly</option>`,
			},
		} );
	};

	it( 'sets disabled', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'select' ).attributes( 'disabled' ) ).toBeUndefined();

		await wrapper.setProps( { disabled: true } );

		expect( wrapper.classes() ).toContain( 'is-disabled' );
		expect( wrapper.find( 'select' ).attributes( 'disabled' ) ).toBeDefined();
	} );

	it( 'sets required', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( 'select' ).attributes( 'required' ) ).toBeUndefined();

		await wrapper.setProps( { required: true } );

		expect( wrapper.find( 'select' ).attributes( 'required' ) ).toBeDefined();
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'select' ).setValue( 'bingo' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'bingo' );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();
		const select = wrapper.find<HTMLSelectElement>( 'select' );

		expect( select.element.value ).toStrictEqual( 'rolly' );

		await wrapper.setProps( { modelValue: 'bingo' } );

		expect( select.element.value ).toStrictEqual( 'bingo' );
	} );
} );
