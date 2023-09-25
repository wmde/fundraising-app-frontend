import { mount, VueWrapper } from '@vue/test-utils';
import MailingListField from '@src/components/shared/form_fields/MailingListField.vue';

describe( 'MailingListField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( MailingListField, {
			props: {
				modelValue: true,
			},
		} );
	};

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input' ).element.checked ).toBeTruthy();

		await wrapper.setProps( { modelValue: false } );

		expect( wrapper.find<HTMLInputElement>( 'input' ).element.checked ).toBeFalsy();
	} );

	it( 'emits on value change', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input' ).setValue( false );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( false );
	} );
} );
