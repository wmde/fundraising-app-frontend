<template>
	<ContentCard class="membership-fee-success-page">
		<template #content>
			<IconText>
				<template #icon><SuccessIcon/></template>
				<template #content>
					<div class="flow">
						<h2>{{ $t('membership_fee_upgrade_confirmation_headline') }}</h2>
						<AlertBox data-neutral>
							<p>
								{{ $t('membership_fee_upgrade_confirmation_summary_box' ) }}
								{{ $t( 'donation_form_payment_interval_' + currentInterval ) }}
								<strong>{{ $n( newFee / 100, { key: 'currency', currencyDisplay: 'name' }  ) }}</strong>
							</p>
						</AlertBox>
						<p>{{ $t('membership_fee_upgrade_confirmation_text') }}</p>
					</div>
				</template>
			</IconText>
		</template>
	</ContentCard>
</template>

<script setup lang="ts">
import ContentCard from '@src/components/patterns/ContentCard.vue';
import IconText from '@src/components/patterns/IconText.vue';
import AlertBox from '@src/components/patterns/AlertBox.vue';
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';

interface Props {
	newFee: number;
	currentInterval: number;
}

defineProps<Props>();

</script>
