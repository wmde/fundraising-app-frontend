import { createLocalVue, shallowMount } from '@vue/test-utils';
import SubscriptionConfirmation from '@/components/pages/SubscriptionConfirmation.vue'
import Vue from 'vue';

const localVue = createLocalVue();

describe('SubscriptionConfirmation',()=>{
	it( 'renders success message by default (when there is no error)', () => {
	const wrapper = shallowMount(SubscriptionConfirmation,{
		mocks: {
			$t: ( key: string ) => key,
		},
	})
		expect( wrapper.find( '.success-message' ).exists() ).toBe( true )
} );

	it( 'renders success message when the error is "subscription was already confirmed.")', () => {
		const wrapper = shallowMount( SubscriptionConfirmation,{
			propsData: {
					errorMessage: "subscription_already_confirmed"
				},
			mocks: {
					$t: ( key: string ) => key,
				},
		})
		expect( wrapper.find( '.success-message' ).exists() ).toBe( true )
	} );

	it( 'renders error message', () => {
		const wrapper = shallowMount( SubscriptionConfirmation,{
			propsData: {
				errorMessage: "any error"
			},
			mocks: {
				$t: ( key: string ) => key,
			},
		})
		const errorMessage=wrapper.find( '.error-message' )
		expect( errorMessage.exists() ).toBe( true)
		expect( errorMessage.text() ).toBe( 'any error')
		expect( wrapper.find( '.success-message' ).exists() ).toBe( false )
	} );
})
