import { shallowMount, VueWrapper } from '@vue/test-utils';
import AddressSummarySection from '@src/components/pages/donation_form/Compact/AddressSummarySection.vue';
import countries from '@test/data/countries';
import salutations from '@test/data/salutations';
import { nextTick } from 'vue';

describe( 'AddressSummarySection.vue', () => {

	const getWrapper = (): VueWrapper<any> => {
		return shallowMount( AddressSummarySection, {
			props: {
				address: {
					addressType: '',
					salutation: '',
					title: '',
					firstName: '',
					lastName: '',
					fullName: '',
					companyName: '',
					street: '',
					city: '',
					postcode: '',
					country: '',
					email: '',
				},
				countries,
				salutations,
				receiptNeeded: true,
			},
		} );
	};

	it( 'shows a person summary with no academic title', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'person',
			salutation: 'Herr',
			firstName: 'Ringo',
			lastName: 'Starr',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).toContain( 'address_salutation_no_academic_title' );
		expect( wrapper.text() ).toContain( 'Ringo Starr' );
		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).toContain( '12345' );
		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'shows a person summary with an academic title', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'person',
			salutation: 'Herr',
			title: 'Prof. Dr. Santa.',
			firstName: 'Ringo',
			lastName: 'Starr',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).toContain( 'address_salutation_academic_title' );
		expect( wrapper.text() ).toContain( 'Ringo Starr' );
		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).toContain( '12345' );
		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'shows a person summary with no titles', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'person',
			firstName: 'Ringo',
			lastName: 'Starr',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).not.toContain( 'address_salutation_academic_title' );
		expect( wrapper.text() ).not.toContain( 'address_salutation_no_academic_title' );
		expect( wrapper.text() ).toContain( 'Ringo Starr' );
		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).toContain( '12345' );
		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'shows a company name for firma address type', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'firma',
			companyName: 'ACME',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).toContain( 'ACME' );
		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).toContain( '12345' );
		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'shows a company name for company with content address type', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'company_with_contact',
			companyName: 'ACME',
			salutation: 'Herr',
			firstName: 'Ringo',
			lastName: 'Starr',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).toContain( 'ACME' );
		expect( wrapper.text() ).toContain( 'address_salutation_no_academic_title' );
		expect( wrapper.text() ).toContain( 'Ringo Starr' );
		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).toContain( '12345' );
		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'shows the street address', async () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).not.toContain( 'Abbey Road 42' );

		await wrapper.setProps( { address: {
			addressType: 'person',
			street: 'Abbey Road 42',
		} } );

		expect( wrapper.text() ).toContain( 'Abbey Road 42' );
	} );

	it( 'shows the country, postcode, and city', async () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).not.toContain( 'Ireland' );
		expect( wrapper.text() ).not.toContain( 'Liverpool' );
		expect( wrapper.text() ).not.toContain( '12345' );

		await wrapper.setProps( { address: {
			addressType: 'person',
			country: 'IE',
			city: 'Liverpool',
			postcode: '12345',
		} } );

		expect( wrapper.text() ).toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'Liverpool' );
		expect( wrapper.text() ).toContain( '12345' );
	} );

	it( 'shows the email', async () => {
		const wrapper = getWrapper();

		expect( wrapper.text() ).not.toContain( 'ringo.starr@gmail.com' );

		await wrapper.setProps( { address: {
			addressType: 'person',
			email: 'ringo.starr@gmail.com',
		} } );

		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );

	it( 'does not show postal address data when receipt is not needed', async () => {
		const wrapper = getWrapper();

		await wrapper.setProps( { address: {
			addressType: 'person',
			salutation: 'Herr',
			title: 'Prof. Dr. Santa.',
			firstName: 'Ringo',
			lastName: 'Starr',
			street: 'Abbey Road 42',
			city: 'Liverpool',
			postcode: '12345',
			country: 'IE',
			email: 'ringo.starr@gmail.com',
		},
		receiptNeeded: false,
		} );

		await nextTick();

		expect( wrapper.text() ).toContain( 'address_salutation_academic_title' );
		expect( wrapper.text() ).toContain( 'Ringo Starr' );
		expect( wrapper.text() ).not.toContain( 'Abbey Road 42' );
		expect( wrapper.text() ).not.toContain( '12345' );
		expect( wrapper.text() ).not.toContain( 'Ireland' );
		expect( wrapper.text() ).toContain( 'ringo.starr@gmail.com' );
	} );
} );
