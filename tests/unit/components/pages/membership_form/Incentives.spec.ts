import { mount } from '@vue/test-utils';
import Incentives from '@src/components/pages/membership_form/Incentives.vue';

describe( 'Incentives', () => {

	it( 'incentive checkbox is checked when set on initial render', async () => {
		const wrapper = mount( Incentives, {
			props: {
				message: '',
				incentiveChoices: [ 'tote_bag' ],
				defaultIncentives: [ 'tote_bag' ],
			},
		} );
		const checkBox = wrapper.find<HTMLInputElement>( '.incentive-tote_bag input' );

		expect( checkBox.element.checked ).toBeTruthy();
	} );

	it( 'incentive checkbox is not checked when not set on initial render', () => {
		const wrapper = mount( Incentives, {
			props: {
				message: '',
				incentiveChoices: [ 'tote_bag' ],
				defaultIncentives: [],
			},
		} );
		const checkBox = wrapper.find<HTMLInputElement>( '.incentive-tote_bag input' );

		expect( checkBox.element.checked ).toBeFalsy();
	} );

	it( 'emits toggle event on change', async () => {
		const wrapper = mount( Incentives, {
			props: {
				message: '',
				incentiveChoices: [ 'tote_bag' ],
				defaultIncentives: [ 'tote_bag' ],
			},
		} );
		const event = 'incentives-changed';
		const checkBox = wrapper.find( '.incentive-tote_bag input' );

		await checkBox.trigger( 'change' );
		expect( wrapper.emitted( event )![ 0 ] ).not.toBeUndefined();
	} );
} );
