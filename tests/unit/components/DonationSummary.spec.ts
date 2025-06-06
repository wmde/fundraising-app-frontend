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

	it( 'renders payment headline, amount, interval, and paymentType', () => {
		const wrapper = mountWrapper( {
			address: emptyAddress,
			payment,
			bankData: emptyBankData,
			countries,
			salutations,
		} );
		const text = wrapper.text();

		expect( text ).toContain( 'donation_form_summary_headline' );
		expect( text ).toContain( '{"amount":14.99,"key":"currency","currencyDisplay":"name"}' );
		expect( text ).toContain( '{"key":"donation_form_payment_interval_12"}' );
		expect( text ).toContain( 'donation_summary_via {"key":"BEZ"}' );
	} );

	it( 'does not show bank details if iban is empty', () => {
		const wrapper = mountWrapper( {
			address: fullAddress,
			payment,
			bankData: emptyBankData,
			countries,
			salutations,
		} );
		const text = wrapper.text();

		expect( text ).not.toContain( 'donation_form_summary_bank_details' );
	} );

	it( 'shows bank details when iban is provided', () => {
		const filledOutBankData = {
			iban: 'DE02120300000000202051',
			bic: 'BYLADEM1001',
			bankName: 'Deutsche Kreditbank',
		};
		const wrapper = mountWrapper( {
			address: fullAddress,
			payment,
			bankData: filledOutBankData,
			countries,
			salutations,
		} );
		const text = wrapper.text();

		expect( text ).toContain( 'donation_form_summary_bank_details' );
		expect( text ).toContain( 'donation_form_summary_iban' );
		expect( text ).toContain( emptyBankData.iban );
		expect( text ).toContain( 'donation_form_summary_bic' );
		expect( text ).toContain( emptyBankData.bic );
		expect( text ).toContain( 'donation_form_summary_bank_name' );
		expect( text ).toContain( emptyBankData.bankName );
	} );
} );
