import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import { createStore } from '@src/store/donor_update_store';

import DonorResource from '@src/api/DonorResource';
import LocalStorageRepository from '@src/store/LocalStorageRepository';
import PageDataInitializer from '@src/page_data_initializer';
import { Address } from '@src/view_models/Address';
import { AddressValidation } from '@src/view_models/Validation';
import { Country } from '@src/view_models/Country';
import { Donation } from '@src/view_models/Donation';
import { NS_ADDRESS } from '@src/store/namespaces';
import { Salutation } from '@src/view_models/Salutation';
import { Validity } from '@src/view_models/Validity';
import { action } from '@src/store/util';
import { addressTypeFromName } from '@src/view_models/AddressTypeModel';
import { clearPersistentData } from '@src/store/create_data_persister';
import { initializeAddress } from '@src/store/address/actionTypes';
import { trackGoal } from '@src/tracking';

import App from '@src/components/App.vue';
import DonationConfirmation from '@src/components/pages/DonationConfirmation.vue';
import { createFeatureFetcher } from '@src/FeatureFetcher';

interface DonationConfirmationModel {
	urls: { [ key: string ]: string },
	countries: Array<Country>,
	donation: Donation,
	address: Address,
	addressType: String,
	addressValidationPatterns: AddressValidation,
	salutations: Array<Salutation>,
	piwik: { donationConfirmationGoalId: number; },
}

const PAGE_IDENTIFIER = 'donation-confirmation';
const LOCAL_STORAGE_DELETION_NAMESPACES = [ 'donation_form', 'membership_application' ];
const pageData = new PageDataInitializer<DonationConfirmationModel>( '#appdata' );
const store = createStore();
const address = pageData.applicationVars.address;
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

clearPersistentData( new LocalStorageRepository(), LOCAL_STORAGE_DELETION_NAMESPACES );
trackGoal( pageData.applicationVars.piwik.donationConfirmationGoalId );

store.dispatch(
	action( NS_ADDRESS, initializeAddress ),
	{
		addressType: addressTypeFromName( pageData.applicationVars.addressType.toString() ),
		newsletter: pageData.applicationVars.donation.newsletter,
		fields: [
			{ name: 'salutation', value: address.salutation ?? '', validity: Validity.INCOMPLETE },
			{ name: 'title', value: address.title ?? '', validity: Validity.INCOMPLETE },
			{ name: 'firstName', value: address.firstName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'lastName', value: address.lastName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'companyName', value: address.companyName ?? '', validity: Validity.INCOMPLETE },
			{ name: 'street', value: address.street ?? '', validity: Validity.INCOMPLETE },
			{ name: 'postcode', value: address.postcode ?? '', validity: Validity.INCOMPLETE },
			{ name: 'city', value: address.city ?? '', validity: Validity.INCOMPLETE },
			{ name: 'country', value: address.country ?? 'DE', validity: Validity.INCOMPLETE },
			{ name: 'email', value: address.email ?? '', validity: Validity.INCOMPLETE },
		],
	}
).then( () => {
	const app = createVueApp( App, pageData.messages, featureFetcher, {
		isFullWidth: true,
		usesContentCards: true,
		assetsPath: pageData.assetsPath,
		pageIdentifier: PAGE_IDENTIFIER,
		page: DonationConfirmation,
		pageProps: {
			donation: pageData.applicationVars.donation,
			address: address,
			addressType: pageData.applicationVars.addressType,
			countries: pageData.applicationVars.countries,
			salutations: pageData.applicationVars.salutations,
			validateAddressUrl: pageData.applicationVars.urls.validateAddress,
			validateEmailUrl: pageData.applicationVars.urls.validateEmail,
			cancelDonationUrl: pageData.applicationVars.urls.cancelDonation,
			postCommentUrl: pageData.applicationVars.urls.postComment,
			addressValidationPatterns: pageData.applicationVars.addressValidationPatterns,
			donorResource: new DonorResource( pageData.applicationVars.urls.updateDonor ),
		},
	} );
	app.use( store );
	app.mount( '#app' );
} );
