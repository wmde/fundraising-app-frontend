<template>
	<ContentCard>
		<template #content>
			<IconText>
				<template #icon><WarningIcon/></template>
				<template #content><h2>{{ $t( 'donation_confirmation_exported_title' ) }}</h2></template>
			</IconText>
			<p>
				{{ $t( 'donation_confirmation_exported_content' ) }}
			</p>
		</template>
	</ContentCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import IconText from '@src/components/patterns/IconText.vue';
import ContentCard from '@src/components/patterns/ContentCard.vue';

export default defineComponent( {
	name: 'DonationExported',
	components: { ContentCard, IconText, WarningIcon },
	props: {
		addressType: String,
	},
} );

</script>
