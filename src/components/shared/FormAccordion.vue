<template>

	<div class="form-accordion" :style="{ '--transition-time' : `${ TRANSITION_TIME }ms` }">
		<div class="form-accordion-item"
			:class="{ 'form-accordion-item--open': paymentOpen, 'form-accordion-item--animating': paymentAnimating }">
			<button class="form-accordion-item-button" @click="togglePayment"
				:class="{ 'form-accordion-payment-button-complete' : paymentComplete }">
				<span class="form-accordion-item-button-text">
					<slot name="payment-title"/>
				</span>
				<span class="form-accordion-item-button-icon">
					<SuccessIcon v-if="paymentComplete"/>
					<WarningIcon v-else/>
				</span>
			</button>
			<div class="form-accordion-item-content-wrapper" :style="{ '--height' : `${ paymentContentHeight }px` }">
				<div class="form-accordion-item-content" ref="paymentContent">
					<slot name="payment-content"/>
				</div>
			</div>
		</div>
		<div class="form-accordion-item" :class="{ 'form-accordion-item--open' : addressOpen, 'form-accordion-item--animating': addressAnimating }">
			<button class="form-accordion-item-button" @click="toggleAddress">
				<span class="form-accordion-item-button-text">
					<slot name="address-title"/>
				</span>
			</button>
			<div class="form-accordion-item-content-wrapper" :style="{ '--height' : `${ addressContentHeight }px` }">
				<div class="form-accordion-item-content" ref="addressContent">
					<slot name="address-content"/>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
import SuccessIcon from '@src/components/shared/icons/SuccessIcon.vue';
import WarningIcon from '@src/components/shared/icons/WarningIcon.vue';
import { useFormAccordionItem } from '@src/components/shared/useFormAccordionItem';
import { ref, watch } from 'vue';

const TRANSITION_TIME = 500;

interface Props {
	pageIndex: 0 | 1;
	startPaymentComplete: boolean;
}

const props = defineProps<Props>();
const paymentComplete = ref<boolean>( props.startPaymentComplete );

const {
	itemOpen: paymentOpen,
	itemAnimating: paymentAnimating,
	itemContent: paymentContent,
	itemContentHeight: paymentContentHeight,
	open: openPayment,
	close: closePayment,
	toggleItem: togglePayment,
} = useFormAccordionItem( TRANSITION_TIME, props.pageIndex === 0 );

const {
	itemOpen: addressOpen,
	itemAnimating: addressAnimating,
	itemContent: addressContent,
	itemContentHeight: addressContentHeight,
	open: openAddress,
	close: closeAddress,
	toggleItem: toggleAddress,
} = useFormAccordionItem( TRANSITION_TIME, props.pageIndex === 1 );

watch( () => props.pageIndex, ( newIndex: number ) => {
	if ( newIndex === 0 ) {
		openPayment();
		closeAddress();
	} else {
		paymentComplete.value = true;
		closePayment();
		openAddress();
	}
} );

</script>

<style lang="scss">
@use '@src/scss/settings/global';
@use '@src/scss/settings/units';
@use '@src/scss/settings/colors';
@use 'sass:map';

.form-accordion-item {
	&-content-wrapper {
		overflow: hidden;
		height: 0;
		transition: height var(--transition-time) global.$easing;
	}

	&-content {
		padding: map.get(units.$spacing, 'small') 0;
	}

	&-button {
		border: 0;
		background: colors.$gray-light;
		border-bottom: 2px solid colors.$gray-mid;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: map.get(units.$spacing, 'xx-large');
		padding: map.get(units.$spacing, 'small');
		font-size: 16px;
		font-weight: bold;
		text-align: left;
		cursor: pointer;

		&-icon {
			display: flex;
			align-items: center;
		}
	}

	&--animating {
		.form-accordion-item-content-wrapper {
			height: var(--height);
		}
	}

	&--open {
		.form-accordion-item-content-wrapper {
			height: auto;
		}
	}
}
</style>
