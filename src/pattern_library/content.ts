import { Page } from '@src/pattern_library/pages/Page';
import { Pattern } from '@src/pattern_library/patterns/Pattern';
import { Sample } from '@src/pattern_library/samples/Sample';

import cssVariables from '@src/pattern_library/pages/css-variables';
import layoutCompositions from '@src/pattern_library/pages/layout-compositions';
import utilityClasses from '@src/pattern_library/pages/utility-classes';
import fontScaling from '@src/pattern_library/pages/font-scaling';
import spacing from '@src/pattern_library/pages/spacing';

import accordion from '@src/pattern_library/patterns/accordion';
import alertBox from '@src/pattern_library/patterns/alert-box';
import button from '@src/pattern_library/patterns/button';
import combobox from '@src/pattern_library/patterns/combobox';
import contentCard from '@src/pattern_library/patterns/content-card';
import donationComment from '@src/pattern_library/patterns/donation-comment';
import fieldContainer from '@src/pattern_library/patterns/field-container';
import footerNav from '@src/pattern_library/patterns/footer-nav';
import ibanCalculator from '@src/pattern_library/patterns/iban-calculator';
import iconText from '@src/pattern_library/patterns/icon-text';
import locale from '@src/pattern_library/patterns/locale';
import mobileNavToggle from '@src/pattern_library/patterns/mobile-nav-toggle';
import modalDialogue from '@src/pattern_library/patterns/modal-dialogue';
import moreInfoToggle from '@src/pattern_library/patterns/more-info-toggle';
import nav from '@src/pattern_library/patterns/nav';
import pagination from '@src/pattern_library/patterns/pagination';
import sectionHeading from '@src/pattern_library/patterns/section-heading';
import siteFoot from '@src/pattern_library/patterns/site-foot';
import siteHead from '@src/pattern_library/patterns/site-head';
import summary from '@src/pattern_library/patterns/summary';
import textRadio from '@src/pattern_library/patterns/text-radio';
import toggle from '@src/pattern_library/patterns/toggle';
import verboseCheckbox from '@src/pattern_library/patterns/verbose-checkbox';

import compactDonationForm from '@src/pattern_library/samples/compact-donation-form';
import donationForm from '@src/pattern_library/samples/donation-form';
import membershipFeeChange from '@src/pattern_library/samples/membership-fee-change';

const pages: Page[] = [
	cssVariables,
	layoutCompositions,
	utilityClasses,
	fontScaling,
	spacing,
];

const patterns: Pattern[] = [
	accordion,
	alertBox,
	button,
	combobox,
	contentCard,
	donationComment,
	fieldContainer,
	footerNav,
	ibanCalculator,
	iconText,
	locale,
	mobileNavToggle,
	modalDialogue,
	moreInfoToggle,
	nav,
	pagination,
	sectionHeading,
	siteFoot,
	siteHead,
	summary,
	textRadio,
	toggle,
	verboseCheckbox,
];

const samples: Sample[] = [
	compactDonationForm,
	donationForm,
	membershipFeeChange,
];

export interface Content {
	pages: Page[];
	patterns: Pattern[];
	samples: Sample[];
}

export const content: Content = {
	pages,
	patterns: patterns.sort( ( x, y ) => x.name.localeCompare( y.name ) ),
	samples,
};
