import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore } from '@src/store/update_address_store';

import PageDataInitializer from '@src/util/page_data_initializer';
import { AddressValidation } from '@src/view_models/Validation';
import { ApiCityAutocompleteResource } from '@src/util/CityAutocompleteResource';
import { Country } from '@src/view_models/Country';
import { Salutation } from '@src/view_models/Salutation';
import { createTrackFormErrorsPlugin } from '@src/store/track_form_errors_plugin';

import App from '@src/components/App.vue';
import UpdateAddress from '@src/components/pages/UpdateAddress.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

interface UpdateAddressModel {
	isCompany: boolean,
	countries: Array<Country>,
	salutations: Array<Salutation>,
	urls: any,
	addressValidationPatterns: AddressValidation,
}

const PAGE_IDENTIFIER = 'update-address';
const FORM_NAMESPACE = 'update_address';
const pageData = new PageDataInitializer<UpdateAddressModel>( '#appdata' );
const store = createStore( [ createTrackFormErrorsPlugin( FORM_NAMESPACE ) ] );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

const app = createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: UpdateAddress,
	pageProps: {
		validateAddressUrl: pageData.applicationVars.urls.validateAddress,
		updateAddressURL: pageData.applicationVars.urls.updateAddress,
		isCompany: pageData.applicationVars.isCompany,
		countries: pageData.applicationVars.countries,
		salutations: pageData.applicationVars.salutations,
		addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
	},
} );

app.provide( 'cityAutocompleteResource', new ApiCityAutocompleteResource() );
app.use( store );
app.mount( '#app' );
