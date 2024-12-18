import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import DonationForm from '@src/components/pages/donation_form/SubPages/DonationFormReceipt.vue';
import countries from '@test/data/countries';
import { AddressValidation } from '@src/view_models/Validation';
import { createStore } from '@src/store/donation_store';
import { nextTick } from 'vue';
import axios from 'axios';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import { IBAN } from '@test/data/bankdata';
import { Store } from 'vuex';
import { action } from '@src/store/util';

jest.mock( 'axios' );
const mockedAxios = axios as jest.Mocked<typeof axios>;

declare global {
	namespace NodeJS {
		interface Global {
			window: Window;
		}
	}
}

const errorSummaryItemIsFunctional = ( wrapper: VueWrapper<any>, formElement: string, scrollElement: string ): boolean => {
	const errorItemExists = wrapper.find( `.error-summary a[href="#${formElement}"]` ).exists();
	const formElementExists = wrapper.find( `#${formElement}` ).exists();
	const scrollElementExists = wrapper.find( `#${scrollElement}` ).exists();

	return errorItemExists && formElementExists && scrollElementExists;
};

describe( 'DonationFormReciept.vue', () => {

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.clearAllMocks();
		document.getElementsByTagName( 'html' )[ 0 ].innerHTML = '';
	} );

	const getWrapper = ( store: Store<any> = null ): VueWrapper<any> => {
		return mount( DonationForm, {
			props: {
				assetsPath: '',
				paymentAmounts: [ 500, 1000, 2000 ],
				paymentIntervals: [ 0, 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'PPL', 'UEB', 'BTC' ],
				validateAddressUrl: 'https://example.com/address-check',
				countries: countries,
				trackingData: { bannerImpressionCount: 0, impressionCount: 0 },
				campaignValues: { campaign: 'nicholas', keyword: 'cage' },
				validateEmailUrl: '',
				validateBankDataUrl: '',
				validateLegacyBankDataUrl: '',
				salutations: [
					{
						label: 'Mr',
						value: 'Mr',
						display: 'Mr',
						greetings: {
							formal: 'Mr',
							informal: 'Mr',
							lastNameInformal: 'Mr',
						},
					},
					{
						label: 'Ms',
						value: 'Ms',
						display: 'Ms',
						greetings: {
							formal: 'Ms',
							informal: 'Ms',
							lastNameInformal: 'Ms',
						},
					},
				],
				addressValidationPatterns: { postcode: '', country: null } as AddressValidation,
			},
			global: {
				plugins: [ store ?? createStore() ],
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
				},
			},
			attachTo: document.body,
		} );
	};

	it( 'sets the correct default field values', async () => {
		const wrapper = getWrapper();

		expect( wrapper.find<HTMLInputElement>( '#interval-0' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#newsletter' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-0' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-1' ).element.checked ).toBeFalsy();
	} );

	it( 'sets the correct receipt wanted field', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { receipt: true, fields: [] } );
		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-0' ).element.checked ).toBeTruthy();
		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-1' ).element.checked ).toBeFalsy();
	} );

	it( 'sets the correct receipt not wanted field', async () => {
		const store = createStore();
		await store.dispatch( action( 'address', 'initializeAddress' ), { receipt: false, fields: [] } );
		const wrapper = getWrapper( store );

		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-0' ).element.checked ).toBeFalsy();
		expect( wrapper.find<HTMLInputElement>( '#donationReceipt-1' ).element.checked ).toBeTruthy();
	} );

	it( 'handles the error summary when no receipt option was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'paymentType-0', 'payment-form-type-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'email-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'donationReceipt-0', 'receipt-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="PPL"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await wrapper.find( 'input[name="donationReceipt"][value="false"]' ).trigger( 'change' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when only receipt option yes was selected selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="donationReceipt"][value="true"]' ).trigger( 'change' );
		await wrapper.find( '#country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( errorSummaryItemIsFunctional( wrapper, 'paymentType-0', 'payment-form-type-scroll-target' ) ).toBeTruthy();

		// Make the IBAN field appear
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );
		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'iban', 'iban-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'email-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'addressType-0', 'address-type-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'country-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( 'input[name="addressTypeSelector"][value="0"]' ).trigger( 'change' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await wrapper.find( '#country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when person address type was selected selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="donationReceipt"][value="true"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="addressTypeSelector"][value="0"]' ).trigger( 'change' );
		await wrapper.find( '#country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( errorSummaryItemIsFunctional( wrapper, 'paymentType-0', 'payment-form-type-scroll-target' ) ).toBeTruthy();

		// Make the IBAN field appear
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );
		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'iban', 'iban-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'email-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'country-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await wrapper.find( '#country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when company address type was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="donationReceipt"][value="true"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="addressTypeSelector"][value="2"]' ).trigger( 'change' );
		await nextTick();

		await wrapper.find( '#country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#country' ).trigger( 'blur' );
		await jest.runAllTimersAsync();

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( errorSummaryItemIsFunctional( wrapper, 'paymentType-0', 'payment-form-type-scroll-target' ) ).toBeTruthy();

		// Make the IBAN field appear
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );
		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'iban', 'iban-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'salutation-0', 'salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'first-name', 'first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'last-name', 'last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'email', 'email-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-name', 'company-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'street', 'street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'post-code', 'post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'city', 'city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'country', 'country-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#company-name' ).setValue( 'company-name' );
		await wrapper.find( '#company-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await wrapper.find( '#country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'submits the form for a person', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const wrapper = getWrapper();

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await wrapper.find( 'input[name="donationReceipt"][value="true"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="addressTypeSelector"][value="0"]' ).trigger( 'change' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( '#country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

	it( 'submits the form for a company', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const wrapper = getWrapper();

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await wrapper.find( 'input[name="donationReceipt"][value="true"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="addressTypeSelector"][value="2"]' ).trigger( 'change' );

		await wrapper.find( '#company-name' ).setValue( 'company-name' );
		await wrapper.find( '#company-name' ).trigger( 'blur' );

		await wrapper.find( '#street' ).setValue( 'street' );
		await wrapper.find( '#street' ).trigger( 'blur' );

		await wrapper.find( '#post-code' ).setValue( '12345' );
		await wrapper.find( '#post-code' ).trigger( 'blur' );

		await wrapper.find( '#city' ).setValue( 'city' );
		await wrapper.find( '#city' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( '#country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#country' ).trigger( 'blur' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

	it( 'submits the form for email-only', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const wrapper = getWrapper();

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await wrapper.find( 'input[name="donationReceipt"][value="false"]' ).trigger( 'change' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

	it( 'switching between payment types with empty iban should reset iban validity', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const wrapper = getWrapper();

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="UEB"]' ).trigger( 'change' );

		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#first-name' ).setValue( 'first-name' );
		await wrapper.find( '#first-name' ).trigger( 'blur' );

		await wrapper.find( '#last-name' ).setValue( 'last-name' );
		await wrapper.find( '#last-name' ).trigger( 'blur' );

		await wrapper.find( '#email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#email' ).trigger( 'blur' );

		await wrapper.find( 'input[name="donationReceipt"][value="false"]' ).trigger( 'change' );

		// change to BEZ to make the IBAN field appear
		await wrapper.find( 'input[name="paymentType"][value="BEZ"]' ).trigger( 'change' );
		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'iban', 'iban-scroll-target' ) ).toBeTruthy();

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );
} );
