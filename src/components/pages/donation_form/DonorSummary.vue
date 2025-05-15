<template>
	<div class="donor-summary" v-if="hasData">
		<h3>{{ $t('donation_summary_contact_data_header') }}</h3>
		<p v-if="address.fullName">{{ address.fullName }}</p>
		<p v-if="address.streetAddress">{{ cleanedStreetAddress }}</p>
		<p v-if="address.postalCode || address.city">
			{{ address.postalCode }} {{ address.city }}
		</p>
		<p v-if="country">{{ country }}</p>
		<p v-if="email">{{ email }}</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { clearStreetAndBuildingNumberSeparator } from '@src/util/street_and_building_number_tools';
import { Country } from '@src/view_models/Country';
import type { Salutation } from '@src/view_models/Salutation';

const props = defineProps<{
	address: Record<string, string>;
	countries: Array<Country>;
	salutations: Array<Salutation>;
}>();

const { t } = useI18n();

const cleanedStreetAddress = computed( () =>
	clearStreetAndBuildingNumberSeparator( props.address.streetAddress || '' )
);

const email = computed(() =>
	props.address.email || t('donation_confirmation_review_email_missing')
);

const country = computed(() => {
	const countryObject = props.countries.find(
		(c) =>
			c.countryCode === props.address.countryCode ||
			c.countryCode === props.address.country
	);
	return countryObject ? countryObject.countryFullName : '';
});

const hasData = computed(() =>
	props.address.fullName ||
	props.address.streetAddress ||
	props.address.postalCode ||
	props.address.city ||
	props.address.email
);
</script>
