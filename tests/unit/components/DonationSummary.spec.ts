import DonationSummary from '@src/components/pages/donation_form/DonationSummary.vue';
import { mount, VueWrapper } from '@vue/test-utils';
import type { Address } from '@src/view_models/Address';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

describe( 'DonationSummary.vue', () => {
	const payment = {
		paymentType: 'BEZ',
		interval: 12,
		amount: 14.99,
	};

	const emptyBankData = { iban: '', bic: '', bankName: '' };

	const validBankData = {
		iban: 'DE02120300000000202051',
		bic: 'BYLADEM1001',
		bankName: 'Deutsche Kreditbank',
	};

	const countries: Country[] = [
		{
			countryCode: 'DE',
			countryFullName: 'Deutschland',
			group: '',
			postCodeValidation: '^[0-9]{5}$',
		},
		{
			countryCode: 'AT',
			countryFullName: 'Österreich',
			group: '',
			postCodeValidation: '^[0-9]{4}$',
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

	const fullAddress: Address = {
		salutation: 'Herr',
		title: 'Dr.',
		firstName: 'Vlad',
		lastName: 'Dracul',
		fullName: 'Vlad Dracul',
		companyName: '',
		street: 'Blutgasse 5',
		postcode: '80666',
		city: 'München',
		country: 'DE',
		email: 'vlad@example.com',
	};

	const emptyAddress: Address = {
		salutation: '',
		title: '',
		firstName: '',
		lastName: '',
		fullName: '',
		companyName: '',
		street: '',
		postcode: '',
		city: '',
		country: '',
		email: '',
	};

	interface Props {
		address: Address;
		payment: { interval: any; amount: number; paymentType: any };
		bankData: { iban: string; bic: string; bankName: string };
		countries: Country[];
		salutations: Salutation[];
		hasAddressSummary: boolean;
	}

	const mocks = {
		$t: ( key: string ) => key,
	};

	function mountWrapper( propsData: Props ): VueWrapper<any> {
		return mount( DonationSummary, {
			props: propsData,
			global: {
				mocks,
			},
		} );
	}

	it( 'renders summary headline, amount, interval, and paymentType', () => {
		const wrapper = mountWrapper( {
			address: emptyAddress,
			payment,
			bankData: emptyBankData,
			countries,
			salutations,
			hasAddressSummary: false,
		} );
		const text = wrapper.text();

		expect( text ).toContain( 'donation_form_summary_headline' );
		expect( text ).toContain( '{"amount":14.99,"key":"currency","currencyDisplay":"name"}' );
		expect( text ).toContain( '{"key":"donation_form_payment_interval_12"}' );
		expect( text ).toContain( 'donation_summary_via {"key":"BEZ"}' );
	} );

	it( 'does NOT render paymentType if empty', () => {
		const wrapper = mountWrapper( {
			address: fullAddress,
			payment: { interval: 1, amount: 10.0, paymentType: '' },
			bankData: emptyBankData,
			countries,
			salutations,
			hasAddressSummary: true,
		} );

		const text = wrapper.text();
		expect( text ).toContain( 'donation_form_summary_headline' );
		expect( text ).toContain( 'donation_form_payment_interval_1' );
		expect( text ).not.toContain( 'donation_summary_via' );
	} );

	it( 'renders DonorSummary and bank data when present', () => {
		const wrapper = mountWrapper( {
			address: fullAddress,
			payment,
			bankData: validBankData,
			countries,
			salutations,
			hasAddressSummary: true,
		} );

		const text = wrapper.text();
		expect( wrapper.findComponent( { name: 'DonorSummary' } ).exists() ).toBe( true );
		expect( text ).toContain( 'donation_form_summary_bank_details' );
		expect( text ).toContain( 'donation_form_summary_iban' );
		expect( text ).toContain( emptyBankData.iban );
		expect( text ).toContain( 'donation_form_summary_bic' );
		expect( text ).toContain( emptyBankData.bic );
		expect( text ).toContain( 'donation_form_summary_bank_name' );
		expect( text ).toContain( emptyBankData.bankName );
	} );

	it( 'does NOT render DonorSummary when hasAddressSummary=false', () => {
		const wrapper = mountWrapper( {
			address: emptyAddress,
			payment,
			bankData: emptyBankData,
			countries,
			salutations,
			hasAddressSummary: false,
		} );
		expect( wrapper.findComponent( { name: 'DonorSummary' } ).exists() ).toBe( false );
	} );

	it( 'does NOT show bank details if iban is missing', () => {
		const wrapper = mountWrapper( {
			address: fullAddress,
			payment,
			bankData: emptyBankData,
			countries,
			salutations,
			hasAddressSummary: true,
		} );
		const text = wrapper.text();

		expect( text ).not.toContain( 'donation_form_summary_bank_details' );
		expect( text ).not.toContain( 'donation_form_summary_iban' );
		expect( text ).not.toContain( 'donation_form_summary_bic' );
		expect( text ).not.toContain( 'donation_form_summary_bank_name' );
	} );
} );
