import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore } from '@src/store/membership_store';

import FilteredUrlMembershipValues from '@src/util/FilteredUrlMembershipValues';
import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/util/page_data_initializer';
import persistenceItems from '@src/store/data_persistence/membership_application';
import { AddressValidation } from '@src/view_models/Validation';
import { ApiCityAutocompleteResource } from '@src/api/CityAutocompleteResource';
import { Country } from '@src/view_models/Country';
import { InitialMembershipData } from '@src/view_models/Address';
import { Salutation } from '@src/view_models/Salutation';
import { action } from '@src/store/util';
import { createDataPersister } from '@src/store/create_data_persister';
import {
	createInitialBankDataValues,
	createInitialMembershipAddressValues,
	createInitialMembershipFeeValues,
} from '@src/store/dataInitializers';
import { createTrackFormErrorsPlugin } from '@src/store/track_form_errors_plugin';

import MembershipForm from '@src/components/pages/MembershipForm.vue';
import App from '@src/components/App.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import CampaignParameters from '@src/util/CampaignParameters';
import { TrackingData } from '@src/view_models/TrackingData';
import { ApiBankValidationResource } from '@src/api/BankValidationResource';

interface MembershipAmountModel {
	presetAmounts: Array<string>,
	paymentIntervals: Array<string>,
	paymentTypes: Array<string>,
	tracking: TrackingData,
	countries: Array<Country>,
	salutations: Array<Salutation>,
	urls: any,
	showMembershipTypeOption: Boolean,
	initialFormValues: InitialMembershipData,
	userDataKey: string,
	addressValidationPatterns: AddressValidation,
	dateOfBirthValidationPattern: String,
}

const PAGE_IDENTIFIER = 'membership-application';
const FORM_NAMESPACE = 'membership_application';
const pageData = new PageDataInitializer<MembershipAmountModel>( '#appdata' );
const dataPersister = createDataPersister( new LocalStorageRepository(), FORM_NAMESPACE, pageData.applicationVars.userDataKey );
const store = createStore( [ dataPersister.getPlugin( persistenceItems ), createTrackFormErrorsPlugin( FORM_NAMESPACE ) ] );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );
const campaignParameters = new CampaignParameters( new URLSearchParams( window.location.search ) );

dataPersister.initialize( persistenceItems ).then( () => {

	// The PHP serialization sends the initial form data as an empty array (instead of empty object)
	// when donation was anonymous so converting it to a map makes it consistent
	const initialFormValues = new Map( Object.entries( pageData.applicationVars.initialFormValues || {} ) );
	const initialFeeValues = new FilteredUrlMembershipValues(
		new URLSearchParams( window.location.search ),
		pageData.applicationVars.urls.validateMembershipFee,
	);
	initialFeeValues.setTypeFromAvailablePaymentTypes( pageData.applicationVars.paymentTypes );
	const initialBankAccountData = {
		accountNumber: initialFormValues.get( 'iban' ),
		bankCode: '',
		bankName: initialFormValues.get( 'bankname' ),
		iban: initialFormValues.get( 'iban' ),
		bic: initialFormValues.get( 'bic' ),
	};

	// Combine the initial values (from app data and URL) with the values from the local storage.
	// Local storage overrides initial values.
	// Send the combined values to the store, as the "final initial" value in the store.
	Promise.all( [
		store.dispatch(
			action( 'membership_address', 'initializeAddress' ),
			createInitialMembershipAddressValues( dataPersister, initialFormValues ),
		),
		store.dispatch(
			action( 'membership_fee', 'initializeMembershipFee' ),
			createInitialMembershipFeeValues( dataPersister, initialFeeValues ),
		),
		store.dispatch(
			action( 'bankdata', 'initializeBankData' ),
			createInitialBankDataValues( dataPersister, initialBankAccountData ),
		),
	] ).then( () => {
		const app = createVueApp( App,
			pageData.messages,
			pageData.allowedCampaignParameters,
			featureFetcher,
			{
				assetsPath: pageData.assetsPath,
				bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
				pageIdentifier: PAGE_IDENTIFIER,
				page: MembershipForm,
				pageTitle: 'membership_application_page_title',
				pageProps: {
					validateAddressUrl: pageData.applicationVars.urls.validateAddress,
					validateEmailUrl: pageData.applicationVars.urls.validateEmail,
					validateFeeUrl: pageData.applicationVars.urls.validateMembershipFee,
					validateBankDataUrl: pageData.applicationVars.urls.validateIban,
					validateLegacyBankDataUrl: pageData.applicationVars.urls.convertBankData,
					paymentAmounts: pageData.applicationVars.presetAmounts.map( a => Number( a ) * 100 ),
					countries: pageData.applicationVars.countries,
					salutations: pageData.applicationVars.salutations,
					showMembershipTypeOption: pageData.applicationVars.showMembershipTypeOption,
					paymentIntervals: pageData.applicationVars.paymentIntervals,
					paymentTypes: pageData.applicationVars.paymentTypes,
					addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
					dateOfBirthValidationPattern: pageData.applicationVars.dateOfBirthValidationPattern,
					trackingData: pageData.applicationVars.tracking,
					campaignValues: campaignParameters.getCampaignValues(),
				},
			} );
		app.provide( 'cityAutocompleteResource', new ApiCityAutocompleteResource() );
		app.provide( 'bankValidationResource', new ApiBankValidationResource(
			pageData.applicationVars.urls.validateIban,
			pageData.applicationVars.urls.convertBankData
		) );
		app.use( store );
		app.mount( '#app' );
	} );
} );
