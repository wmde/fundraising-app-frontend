<template>
	<template v-if="displaySections.includes( 'amount' )">
		<AmountField
			v-model="amount"
			:label="$t('donation_form_payment_amount_title')"
			:payment-amounts="paymentAmounts"
			:error-message="amountErrorMessage"
			:show-error="amountErrorMessage !== ''"
		/>
	</template>

	<RadioField
		v-if="displaySections.includes( 'interval' )"
		id="payment-form-interval"
		name="interval"
		v-model="interval"
		:label="$t('donation_form_payment_interval_title')"
		:options="paymentIntervalsAsOptions"
		:disabled="disabledPaymentIntervals"
		layout="halves"
		data-max-width
	/>

	<RadioField
		v-if="displaySections.includes( 'paymentType' )"
		name="paymentType"
		id="payment-form-type"
		input-id="paymentType"
		v-model="paymentType"
		:label="$t('donation_form_payment_type_title')"
		:options="paymentTypesAsOptions"
		:disabled="disabledPaymentTypes"
		layout="halves"
		:show-error="!paymentTypeIsValid"
		:error-message="$t('donation_form_payment_type_error')"
		data-max-width
	>
		<template #tooltip-BEZ>
			<Tooltip v-if="disabledPaymentTypes.includes( 'BEZ' )">
				{{ $t( 'donation_form_address_choice_direct_debit_disclaimer' ) }}
			</Tooltip>
		</template>
		<template #tooltip-SUB>
			<Tooltip v-if="disabledPaymentTypes.includes( 'SUB' )">
				{{ $t( 'donation_form_SUB_payment_type_info' ) }}
			</Tooltip>
		</template>
	</RadioField>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';
import { useI18n } from 'vue-i18n';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import type { CheckboxFormOption } from '@src/components/shared/form_fields/FormOptions';
import { usePaymentFieldModel } from '@src/components/pages/donation_form/usePaymentFieldModel';
import { Validity } from '@src/view_models/Validity';
import Tooltip from '@src/components/patterns/Tooltip.vue';
import { DisplaySectionCollection } from '@src/components/pages/donation_form/Payment';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
	displaySections?: DisplaySectionCollection;
}

const props = withDefaults( defineProps<Props>(), {
	displaySections: () => [ 'amount', 'interval', 'paymentType' ],
} );

const store = useStore();
const { t } = useI18n();

const amount = usePaymentFieldModel( store, 'amount', 'setAmount' );
const interval = usePaymentFieldModel( store, 'interval', 'setInterval' );
const paymentType = usePaymentFieldModel( store, 'type', 'setType' );
const paymentTypeIsValid = computed<boolean>( () => store.state.payment.validity.type !== Validity.INVALID );

const paymentIntervalsAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number, index: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ), id: `interval-${ index }` }
		) );
} );

const paymentTypesAsOptions = computed<CheckboxFormOption[]>( () => {
	return props.paymentTypes.map(
		( paymentTypeValue: string, index: number ) => ( { value: paymentTypeValue, label: t( paymentTypeValue ), id: `paymentType-${ index }` } )
	);
} );

const disabledPaymentTypes = computed<string[]>( () => {
	let disabledTypes: string[] = [];
	if ( store.state.address.addressType === AddressTypeModel.ANON ) {
		disabledTypes.push( 'BEZ' );
	}
	if ( store.state.payment.values.interval !== '0' ) {
		disabledTypes.push( 'SUB' );
	}
	return disabledTypes;
} );

const disabledPaymentIntervals = computed<string[]>( () => {
	let disabledIntervals: string[] = [];
	if ( store.state.payment.values.type === 'SUB' ) {
		disabledIntervals = props.paymentIntervals
			.filter( ( x: number ) => Number( x ) > 0 )
			.map( ( x: number ) => String( x ) );
	}
	return disabledIntervals;
} );

const amountErrorMessage = computed<String>( () => {
	const messages: { [ key: number ]: string } = {
		[ AmountValidity.AMOUNT_VALID ]: '',
		[ AmountValidity.AMOUNT_TOO_LOW ]: t( 'donation_form_payment_amount_error' ),
		[ AmountValidity.AMOUNT_TOO_HIGH ]: t( 'donation_form_payment_amount_too_high' ),
	};
	return messages[ store.getters[ 'payment/amountValidity' ] ];
} );

</script>
