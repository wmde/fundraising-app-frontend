import { HistoryHijacker } from '@src/util/HistoryHijacker';
import { mount, VueWrapper } from '@vue/test-utils';
import MembershipForm from '@src/components/pages/MembershipForm.vue';
import countries from '@test/data/countries';
import { AddressValidation } from '@src/view_models/Validation';

const PaymentPage = { template: '<div class="i-am-payment" />' };
const AddressPage = { template: '<div class="i-am-address-form" />' };

describe( 'MembershipForm.vue', () => {
	let historyHijacker: HistoryHijacker;

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		historyHijacker = { addHistoryCallback: jest.fn(), addPushState: jest.fn(), back: jest.fn() };
	} );

	const getWrapper = (): VueWrapper<any> => {
		return mount( MembershipForm, {
			props: {
				validateAddressUrl: '',
				validateEmailUrl: '',
				validateBankDataUrl: '',
				validateLegacyBankDataUrl: '',
				validateFeeUrl: '',
				paymentAmounts: [ 5 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				countries,
				salutations: [],
				showMembershipTypeOption: false,
				addressValidationPatterns: {} as AddressValidation,
				dateOfBirthValidationPattern: '',
				trackingData: { bannerImpressionCount: 0, impressionCount: 0 },
				campaignValues: { campaign: 'nicholas', keyword: 'cage' },
				historyHijacker,
			},
			global: {
				stubs: {
					PaymentPage,
					AddressPage,
				},
			},
		} );
	};

	it( 'displays Payment page on load ', () => {
		const wrapper = getWrapper();

		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'loads Address page when next-page is triggered', async () => {
		const wrapper = getWrapper();
		await wrapper.findComponent( PaymentPage ).vm.$emit( 'next-page' );

		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );
	} );

	it( 'loads Payment component on the previous page', async () => {
		const wrapper = getWrapper();

		await wrapper.findComponent( PaymentPage ).vm.$emit( 'next-page' );
		await wrapper.findComponent( AddressPage ).vm.$emit( 'previous-page' );

		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'does not overshoot the first or last page when multiple page change events trigger', async () => {
		const wrapper = getWrapper();

		const paymentPage = wrapper.findComponent( PaymentPage );
		await paymentPage.vm.$emit( 'next-page' );
		await paymentPage.vm.$emit( 'next-page' );
		await paymentPage.vm.$emit( 'next-page' );

		expect( wrapper.find( '.i-am-address-form' ).exists() ).toBe( true );

		const addressPage = wrapper.findComponent( AddressPage );
		await addressPage.vm.$emit( 'previous-page' );
		await addressPage.vm.$emit( 'previous-page' );
		await addressPage.vm.$emit( 'previous-page' );

		expect( wrapper.find( '.i-am-payment' ).exists() ).toBe( true );
	} );

	it( 'scrolls to top of page only when page index changes', async () => {
		const wrapper = getWrapper();

		const paymentPage = wrapper.findComponent( PaymentPage );
		await paymentPage.vm.$emit( 'next-page' );
		await paymentPage.vm.$emit( 'next-page' );

		const addressPage = wrapper.findComponent( AddressPage );
		await addressPage.vm.$emit( 'previous-page' );
		await addressPage.vm.$emit( 'previous-page' );

		expect( global.window.scrollTo ).toHaveBeenCalledTimes( 2 );
	} );

	it( 'sets a history hijack callback when mounted', async () => {
		getWrapper();

		expect( historyHijacker.addHistoryCallback ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'adds history hijack push state when payment page is submitted', async () => {
		const wrapper = getWrapper();

		const paymentPage = wrapper.findComponent( PaymentPage );
		await paymentPage.vm.$emit( 'next-page' );

		expect( historyHijacker.addPushState ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'calls history hijack back when donor clicks back link', async () => {
		const wrapper = getWrapper();

		const paymentPage = wrapper.findComponent( PaymentPage );
		await paymentPage.vm.$emit( 'next-page' );

		const addressPage = wrapper.findComponent( AddressPage );
		await addressPage.vm.$emit( 'previous-page' );

		expect( historyHijacker.back ).toHaveBeenCalledTimes( 1 );
	} );
} );
