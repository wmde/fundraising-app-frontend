import { mount, VueWrapper } from '@vue/test-utils';
import Supporters from '@src/components/pages/Supporters.vue';

describe( 'Supporters.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( Supporters, {
			props: {
				supporters: [
					{
						name: 'Test',
						amount: '1234,00 €',
						comment: 'Blah',
					},
					{
						name: 'Test 2',
						amount: '1234,00 €',
						comment: 'Blah 2',
					},
				],
			},
		} );
	};

	it( 'reacts to emitted supporter-opened event by setting the visible supporter ID', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '.accordion-item:nth-of-type(2) > div' ).trigger( 'click' );

		expect( wrapper.vm.$data.visibleSupporterId ).toBe( 1 );
	} );

	it( 'reacts to emitted supporter-closed event by setting the visible supporter ID to null', async () => {
		const wrapper = getWrapper();

		await wrapper.setData( { visibleSupporterId: 1 } );
		await wrapper.find( '.accordion-item:nth-of-type(2) > div' ).trigger( 'click' );

		expect( wrapper.vm.$data.visibleSupporterId ).toBeNull();
	} );
} );
