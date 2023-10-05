import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import { ContactFormValidation } from '@src/view_models/Validation';
import App from '@src/components/App.vue';
import Contact from '@src/components/pages/Contact.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';

interface ContactFormModel {
	message: string,
	contactFormValidationPatterns: ContactFormValidation,
}

const PAGE_IDENTIFIER = 'contact-form';
const pageData = new PageDataInitializer<ContactFormModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp( App, pageData.messages, featureFetcher, {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: Contact,
	pageProps: {
		contactData: pageData.applicationVars,
		validationPatterns: pageData.applicationVars.contactFormValidationPatterns,
	},
} ).mount( '#app' );
