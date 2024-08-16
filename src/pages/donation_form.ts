import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore, StoreKey } from '@src/store/donation_store';

import CampaignParameters from '@src/util/CampaignParameters';
import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/util/page_data_initializer';
import persistenceItems from '@src/store/data_persistence/donation_form';
import { AddressValidation } from '@src/view_models/Validation';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { action } from '@src/store/util';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { createDataPersister } from '@src/store/create_data_persister';
import { createInitialDonationAddressValues, createInitialDonationPaymentValues } from '@src/store/dataInitializers';
import { createTrackFormErrorsPlugin } from '@src/store/track_form_errors_plugin';

import App from '@src/components/App.vue';
import DonationForm from '@src/components/pages/DonationForm.vue';
import { ApiCityAutocompleteResource } from '@src/util/CityAutocompleteResource';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { ApiBankValidationResource } from '@src/api/BankValidationResource';

interface DonationFormModel {
	initialFormValues: any,
	presetAmounts: Array<string>,
	paymentTypes: Array<string>,
	paymentIntervals: Array<number>,
	tracking: TrackingData,
	countries: Array<Country>,
	urls: any,
	userDataKey: string,
	addressValidationPatterns: AddressValidation,
	donationMaximumAmount: number,
	salutations: Array<Salutation>,
}

const PAGE_IDENTIFIER = 'donation-form';
const FORM_NAMESPACE = 'donation_form';
const pageData = new PageDataInitializer<DonationFormModel>( '#appdata' );
const dataPersister = createDataPersister( new LocalStorageRepository(), FORM_NAMESPACE, pageData.applicationVars.userDataKey );
const store = createStore( [ dataPersister.getPlugin( persistenceItems ), createTrackFormErrorsPlugin( FORM_NAMESPACE ) ] );
const campaignParameters = new CampaignParameters( new URLSearchParams( window.location.search ) );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

dataPersister.initialize( persistenceItems ).then( () => {
	Promise.all( [
		store.dispatch(
			action( 'payment', 'initializePayment' ),
			{
				initialValues: createInitialDonationPaymentValues( dataPersister, pageData.applicationVars.initialFormValues ),
				allowedIntervals: pageData.applicationVars.paymentIntervals,
				allowedPaymentTypes: pageData.applicationVars.paymentTypes,
			}
		),
		store.dispatch(
			action( 'address', 'initializeAddress' ),
			createInitialDonationAddressValues( dataPersister, pageData.applicationVars.initialFormValues )
		),
	] ).then( ( [ paymentDataComplete ] ) => {
		// ignoring result of initializeAddress
		const app = createVueApp(
			App,
			pageData.messages,
			pageData.allowedCampaignParameters,
			featureFetcher,
			{
				assetsPath: pageData.assetsPath,
				bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
				pageIdentifier: PAGE_IDENTIFIER,
				page: DonationForm,
				pageTitle: 'donation_form_page_title',
				pageProps: {
					assetsPath: pageData.assetsPath,
					validateAddressUrl: pageData.applicationVars.urls.validateAddress,
					validateEmailUrl: pageData.applicationVars.urls.validateEmail,
					validateBankDataUrl: pageData.applicationVars.urls.validateIban,
					validateLegacyBankDataUrl: pageData.applicationVars.urls.convertBankData,
					paymentAmounts: pageData.applicationVars.presetAmounts.map( a => Number( a ) * 100 ),
					paymentIntervals: pageData.applicationVars.paymentIntervals,
					paymentTypes: pageData.applicationVars.paymentTypes,
					countries: pageData.applicationVars.countries,
					salutations: pageData.applicationVars.salutations,
					trackingData: pageData.applicationVars.tracking,
					campaignValues: campaignParameters.getCampaignValues(),
					addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
					startPageIndex: paymentDataComplete ? 1 : 0,
				},
			} );
		app.provide( 'cityAutocompleteResource', new ApiCityAutocompleteResource() );
		app.provide( 'bankValidationResource', new ApiBankValidationResource(
			pageData.applicationVars.urls.validateIban,
			pageData.applicationVars.urls.convertBankData
		) );
		app.provide( StoreKey, store );
		app.use( store );
		app.mount( '#app' );
	} );

} );
