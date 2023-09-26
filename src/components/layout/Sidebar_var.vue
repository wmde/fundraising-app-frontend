<template>
	<div class="sidebar-cards">
		<div class="sidebar-card">
			<p class="sidebar-card-title"><InfoIcon/><strong>{{ $t('sidebar_getintouch_headline') }}</strong></p>
			<p v-html="$t('sidebar_getintouch_text')"></p>
			<p class="has-margin-top-18">{{ $t('sidebar_getintouch_text_phone') }}</p>
			<slot name="default"/>
		</div>
		<div class="sidebar-card">
			<p class="sidebar-card-title"><BankIcon/><strong>{{ $t('bank_data_title') }}</strong></p>
			<BankData/>
		</div>
	</div>
</template>

<script setup lang="ts">
import BankData from '@src/components/BankData.vue';
import BankIcon from '@src/components/shared/icons/BankIcon.vue';
import InfoIcon from '@src/components/shared/icons/InfoIcon.vue';
</script>

<style lang="scss">
@use "@src/scss/settings/units";
@use "@src/scss/settings/colors";
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.sidebar-cards {
	@include breakpoints.tablet-up {
		padding: 0 map.get( units.$spacing, 'small' );
	}
}

.sidebar-card {
	background: colors.$white;
	padding: map.get( units.$spacing, 'small' );
	border-bottom: 1px solid colors.$primary;
	margin-bottom: map.get( units.$spacing, 'small' );

	&:last-child {
		margin-bottom: 0;
	}

	&-title {
		position: relative;
		padding-left: 24px;
		svg {
			position: absolute;
			left: 0;
			top: 5px;
		}
	}
}
</style>
