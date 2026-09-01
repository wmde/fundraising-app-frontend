import { describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import MailingListRadioField from '@src/components/shared/form_fields/MailingListRadioField.vue';

describe( 'MailingListRadioField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( MailingListRadioField, {
			props: {
				modelValue: true,
				inputId: 'newsletter',
			},
		} );
	};

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#newsletter-yes' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#newsletter-no' ).element.checked ).toBeFalsy();

		await wrapper.setProps( { modelValue: false } );

		expect( wrapper.find<HTMLInputElement>( '#newsletter-yes' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#newsletter-no' ).element.checked ).toBeTruthy();
	} );

	it( 'emits on value change', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#newsletter-no' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( false );
	} );
} );
