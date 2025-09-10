import { mount, VueWrapper } from '@vue/test-utils';
import Supporters from '@src/components/pages/Supporters.vue';

describe( 'Supporters.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( Supporters, {
			props: {
				pageTitle: 'Hall of fame',
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

	it( 'reacts to click events by showing and hiding supporter content', async () => {
		const wrapper = getWrapper();

		expect( wrapper.findAll( '.accordion-item' )[ 0 ].classes() ).not.toContain( 'accordion-item-open' );
		expect( wrapper.findAll( '.accordion-item' )[ 1 ].classes() ).not.toContain( 'accordion-item-open' );

		await wrapper.findAll( '.accordion-item button' )[ 0 ].trigger( 'click' );

		expect( wrapper.findAll( '.accordion-item' )[ 0 ].classes() ).toContain( 'accordion-item-open' );
		expect( wrapper.findAll( '.accordion-item' )[ 1 ].classes() ).not.toContain( 'accordion-item-open' );

		await wrapper.findAll( '.accordion-item button' )[ 1 ].trigger( 'click' );

		expect( wrapper.findAll( '.accordion-item' )[ 0 ].classes() ).not.toContain( 'accordion-item-open' );
		expect( wrapper.findAll( '.accordion-item' )[ 1 ].classes() ).toContain( 'accordion-item-open' );

		await wrapper.findAll( '.accordion-item button' )[ 1 ].trigger( 'click' );

		expect( wrapper.findAll( '.accordion-item' )[ 0 ].classes() ).not.toContain( 'accordion-item-open' );
		expect( wrapper.findAll( '.accordion-item' )[ 1 ].classes() ).not.toContain( 'accordion-item-open' );
	} );
} );
