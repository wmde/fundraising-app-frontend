import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore, StoreKey } from '@src/store/donation_store';

import CampaignParameters from '@src/util/CampaignParameters';
import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/page_data_initializer';
import persistenceItems from '@src/store/data_persistence/donation_form';
import { AddressValidation } from '@src/view_models/Validation';
import { Country } from '@src/view_models/Country';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { Salutation } from '@src/view_models/Salutation';
import { TrackingData } from '@src/view_models/TrackingData';
import { action } from '@src/store/util';
import { bucketIdToCssClass } from '@src/bucket_id_to_css_class';
import { createDataPersister } from '@src/store/create_data_persister';
import { createFeatureToggle } from '@src/createFeatureToggle';
import { createInitialDonationAddressValues, createInitialDonationPaymentValues } from '@src/store/dataInitializers';
import { createTrackFormErrorsPlugin } from '@src/store/track_form_errors_plugin';
import { initializeAddress } from '@src/store/address/actionTypes';
import { initializePayment } from '@src/store/payment/actionTypes';

import App from '@src/components/App.vue';
import DonationForm from '@src/components/pages/DonationForm.vue';
import { ApiCityAutocompleteResource } from '@src/CityAutocompleteResource';

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

dataPersister.initialize( persistenceItems ).then( () => {
	Promise.all( [
		store.dispatch(
			action( NS_PAYMENT, initializePayment ),
			createInitialDonationPaymentValues( dataPersister, pageData.applicationVars.initialFormValues )
		),
		store.dispatch(
			action( NS_ADDRESS, initializeAddress ),
			createInitialDonationAddressValues( dataPersister, pageData.applicationVars.initialFormValues )
		),
	] ).then( ( [ paymentDataComplete ] ) => { // ignoring result of initializeAddress
		const app = createVueApp( App, pageData.messages, {
			assetsPath: pageData.assetsPath,
			bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
			pageIdentifier: PAGE_IDENTIFIER,
			page: DonationForm,
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
		app.provide( StoreKey, store );
		app.use( store );
		app.component( 'FeatureToggle', createFeatureToggle( { activeFeatures: [ ...pageData.selectedBuckets, ...pageData.activeFeatures ] } ) );
		app.mount( '#app' );
	} );

} );
