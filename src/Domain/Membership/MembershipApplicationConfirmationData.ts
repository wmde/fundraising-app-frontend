import type { Salutation } from '@src/view_models/Salutation';
import type { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import type { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { Country } from '@src/view_models/Country';
import { AddressValidation } from '@src/view_models/Validation';

export interface MembershipApplicationConfirmationData {
	piwik: {
		membershipApplicationConfirmationGoalId: number;
	};
	salutations: Array<Salutation>;
	membershipApplication: MembershipApplication;
	address: MembershipAddress;
	countries: Country[];
	tracking?: string;
	/*urls: {
		updateMembership: string;
		validateAddress: string;
		validateEmail: string;
	};
	addressValidationPatterns: AddressValidation;*/
}
