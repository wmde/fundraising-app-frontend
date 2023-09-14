import { mount } from '@vue/test-utils';
import Supporter from '@src/components/pages/supporters/Supporter.vue';

describe( 'Supporter.vue', () => {
	it( 'shows comment and flips arrow icon if visible supporter ID matches local supporter ID', () => {
		const sampleText = 'Blah blah!';
		const wrapper = mount( Supporter, {
			props: {
				content: {
					name: 'Some Donor',
					amount: '2019,00 €',
					comment: sampleText,
				},
				visibleSupporterId: 5,
				supporterId: 5,
			},
		} );
		expect( wrapper.find( '.mdi-arrow-up' ).isVisible() ).toBe( true );
		expect( wrapper.find( '.accordion-content' ).isVisible() ).toBe( true );
		expect( wrapper.find( '.accordion-content' ).text() ).toMatch( sampleText );
	} );

	it( 'emits the open event on click if a comment is supplied', () => {
		const wrapper = mount( Supporter, {
			props: {
				content: {
					name: 'Some Donor',
					amount: '2019,00 €',
					comment: 'Blahblah!',
				},
				visibleSupporterId: null,
				supporterId: 5,
			},
		} );
		wrapper.find<HTMLElement>( '.accordion-item > div' ).element.click();

		expect( wrapper.emitted( 'supporter-opened', ) ).toHaveLength( 1 );
		expect( wrapper.emitted( 'supporter-opened' )![ 0 ] ).toEqual( [ 5 ] );
		expect( wrapper.emitted( 'supporter-closed', ) ).toBeFalsy();
	} );

	it( 'emits a close event on click if comment is supplied and comment is open', () => {
		const wrapper = mount( Supporter, {
			props: {
				content: {
					name: 'Some Donor',
					amount: '2019,00 €',
					comment: 'Blahblah!',
				},
				visibleSupporterId: 5,
				supporterId: 5,
			},
		} );
		wrapper.find<HTMLElement>( '.accordion-item > div' ).element.click();

		expect( wrapper.emitted( 'supporter-opened', ) ).toBeFalsy();
		expect( wrapper.emitted( 'supporter-closed', ) ).toBeTruthy();
	} );

	it( 'does not show a comment if the visible supporter ID does not match ID of the current supporter', () => {
		const sampleText = 'Blah blah!';
		const wrapper = mount( Supporter, {
			props: {
				content: {
					name: 'Some Donor',
					amount: '2019,00 €',
					comment: sampleText,
				},
				visibleSupporterId: 123,
				supporterId: 5,
			},
		} );
		expect( wrapper.find( '.mdi-arrow-down' ).isVisible() ).toBe( true );
		expect( wrapper.find( '.accordion-content' ).isVisible() ).toBe( false );
	} );

	it( 'disables comment functionality and hides arrows if no comment is supplied', () => {
		const wrapper = mount( Supporter, {
			props: {
				content: {
					name: 'Some Donor',
					amount: '2019,00 €',
					comment: '',
				},
				visibleSupporterId: null,
				supporterId: 5,
			},
		} );

		expect( wrapper.find( '.mdi-arrow-up' ).exists() ).toBe( false );
		expect( wrapper.find( '.mdi-arrow-down' ).exists() ).toBe( false );

		wrapper.find<HTMLElement>( '.accordion-item > div' ).element.click();
		expect( wrapper.emitted( 'supporter-opened', ) ).toBeFalsy();
		expect( wrapper.emitted( 'supporter-closed', ) ).toBeFalsy();
	} );
} );
