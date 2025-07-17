import { mount } from '@vue/test-utils';
import DonorSummary from '@src/components/pages/donation_form/DonorSummary.vue';
import type { Address } from '@src/view_models/Address';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

describe( 'DonorSummary.vue', () => {
	const countries: Country[] = [
		{
			'countryCode': 'DE',
			'countryFullName': 'Deutschland',
			'group': '',
			'postCodeValidation': '^[0-9]{5}$',
		},
		{
			'countryCode': 'AT',
			'countryFullName': 'Österreich',
			'group': '',
			'postCodeValidation': '^[0-9]{4}$',
		},
	];

	const salutations: Salutation[] = [
		{
			label: 'Herr',
			value: 'Herr',
			display: 'Herr',
			greetings: {
				formal: 'Herr',
				informal: 'Herr',
				lastNameInformal: 'Herr',
			},
		},
		{
			label: 'Frau',
			value: 'Frau',
			display: 'Frau',
			greetings: {
				formal: 'Frau',
				informal: 'Frau',
				lastNameInformal: 'Frau',
			},
		},
	];

	const personalAddress: Address = {
		addressType: 'person',
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		street: 'Blutgasse 5',
		postcode: '80666',
		city: 'München',
		country: 'DE',
		email: 'vlad@gmail.com',
		companyName: '',
	};

	const companyAddress: Address = {
		addressType: 'firma',
		salutation: '',
		title: '',
		firstName: '',
		lastName: '',
		fullName: '',
		street: 'Company Straße 2',
		postcode: '12345',
		city: 'Berlin',
		country: 'DE',
		email: 'vlad-company@gmail.com',
		companyName: 'Vlad Company',
	};

	const companyAddressWithAllFieldsFilledOut: Address = {
		addressType: 'firma',
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		companyName: 'Vlad Company',
		street: 'Company Straße 2',
		postcode: '12345',
		city: 'Berlin',
		country: 'DE',
		email: 'vlad-company@gmail.com',
	};

	const personalAddressWithAllFieldsFilledOut: Address = {
		addressType: 'person',
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		companyName: 'Some Company',
		street: 'Company Straße 2',
		postcode: '12345',
		city: 'Berlin',
		country: 'DE',
		email: 'vlad-company@gmail.com',
	};

	// This can happen when a user fills out all the fields and switches to '(donate as ) anonymous'
	const anonymousAddressWithAllFieldsFilledOut: Address = {
		addressType: 'anonym',
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		companyName: 'Vlad Company',
		street: 'Blutgasse 5',
		postcode: '80666',
		city: 'München',
		country: 'DE',
		email: 'vlad@gmail.com',
	};

	const unsetAddressWithAllFieldsFilledOut: Address = {
		addressType: '',
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		companyName: 'Vlad Company',
		street: 'Blutgasse 5',
		postcode: '80666',
		city: 'München',
		country: 'DE',
		email: 'vlad@gmail.com',
	};

	const mocks = {
		$t: ( key: string ) => key,
	};

	function mountWrapper( address: Address ) {
		return mount( DonorSummary, {
			props: {
				address,
				countries,
				salutations,
			},
			global: {
				mocks,
			},
		} );
	}

	it( 'renders the contact‐data header', () => {
		const wrapper = mountWrapper( personalAddress );
		expect( wrapper.find( 'h3.summary-title' ).text() ).toBe( 'donation_summary_contact_data_header' );
	} );

	it( 'renders companyName in bold when provided for firma address', () => {
		const wrapper = mountWrapper( companyAddress );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();
		expect( strong.exists() ).toBe( true );
		expect( text ).toBe( 'Vlad Company' );
		expect( text ).not.toBe( 'Dr. Dracul' );
	} );

	it( 'renders first name and last name in bold when neither salutation nor title is provided', () => {
		const missingSalutationTitleAddress = { ...personalAddress, salutation: '', title: '' };
		const wrapper = mountWrapper( missingSalutationTitleAddress );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();

		expect( strong.exists() ).toBe( true );
		expect( text ).toBe( 'Vlad Dracul' );
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).not.toContain( '"key":"address_salutation_academic_title"' );
	} );

	it( 'does NOT render salutation/title/name if firstName is missing', () => {
		const firstNameMissingAddress = { ...personalAddress, firstName: '' };
		const firstNameMissingWrapper = mountWrapper( firstNameMissingAddress );

		expect( firstNameMissingWrapper.find( 'strong' ).exists() ).toBe( false );
	} );

	it( 'does NOT render salutation/title/name if lastName is missing', () => {
		const lastNameMissingAddress = { ...personalAddress, lastName: '' };
		const lastNameMissingWrapper = mountWrapper( lastNameMissingAddress );

		expect( lastNameMissingWrapper.find( 'strong' ).exists() ).toBe( false );
	} );

	it( 'renders personal name in bold with "academic" localization key when BOTH salutation and title are present ', () => {
		const wrapper = mountWrapper( personalAddress );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();

		expect( strong.exists() ).toBe( true );
		expect( text ).toContain(
			'{"key":"address_salutation_academic_title","salutation":"Herr","title":"Dr."}'
		);
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).toContain( 'Vlad Dracul' );
	} );

	it( 'renders personal name in bold with "academic" localization key when title is present, even if salutation is empty', () => {
		const missingSalutationAddress = { ...personalAddress, salutation: '' };
		const wrapper = mountWrapper( missingSalutationAddress );
		const strong = wrapper.find( 'strong' );
		expect( strong.exists() ).toBe( true );
		const text = strong.text();

		expect( text ).toContain(
			'{"key":"address_salutation_academic_title","salutation":"","title":"Dr."}'
		);
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).toContain( 'Vlad Dracul' );
	} );

	it( 'renders personal name in bold WITHOUT "academic" localization key when only salutation is present, and title is empty', () => {
		const noAcademicAddress = { ...personalAddress, title: '' };
		const wrapper = mountWrapper( noAcademicAddress );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();

		expect( strong.exists() ).toBe( true );
		expect( text ).toContain(
			'{"key":"address_salutation_no_academic_title","salutation":"Herr","title":""}'
		);
		expect( text ).not.toContain( '"key":"address_salutation_academic_title"' );
		expect( text ).toContain( 'Vlad Dracul' );
	} );

	it( 'does not render any salutation key when the user picks "No Specification"', () => {
		const noSpecificationAddress: Address = {
			...personalAddress,
			salutation: 'No Title',
			title: '',
			firstName: 'Vlad',
			lastName: 'Dracul',
		};

		const wrapper = mountWrapper( noSpecificationAddress );
		const text = wrapper.find( 'strong' ).text();

		expect( text ).not.toContain( '"key":"address_salutation_academic_title"' );
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).toBe( 'Vlad Dracul' );
	} );

	it( 'renders only the academic title (no salutation) when salutation="No Title" but title is set', () => {
		const profAddress: Address = {
			...personalAddress,
			salutation: 'No Title',
			title: 'Prof.',
			firstName: 'Vlad',
			lastName: 'Dracul',
		};

		const wrapper = mountWrapper( profAddress );
		const text = wrapper.find( 'strong' ).text();

		expect( text ).toContain(
			'{"key":"address_salutation_academic_title","salutation":"","title":"Prof."}'
		);
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).toContain( 'Vlad Dracul' );
	} );

	it( 'renders street even when postcode is missing', () => {
		const missingPostcodeAddress = { ...personalAddress, postcode: '' };
		const wrapperMissingPostcodeAddress = mountWrapper( missingPostcodeAddress );
		const missingPostcodeAddressText = wrapperMissingPostcodeAddress.text();

		expect( missingPostcodeAddressText ).toContain( 'Blutgasse 5' );
	} );

	it( 'renders street even when city is missing', () => {
		const missingCityAddress = { ...personalAddress, city: '' };
		const wrapperMissingCityAddress = mountWrapper( missingCityAddress );
		const missingCityAddressText = wrapperMissingCityAddress.text();

		expect( missingCityAddressText ).toContain( 'Blutgasse 5' );
	} );

	it( 'renders street even when postcode AND city are missing', () => {
		const missingPostcodeCityAddress = { ...personalAddress, postcode: '', city: '' };
		const wrapperMissingPostcodeCityAddress = mountWrapper( missingPostcodeCityAddress );
		const missingPostcodeCityAddressText = wrapperMissingPostcodeCityAddress.text();

		expect( missingPostcodeCityAddressText ).toContain( 'Blutgasse 5' );
	} );

	it( 'renders postcode+city only when BOTH postcode and city are provided', () => {
		const wrapper = mountWrapper( personalAddress );
		const text = wrapper.text();
		expect( text ).toContain( '80666 München' );
	} );

	it( 'does NOT render postcode+city if postcode is missing', () => {
		const missingPostcodeAddress = { ...personalAddress, postcode: '' };
		const wrapperMissingPostcodeAddress = mountWrapper( missingPostcodeAddress );
		const missingPostcodeAddressText = wrapperMissingPostcodeAddress.text();

		expect( missingPostcodeAddressText ).not.toContain( 'München' );
	} );

	it( 'does NOT render postcode+city if city is missing', () => {
		const missingCityAddress = { ...personalAddress, city: '' };
		const wrapperMissingCityAddress = mountWrapper( missingCityAddress );
		const missingCityAddressText = wrapperMissingCityAddress.text();

		expect( missingCityAddressText ).not.toContain( '80666' );
	} );

	it( 'renders country when BOTH postcode+city are provided', () => {
		const wrapper = mountWrapper( personalAddress );
		const text = wrapper.text();
		expect( text ).toContain( 'Deutschland' );
	} );

	it( 'does NOT render country if postcode is missing', () => {
		const missingPostcodeAddress = { ...personalAddress, postcode: '' };
		const wrapperMissingPostcodeAddress = mountWrapper( missingPostcodeAddress );
		const missingPostcodeAddressText = wrapperMissingPostcodeAddress.text();

		expect( missingPostcodeAddressText ).not.toContain( 'Deutschland' );
	} );

	it( 'does NOT render country if city is missing', () => {
		const missingCityAddress = { ...personalAddress, city: '' };
		const wrapperMissingCityAddress = mountWrapper( missingCityAddress );
		const missingCityAddressText = wrapperMissingCityAddress.text();

		expect( missingCityAddressText ).not.toContain( 'Deutschland' );
	} );

	it( 'renders email if provided', () => {
		const wrapper = mountWrapper( personalAddress );
		expect( wrapper.text() ).toContain( 'vlad@gmail.com' );
	} );

	it( 'does NOT render email when not provided', () => {
		const missingEmailAddress = { ...personalAddress, email: '' };
		const wrapper = mountWrapper( missingEmailAddress );
		expect( wrapper.text() ).not.toContain( 'vlad@gmail.com' );
	} );

	it( 'renders all address lines and email when full address is provided', () => {
		const wrapper = mountWrapper( personalAddress );
		const text = wrapper.text();

		expect( text ).toContain( 'donation_summary_contact_data_header' );
		expect( text ).toContain(
			'{"key":"address_salutation_academic_title","salutation":"Herr","title":"Dr."}'
		);
		expect( text ).not.toContain( '"key":"address_salutation_no_academic_title"' );
		expect( text ).toContain( 'Vlad Dracul' );
		expect( text ).toContain( 'Blutgasse 5' );
		expect( text ).toContain( '80666 München' );
		expect( text ).toContain( 'Deutschland' );
		expect( text ).toContain( 'vlad@gmail.com' );
	} );

	it( 'does not render personal details for FIRMA address even if provided', () => {
		const wrapper = mountWrapper( companyAddressWithAllFieldsFilledOut );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();
		expect( strong.exists() ).toBe( true );
		expect( text ).toBe( 'Vlad Company' );
		expect( text ).not.toContain( 'Dracul' );
		expect( text ).not.toContain( 'Herr' );
		expect( text ).not.toContain( 'Dr.' );
	} );

	it( 'does not render companyName for PERSON address even if provided', () => {
		const wrapper = mountWrapper( personalAddressWithAllFieldsFilledOut );
		const strong = wrapper.find( 'strong' );
		const text = strong.text();
		expect( strong.exists() ).toBe( true );
		expect( text ).toContain( 'Vlad Dracul' );
		expect( text ).not.toContain( 'Some Company' );
	} );

	it( 'does not render name for ANONYM address', () => {
		const wrapper = mountWrapper( anonymousAddressWithAllFieldsFilledOut );
		expect( wrapper.find( 'strong' ).exists() ).toBe( false );
	} );

	it( 'does not render name for UNSET address type', () => {
		const unsetAddress: Address = {
			addressType: 'unset',
			salutation: 'Herr',
			title: 'Dr.',
			firstName: 'Vlad',
			lastName: 'Dracul',
			fullName: 'Vlad Dracul',
			companyName: 'Vlad Company',
			street: 'Blutgasse 5',
			postcode: '80666',
			city: 'München',
			country: 'DE',
			email: 'vlad@gmail.com',
		};
		const wrapper = mountWrapper( unsetAddress );
		expect( wrapper.find( 'strong' ).exists() ).toBe( false );
	} );

	it( 'does not render name for EMPTY address type', () => {

		const wrapper = mountWrapper( unsetAddressWithAllFieldsFilledOut );
		expect( wrapper.find( 'strong' ).exists() ).toBe( false );
	} );
} );
