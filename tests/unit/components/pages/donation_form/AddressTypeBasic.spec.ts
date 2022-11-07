import { createLocalVue, mount } from '@vue/test-utils';
import AddressTypeBasic from '@/components/pages/donation_form/AddressTypeBasic.vue';
import Buefy from 'buefy';
import { AddressTypeModel } from '@/view_models/AddressTypeModel';

const localVue = createLocalVue();
localVue.use( Buefy );

describe( 'AddressTypeBasic.vue', () => {
	it( 'emits field changed events', async () => {
		const wrapper = mount( AddressTypeBasic, {
				localVue,
				mocks: {
					$t: () => { },
				},
				propsData: {
					disabledAddressTypes: [],
				},
			} ),
			event = 'address-type';
		const person = wrapper.find( 'input[value=person]' );
		await person.trigger( 'change' );
		const company = wrapper.find( 'input[value=company]' );
		await company.trigger( 'change' );
		const anon = wrapper.find( 'input[value=anonymous]' );
		await anon.trigger( 'change' );

		expect( wrapper.emitted( event ) ).toHaveLength( 3 );
		expect( wrapper.emitted( event )![ 0 ] ).toEqual( [ AddressTypeModel.PERSON ] );
		expect( wrapper.emitted( event )![ 1 ] ).toEqual( [ AddressTypeModel.COMPANY ] );
		expect( wrapper.emitted( event )![ 2 ] ).toEqual( [ AddressTypeModel.ANON ] );
	} );

	it( 'disables anonymous address type if supplied via disabledAddressTypes property', async () => {
		const wrapper = mount( AddressTypeBasic, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: {
				disabledAddressTypes: [ AddressTypeModel.ANON, AddressTypeModel.PERSON ],
			},
		} );
		const person = wrapper.find( 'input[value=person]' );
		const company = wrapper.find( 'input[value=company]' );
		const anonymous = wrapper.find( 'input[value=anonymous]' );

		expect( person.attributes( 'disabled' ) ).toBe( undefined );
		expect( company.attributes( 'disabled' ) ).toBe( undefined );
		expect( anonymous.attributes( 'disabled' ) ).toBe( 'disabled' );
	} );

	it( 'renders hint only if payment is direct debit', () => {
		const wrapper = mount( AddressTypeBasic, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: {
				disabledAddressTypes: [ AddressTypeModel.ANON ],
				isDirectDebit: true,
			},
		} );
		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( true );
	} );

	it( 'does not render hint if payment is not direct debit', () => {
		const wrapper = mount( AddressTypeBasic, {
			localVue,
			mocks: {
				$t: () => { },
			},
			propsData: {
				disabledAddressTypes: [ AddressTypeModel.ANON ],
				isDirectDebit: false,
			},
		} );
		expect( wrapper.find( '.info-message' ).isVisible() ).toBe( false );
	} );
} );
