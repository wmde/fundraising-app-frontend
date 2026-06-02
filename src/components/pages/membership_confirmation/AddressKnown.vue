<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><SuccessIcon/></template>
				<template #content>
					<h2>
<!--						{{ $t( membershipApplication.receipt ? 'membership_confirmation_summary_title' : 'membership_confirmation_summary_title_no_receipt_wanted' ) }}-->
						{{ $t( 'membership_confirmation_summary_title' ) }}
					</h2>
				</template>
			</IconText>

			<div class="address-summary">
				<p v-if="address.applicantType === 'person'"
				v-html="$t( 'membership_confirmation_address_person', {
					salutation: salutation,
					fullName: address.fullName,
					streetAddress: address.streetAddress,
					postalCode: address.postalCode,
					city: address.city,
					country: country
				} )"></p>

				<p v-else
				v-html="$t( 'membership_confirmation_address_company', {
					fullName: address.fullName,
					streetAddress: address.streetAddress,
					postalCode: address.postalCode,
					city: address.city,
					country: country
				} )"></p>
			</div>

			<div class="payment-email"
				v-html="$t( 'confirmation_page_email', { email: address.email } )">
			</div>

			<div>
				{{ $t( 'confirmation_page_address_update' ) }}

				<ButtonLink
					id="update-address-link"
					aria-controls="address-change-modal"
					:aria-expanded="modalIsVisible"
					@click="$emit( 'show-address-modal' )"
				>
					{{ $t( 'confirmation_page_address_update_link' ) }}
				</ButtonLink>
			</div>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MembershipAddress } from '@src/Domain/Membership/MembershipAddress';
import type { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import ButtonLink from '@src/components/shared/ButtonLink.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	modalIsVisible: boolean;
	address: MembershipAddress;
	countries: Country[];
	salutations: Salutation[];
}

const props = defineProps<Props>();

const country = computed( () => {
	const countryObject = props.countries.find(
		c => c.countryCode === props.address.countryCode
	);

	return countryObject ? countryObject.countryFullName : '';
} );

const salutation = computed( () => {
	if ( !props.address.salutation ) {
		return '';
	}

	return props.salutations.find(
		s => s.label === props.address.salutation
	)?.display ?? '';
} );
</script>