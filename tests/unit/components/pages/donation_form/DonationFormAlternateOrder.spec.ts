import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import DonationForm from '@src/components/pages/DonationForm.vue';
import countries from '@test/data/countries';
import { AddressValidation } from '@src/view_models/Validation';
import { createFeatureToggle } from '@src/util/createFeatureToggle';
import { createStore } from '@src/store/donation_store';
import { nextTick } from 'vue';
import axios from 'axios';
import { newSucceedingBankValidationResource } from '@test/unit/TestDoubles/SucceedingBankValidationResource';
import { IBAN } from '@test/data/bankdata';

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

describe( 'DonationForm.vue (alternate order for street autocomplete)', () => {

	beforeEach( () => {
		global.window.scrollTo = jest.fn();
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.clearAllMocks();
		document.getElementsByTagName( 'html' )[ 0 ].innerHTML = '';
	} );

	const getWrapper = (): VueWrapper<any> => {
		const store = createStore();
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
				plugins: [ store ],
				provide: {
					bankValidationResource: newSucceedingBankValidationResource(),
				},
				components: {
					FeatureToggle: createFeatureToggle( [ 'campaigns.address_pages.legacy', 'campaigns.address_field_order.new_order' ] ),
				},
			},
			attachTo: document.body,
		} );
	};

	it( 'handles the error summary when no address type was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#person-country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#person-country' ).trigger( 'blur' );
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
		expect( errorSummaryItemIsFunctional( wrapper, 'addressType-0', 'address-type-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-salutation-0', 'person-salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-first-name', 'person-first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-last-name', 'person-last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-street', 'person-street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-post-code', 'person-post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-city', 'person-city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-country', 'person-country-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-email', 'person-email-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="addressType"][value="0"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#person-first-name' ).setValue( 'first-name' );
		await wrapper.find( '#person-first-name' ).trigger( 'blur' );

		await wrapper.find( '#person-last-name' ).setValue( 'last-name' );
		await wrapper.find( '#person-last-name' ).trigger( 'blur' );

		await wrapper.find( '#person-street' ).setValue( 'street' );
		await wrapper.find( '#person-street' ).trigger( 'blur' );

		await wrapper.find( '#person-post-code' ).setValue( '12345' );
		await wrapper.find( '#person-post-code' ).trigger( 'blur' );

		await wrapper.find( '#person-city' ).setValue( 'city' );
		await wrapper.find( '#person-city' ).trigger( 'blur' );

		await wrapper.find( '#person-country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#person-country' ).trigger( 'blur' );

		await wrapper.find( '#person-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#person-email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when person address type was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="addressType"][value="0"]' ).trigger( 'change' );
		await wrapper.find( '#person-country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#person-country' ).trigger( 'blur' );
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
		expect( errorSummaryItemIsFunctional( wrapper, 'person-salutation-0', 'person-salutation-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-first-name', 'person-first-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-last-name', 'person-last-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-street', 'person-street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-post-code', 'person-post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-city', 'person-city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-country', 'person-country-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'person-email', 'person-email-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#iban' ).setValue( IBAN );
		await wrapper.find( '#iban' ).trigger( 'blur' );

		await wrapper.find( '#person-first-name' ).setValue( 'first-name' );
		await wrapper.find( '#person-first-name' ).trigger( 'blur' );

		await wrapper.find( '#person-last-name' ).setValue( 'last-name' );
		await wrapper.find( '#person-last-name' ).trigger( 'blur' );

		await wrapper.find( '#person-street' ).setValue( 'street' );
		await wrapper.find( '#person-street' ).trigger( 'blur' );

		await wrapper.find( '#person-post-code' ).setValue( '12345' );
		await wrapper.find( '#person-post-code' ).trigger( 'blur' );

		await wrapper.find( '#person-city' ).setValue( 'city' );
		await wrapper.find( '#person-city' ).trigger( 'blur' );

		await wrapper.find( '#person-country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#person-country' ).trigger( 'blur' );

		await wrapper.find( '#person-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#person-email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when company address type was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="addressType"][value="1"]' ).trigger( 'change' );
		await wrapper.find( '#company-country' ).setValue( 'I am clearly not a country' );
		await wrapper.find( '#company-country' ).trigger( 'blur' );
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
		expect( errorSummaryItemIsFunctional( wrapper, 'company-company-name', 'company-company-name-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-street', 'company-street-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-post-code', 'company-post-code-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-city', 'company-city-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-country', 'company-country-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'company-email', 'company-email-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="PPL"]' ).trigger( 'change' );

		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#company-company-name' ).setValue( 'company-name' );
		await wrapper.find( '#company-company-name' ).trigger( 'blur' );

		await wrapper.find( '#company-street' ).setValue( 'street' );
		await wrapper.find( '#company-street' ).trigger( 'blur' );

		await wrapper.find( '#company-post-code' ).setValue( '12345' );
		await wrapper.find( '#company-post-code' ).trigger( 'blur' );

		await wrapper.find( '#company-city' ).setValue( 'city' );
		await wrapper.find( '#company-city' ).trigger( 'blur' );

		await wrapper.find( '#company-country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#company-country' ).trigger( 'blur' );

		await wrapper.find( '#company-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#company-email' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeFalsy();
	} );

	it( 'handles the error summary when without address type was selected before submitting', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="addressType"][value="4"]' ).trigger( 'change' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );
		await nextTick();
		await nextTick();
		await flushPromises();

		expect( wrapper.find( '.error-summary' ).exists() ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'amount-500', 'payment-form-amount-scroll-target' ) ).toBeTruthy();
		expect( errorSummaryItemIsFunctional( wrapper, 'paymentType-0', 'payment-form-type-scroll-target' ) ).toBeTruthy();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="PPL"]' ).trigger( 'change' );

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

		await wrapper.find( 'input[name="addressType"][value="0"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="salutation"][value="Mr"]' ).trigger( 'change' );

		await wrapper.find( '#person-first-name' ).setValue( 'first-name' );
		await wrapper.find( '#person-first-name' ).trigger( 'blur' );

		await wrapper.find( '#person-last-name' ).setValue( 'last-name' );
		await wrapper.find( '#person-last-name' ).trigger( 'blur' );

		await wrapper.find( '#person-street' ).setValue( 'street' );
		await wrapper.find( '#person-street' ).trigger( 'blur' );

		await wrapper.find( '#person-post-code' ).setValue( '12345' );
		await wrapper.find( '#person-post-code' ).trigger( 'blur' );

		await wrapper.find( '#person-city' ).setValue( 'city' );
		await wrapper.find( '#person-city' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( '#person-country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#person-country' ).trigger( 'blur' );

		await wrapper.find( '#person-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#person-email' ).trigger( 'blur' );

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

		await wrapper.find( 'input[name="addressType"][value="1"]' ).trigger( 'change' );

		await wrapper.find( '#company-company-name' ).setValue( 'company-name' );
		await wrapper.find( '#company-company-name' ).trigger( 'blur' );

		await wrapper.find( '#company-street' ).setValue( 'street' );
		await wrapper.find( '#company-street' ).trigger( 'blur' );

		await wrapper.find( '#company-post-code' ).setValue( '12345' );
		await wrapper.find( '#company-post-code' ).trigger( 'blur' );

		await wrapper.find( '#company-city' ).setValue( 'city' );
		await wrapper.find( '#company-city' ).trigger( 'blur' );

		await jest.runAllTimersAsync();

		await wrapper.find( '#company-country' ).setValue( countries[ 0 ].countryFullName );
		await wrapper.find( '#company-country' ).trigger( 'blur' );

		await wrapper.find( '#company-email' ).setValue( 'joe@dolan.com' );
		await wrapper.find( '#company-email' ).trigger( 'blur' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );

	it( 'submits the form for anonymous', async () => {
		mockedAxios.post.mockResolvedValue( { data: { status: 'OK' } } );
		const wrapper = getWrapper();

		const submitForm = wrapper.find<HTMLFormElement>( '#submit-form' );
		submitForm.element.submit = jest.fn();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'change' );
		await wrapper.find( 'input[name="paymentType"][value="PPL"]' ).trigger( 'change' );

		await wrapper.find( 'input[name="addressType"][value="4"]' ).trigger( 'change' );

		await wrapper.find( '#submit-btn' ).trigger( 'click' );

		await jest.runAllTimersAsync();
		await flushPromises();

		expect( submitForm.element.submit ).toHaveBeenCalled();
	} );
} );