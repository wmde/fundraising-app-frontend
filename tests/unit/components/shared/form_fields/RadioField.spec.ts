import { mount, VueWrapper } from '@vue/test-utils';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';

describe( 'RadioField.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return mount( RadioField, {
			props: {
				modelValue: 'mouse',
				label: '',
				name: 'animal',
				options: [
					{ value: 'mouse', label: 'Mouse', id: 'animal-0' },
					{ value: 'elephant', label: 'Elephant', id: 'animal-1' },
				],
				errorMessage: 'error_message',
				alignment: 'row',
			},
		} );
	};

	it( 'fill options', () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '#animal-0' ).exists() ).toBeTruthy();
		expect( wrapper.find( '#animal-1' ).exists() ).toBeTruthy();
	} );

	it( 'shows the error message', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( '.is-danger' ).exists() ).toBeTruthy();
		expect( wrapper.find( '.is-danger' ).text() ).toStrictEqual( 'error_message' );
	} );

	it( 'sets disabled options', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { disabled: [ 'elephant' ] } );

		expect( wrapper.find( '#animal-elephant.is-disabled' ) ).toBeTruthy();
	} );

	it( 'sets selected radio active', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.radio-form-input:first-child' ).classes() ).toContain( 'is-active' );
		expect( wrapper.find( '.radio-form-input:last-child' ).classes() ).not.toContain( 'is-active' );

		await wrapper.setProps( { modelValue: 'elephant' } );

		expect( wrapper.find( '.radio-form-input:first-child' ).classes() ).not.toContain( 'is-active' );
		expect( wrapper.find( '.radio-form-input:last-child' ).classes() ).toContain( 'is-active' );
	} );

	it( 'emits events', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#animal-1' ).trigger( 'change' );

		expect( wrapper.emitted( 'update:modelValue' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'update:modelValue' )[ 0 ][ 0 ] ).toStrictEqual( 'elephant' );
		expect( wrapper.emitted( 'field-changed' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'field-changed' )[ 0 ][ 0 ] ).toStrictEqual( 'animal' );
	} );

	it( 'updates value on model change', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( 'input[value=mouse]' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( 'input[value=elephant]' ).element.checked ).toBeFalsy();

		await wrapper.setProps( { modelValue: 'elephant' } );

		expect( wrapper.find<HTMLInputElement>( 'input[value=mouse]' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( 'input[value=elephant]' ).element.checked ).toBeTruthy();
	} );

	it( 'sets aria-describedby', async () => {
		const wrapper = getWrapper();
		expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 0 );

		await wrapper.setProps( { ariaDescribedby: 'help-text' } );

		expect( wrapper.findAll( '[aria-describedby]' ).length ).toStrictEqual( 2 );
		expect( wrapper.find( 'input[value=mouse]' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'help-text' );

		await wrapper.setProps( { showError: true } );

		expect( wrapper.find( 'input[value=mouse]' ).attributes( 'aria-describedby' ) ).toStrictEqual( 'help-text animal-error-message' );
	} );
} );
