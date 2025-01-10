import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/util/page_data_initializer';
import { ContactFormValidation } from '@src/view_models/Validation';
import App from '@src/components/App.vue';
import Contact from '@src/components/pages/Contact.vue';
import { createFeatureFetcher } from '@src/util/FeatureFetcher';
import { bucketIdToCssClass } from '@src/util/bucket_id_to_css_class';
import { ContactInitialFormData } from '@src/components/pages/contact/ContactInitialFormData';

interface ContactFormModel {
	message: string;
	contactFormValidationPatterns: ContactFormValidation;
	submitted_form_data: ContactInitialFormData;
	contact_categories: Record<string, string>;
	errors: string[];
}

const PAGE_IDENTIFIER = 'contact-form';
const pageData = new PageDataInitializer<ContactFormModel>( '#appdata' );
const featureFetcher = createFeatureFetcher( pageData.selectedBuckets, pageData.activeFeatures );

createVueApp(
	App,
	pageData.messages,
	pageData.allowedCampaignParameters,
	featureFetcher,
	{
		assetsPath: pageData.assetsPath,
		bucketClasses: bucketIdToCssClass( pageData.selectedBuckets ),
		pageIdentifier: PAGE_IDENTIFIER,
		page: Contact,
		pageTitle: 'contact_form_page_title',
		pageProps: {
			contactCategories: pageData.applicationVars.contact_categories,
			errors: pageData.applicationVars.errors,
			initialFormData: pageData.applicationVars.submitted_form_data,
			validationPatterns: pageData.applicationVars.contactFormValidationPatterns,
		},
	}
).mount( '#app' );
