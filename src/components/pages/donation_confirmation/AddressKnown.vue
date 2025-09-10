<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><SuccessIcon/></template>
				<template #content><h2>{{ $t( donation.receipt ? 'donation_confirmation_summary_title' : 'donation_confirmation_summary_title_no_receipt_wanted' ) }}</h2></template>
			</IconText>

			<div class="address-summary">
				<p v-if="addressType === 'person'" v-html="$t( 'donation_confirmation_address_person', {
					salutation: salutation,
					fullName: address.fullName,
					streetAddress: address.street,
					postalCode: address.postcode,
					city: address.city,
					country: country
				} )"></p>
				<p v-else v-html="$t( 'donation_confirmation_address_company', {
					fullName: address.fullName,
					streetAddress: address.street,
					postalCode: address.postcode,
					city: address.city,
					country: country
				} )"></p>
			</div>
			<div class="payment-email" v-html="$t( 'donation_confirmation_email', { email: address.email } )"></div>
			<div>
				{{ $t( 'donation_confirmation_address_update' ) }}
				<ButtonLink
					id="update-address-link"
					aria-controls="address-change-modal"
					:aria-expanded="modalIsVisible"
					@click="$emit( 'show-address-modal' )"
				>
					{{ $t( 'donation_confirmation_address_update_link' ) }}
				</ButtonLink>
			</div>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Donation } from '@src/view_models/Donation';
import type { Country } from '@src/view_models/Country';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import { TranslateResult } from 'vue-i18n';
import type { Address } from '@src/view_models/Address';
import type { Salutation } from '@src/view_models/Salutation';
import ButtonLink from '@src/components/shared/ButtonLink.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';

interface Props {
	modalIsVisible: boolean;
	donation: Donation;
	address: Address;
	addressType: string;
	countries: Country[];
	salutations: Salutation[];
}

const props = defineProps<Props>();
const country = computed<string>( () => {
	const countryObject = props.countries.find( c => ( c.countryCode === props.address.country ) );
	return countryObject ? countryObject.countryFullName : '';
} );
const salutation = computed<string | TranslateResult>( () => {
	if ( !props.address.salutation || props.address.salutation === '' ) {
		return '';
	}
	return props.salutations.find( s => s.label === props.address.salutation )?.display;
} );

</script>
