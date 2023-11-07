import { shallowMount, VueWrapper } from '@vue/test-utils';
import AccordionItem from '@src/components/shared/AccordionItem.vue';
import ArrowUp from '@src/components/shared/icons/ArrowUp.vue';
import ArrowDown from '@src/components/shared/icons/ArrowDown.vue';

describe( 'AccordionItem.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( AccordionItem, {
			props: {
				title: 'Item title',
				content: 'Wolfman\'s got nards!',
			},
		} );
	};

	it( 'toggles open and close internally', async () => {
		const wrapper = getWrapper();

		expect( wrapper.classes() ).not.toContain( 'accordion-item-open' );

		await wrapper.find( 'button' ).trigger( 'click' );

		expect( wrapper.classes() ).toContain( 'accordion-item-open' );
	} );

	it( 'toggles open and close externally', async () => {
		const wrapper = getWrapper();

		expect( wrapper.classes() ).not.toContain( 'accordion-item-open' );

		await wrapper.setProps( { isOpen: true } );

		expect( wrapper.classes() ).toContain( 'accordion-item-open' );
	} );

	it( 'emits opened and closed events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'button' ).trigger( 'click' );
		await wrapper.find( 'button' ).trigger( 'click' );

		expect( wrapper.emitted( 'opened' ) ).toHaveLength( 1 );
		expect( wrapper.emitted( 'closed' ) ).toHaveLength( 1 );
	} );

	it( 'toggles arrow icons', async () => {
		const wrapper = getWrapper();

		expect( wrapper.findComponent( ArrowUp ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( ArrowDown ).exists() ).toBeTruthy();

		await wrapper.find( 'button' ).trigger( 'click' );

		expect( wrapper.findComponent( ArrowUp ).exists() ).toBeTruthy();
		expect( wrapper.findComponent( ArrowDown ).exists() ).toBeFalsy();
	} );

	it( 'does not toggle when content is empty', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { content: '' } );
		await wrapper.find( 'button' ).trigger( 'click' );

		expect( wrapper.classes() ).not.toContain( 'accordion-item-open' );
		expect( wrapper.findComponent( ArrowUp ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( ArrowDown ).exists() ).toBeFalsy();
	} );
} );
