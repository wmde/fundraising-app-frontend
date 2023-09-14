import { mount } from '@vue/test-utils';
import PaymentInterval from '@src/components/shared/PaymentInterval.vue';

const YEARLY = 12;
const testIntervals: Array<number> = [ 0, 1, 3, 6, YEARLY ];

describe( 'PaymentInterval.vue', () => {

	it( 'emits new interval when it is selected', async () => {
		const wrapper = mount( PaymentInterval, {
			props: {
				currentInterval: '0',
				paymentIntervals: testIntervals,
			},
		} );

		await wrapper.find( `#interval-${YEARLY} input` ).trigger( 'change' );

		expect( wrapper.emitted( 'interval-selected' ) ).toBeTruthy();
		expect( wrapper.emitted( 'interval-selected' )![ 0 ] ).toEqual( [ String( YEARLY ) ] );
	} );

	it( 'updates the selected interval when the incoming property changes', async () => {
		const wrapper = mount( PaymentInterval, {
			props: {
				paymentIntervals: testIntervals,
			},
		} );

		// explicitly simulate a prop change from outside of the wrapper
		wrapper.setProps( { currentInterval: '6' } );
		await wrapper.vm.$nextTick();

		expect( wrapper.vm.$data.selectedInterval ).toBe( '6' );
	} );

} );
