import { mount, createLocalVue } from '@vue/test-utils';
import ValueEqualsPlaceholderWarning from '@/components/shared/ValueEqualsPlaceholderWarning.vue';

const localVue = createLocalVue();

describe( 'ValueEqualsPlaceholderWarning', () => {
	it( 'shows when value exists in placeholders', () => {
		const wrapper = mount( ValueEqualsPlaceholderWarning, {
			localVue,
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				value: 'Balboa',
				placeholder: 'Balboa',
				warning: 'I want you to try to chase this little chicken',
			},
		} );

		expect( wrapper.find( '.help' ).exists() ).toBe( true );
		expect( wrapper.text() ).toContain( 'I want you to try to chase this little chicken' );
	} );

	it( 'shows when value exists in placeholders with multiple entries', () => {
		const wrapper = mount( ValueEqualsPlaceholderWarning, {
			localVue,
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				value: 'Balboa',
				placeholder: 'Rambo|Balboa',
				warning: 'I want you to try to chase this little chicken',
			},
		} );

		expect( wrapper.find( '.help' ).exists() ).toBe( true );
		expect( wrapper.text() ).toContain( 'I want you to try to chase this little chicken' );
	} );

	it( 'does not show when value does not exist in placeholders', () => {
		const wrapper = mount( ValueEqualsPlaceholderWarning, {
			localVue,
			mocks: {
				$t: ( key: string ) => key,
			},
			propsData: {
				value: 'Balboa',
				placeholder: 'Rambo',
				warning: 'You know what you are? A tomato',
			},
		} );

		expect( wrapper.find( '.help' ).exists() ).toBe( false );
		expect( wrapper.text() ).not.toContain( 'You know what you are? A tomato' );
	} );
} );
