import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore } from '@src/store/update_address_store';

import PageDataInitializer from '@src/util/page_data_initializer';
import type { AddressValidation } from '@src/view_models/Validation';
import { ApiCityAutocompleteResource } from '@src/api/CityAutocompleteResource';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import { createTrackFormErrorsPlugin } from '@src/store/track_form_errors_plugin';

import App from '@src/components/App.vue';
import UpdateAddress from '@src/components/pages/UpdateAddress.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { action } from '@src/store/util';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { ApiAddressChangeResource } from '@src/api/AddressChangeResource';
import { windowPageTools } from '@src/util/PageTools';

interface UpdateAddressModel {
	isCompany: boolean;
	countries: Array<Country>;
	salutations: Array<Salutation>;
	urls: any;
	addressValidationPatterns: AddressValidation;
}

const PAGE_IDENTIFIER = 'update-address';
const FORM_NAMESPACE = 'update_address';
const pageData = new PageDataInitializer<UpdateAddressModel>( '#appdata' );
const store = createStore( [ createTrackFormErrorsPlugin( FORM_NAMESPACE ) ] );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

store.dispatch(
	action( 'address', 'initializeAddress' ),
	{
		addressType: pageData.applicationVars.isCompany ? AddressTypeModel.COMPANY : AddressTypeModel.PERSON,
		fields: [],
	}
).then( () => {
	const app = createVueApp(
		App,
		pageData.messages,
		pageData.allowedCampaignParameters,
		featureFetcher,
		{
			assetsPath: pageData.assetsPath,
			bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
			pageIdentifier: PAGE_IDENTIFIER,
			page: UpdateAddress,
			pageTitle: 'update_address_page_title',
			pageTools: windowPageTools,
			pageProps: {
				validateAddressUrl: pageData.applicationVars.urls.validateAddress,
				countries: pageData.applicationVars.countries,
				salutations: pageData.applicationVars.salutations,
				addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
				addressChangeResource: new ApiAddressChangeResource( pageData.applicationVars.urls.updateAddress ),
				pageTools: windowPageTools,
			},
		}
	);

	app.provide( 'cityAutocompleteResource', new ApiCityAutocompleteResource() );
	app.use( store );
	app.mount( '#app' );
} );
