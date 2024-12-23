import { Salutation } from '@src/view_models/Salutation';
import { MembershipApplication } from '@src/Domain/Membership/MembershipApplication';
import { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import { Country } from '@src/view_models/Country';

export interface MembershipApplicationConfirmationData {
	piwik: {
		membershipApplicationConfirmationGoalId: number;
	};
	salutations: Array<Salutation>;
	membershipApplication: MembershipApplication;
	address: MembershipAddress;
	countries: Country[];
	tracking?: string;
}
