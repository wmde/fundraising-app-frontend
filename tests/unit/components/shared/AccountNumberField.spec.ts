import AccountNumberField from '@src/components/shared/AccountNumberField.vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';

const IBAN_VALUE = 'DE12500105170648489890';
const IBAN_DISPLAY = 'DE12 5001 0517 0648 4898 90';

describe( 'AccountNumberField.vue', () => {

	const getWrapper = ( accountId: string = '' ): VueWrapper<any> => {
		return mount( AccountNumberField, {
			props: {
				placeholder: '',
				accountId,
			},
		} );
	};

	it( 'Sets the initial value when mounted', async () => {
		const wrapper = getWrapper( IBAN_VALUE );

		await nextTick();

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toBe( IBAN_DISPLAY );
	} );

	it( 'inserts spaces into field every 4 characters', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { accountId: IBAN_VALUE } );

		expect( wrapper.find<HTMLInputElement>( '#iban' ).element.value ).toBe( IBAN_DISPLAY );
	} );

	it( 'emits input event', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#iban' );

		await field.setValue( IBAN_VALUE );

		const emitted = wrapper.emitted( 'input' );

		if ( emitted === undefined ) {
			fail( 'the event did not fire' );
		} else {
			expect( emitted.length ).toBe( 1 );
			expect( emitted[ 0 ][ 0 ] ).toEqual( IBAN_VALUE );
		}
	} );

	it( 'emits validate event', async () => {
		const wrapper = getWrapper();
		const field = wrapper.find<HTMLInputElement>( '#iban' );

		await field.setValue( IBAN_VALUE );
		await field.trigger( 'blur' );

		expect( wrapper.emitted( 'validate' )?.length ).toBe( 1 );
	} );
} );
