export const appendCampaignQueryParams = ( htmlContent: string, campaignParams: string ): string => {
	return htmlContent.replace(
		// check for absolute paths and fully-qualified links to fundraising application,
		// ignore absolute paths to resources folder
		/href="((\/(?!resources)|https:\/\/spenden\.wikimedia\.de)[^"]*)"/g,
		`href="$1?${campaignParams}"`
	);
};
