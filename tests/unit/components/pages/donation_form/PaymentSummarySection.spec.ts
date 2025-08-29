import PaymentSummarySection from '@src/components/pages/donation_form/PaymentSummarySection.vue';
import { mount, VueWrapper } from '@vue/test-utils';

describe( 'PaymentSummarySection.vue', () => {

	const validBankData = {
		iban: 'DE02120300000000202051',
		bic: 'BYLADEM1001',
		bankName: 'Deutsche Kreditbank',
	};

	const validBankDataWithoutBicBankName = {
		iban: 'DE02120300000000202051',
		bic: '',
		bankName: '',
	};

	interface Props {
		bankData: { iban: string; bic?: string; bankName?: string };
	}

	const mocks = {
		$t: ( key: string ) => key,
	};

	function mountWrapper( propsData: Props ): VueWrapper<any> {
		return mount( PaymentSummarySection, {
			props: propsData,
			global: {
				mocks,
			},
		} );
	}

	it( 'renders bank data when present', () => {
		const wrapper = mountWrapper( {
			bankData: validBankData,
		} );

		const text = wrapper.text();
		expect( text ).toContain( 'form_summary_bank_details_header' );
		expect( text ).toContain( 'form_summary_iban' );
		expect( text ).toContain( validBankData.iban );
		expect( text ).toContain( 'form_summary_bic' );
		expect( text ).toContain( validBankData.bic );
		expect( text ).toContain( 'form_summary_bank_name' );
		expect( text ).toContain( validBankData.bankName );
	} );

	it( 'does NOT show bank bic and bank name if bic and bank name are not found', () => {
		const wrapper = mountWrapper( {
			bankData: validBankDataWithoutBicBankName,
		} );
		const text = wrapper.text();

		expect( text ).toContain( 'form_summary_bank_details_header' );
		expect( text ).toContain( 'form_summary_iban' );
		expect( text ).toContain( validBankData.iban );
		expect( text ).not.toContain( 'form_summary_bic' );
		expect( text ).not.toContain( 'form_summary_bank_name' );
	} );
} );
