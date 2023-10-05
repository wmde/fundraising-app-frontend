<template>
	<div class="payment-form">
		<FormSection :title="$t('donation_form_payment_amount_title')" title-margin="small">
			<AmountField
				v-model="amount"
				:payment-amounts="paymentAmounts"
				:error-message="amountErrorMessage"
				:show-error="amountErrorMessage !== ''"
			/>
		</FormSection>

		<FormSection :title="$t('donation_form_payment_interval_title')" title-margin="x-small">
			<RadioField
				name="interval"
				v-model="interval"
				:options="paymentIntervalsAsOptions"
				:required="true"
				:disabled="disabledPaymentIntervals"
				alignment="column"
			/>
		</FormSection>

		<FormSection :title="$t('donation_form_payment_type_title')" title-margin="x-small">
			<RadioField
				name="paymentType"
				v-model="paymentType"
				:options="paymentTypesAsOptions"
				:required="true"
				:disabled="disabledPaymentTypes"
				alignment="column"
				:show-error="!paymentTypeIsValid"
				:error-message="$t('donation_form_payment_type_error')"
			>
				<template #message-BEZ>
					<div v-if="disabledPaymentTypes.includes( 'BEZ' )" class="option-info-message">
						{{ $t( 'donation_form_address_choice_direct_debit_disclaimer' ) }}
					</div>
				</template>
				<template #message-SUB>
					<div v-if="disabledPaymentTypes.includes( 'SUB' )" class="option-info-message">
						{{ $t( 'donation_form_SUB_payment_type_info' ) }}
					</div>
				</template>
			</RadioField>
		</FormSection>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { setAmount, setInterval, setType } from '@src/store/payment/actionTypes';
import { useStore } from 'vuex';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { AmountValidity } from '@src/view_models/Payment';
import { useI18n } from 'vue-i18n';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { FormOption } from '@src/components/shared/form_fields/FormOption';
import { usePaymentFieldModel } from '@src/components/pages/donation_form/usePaymentFieldModel';
import { Validity } from '@src/view_models/Validity';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';

interface Props {
	paymentAmounts: number[];
	paymentIntervals: number[];
	paymentTypes: string[];
}

const props = defineProps<Props>();

const store = useStore();
const { t } = useI18n();

const amount = usePaymentFieldModel( store, 'amount', setAmount );
const interval = usePaymentFieldModel( store, 'interval', setInterval );
const paymentType = usePaymentFieldModel( store, 'type', setType );
const paymentTypeIsValid = computed<boolean>( () => store.state[ NS_PAYMENT ].validity.type !== Validity.INVALID );

const paymentIntervalsAsOptions = computed<FormOption[]>( () => {
	return props.paymentIntervals.map(
		( intervalValue: number ) => (
			{ value: intervalValue.toString(), label: t( 'donation_form_payment_interval_' + intervalValue ) }
		) );
} );

const paymentTypesAsOptions = computed<FormOption[]>( () => {
	return props.paymentTypes.map(
		( paymentTypeValue: string ) => ( { value: paymentTypeValue, label: t( paymentTypeValue ) } )
	);
} );

const disabledPaymentTypes = computed<string[]>( () => {
	let disabledTypes: string[] = [];
	if ( store.state[ NS_ADDRESS ].addressType === AddressTypeModel.ANON ) {
		disabledTypes.push( 'BEZ' );
	}
	if ( store.state[ NS_PAYMENT ].values.interval !== '0' ) {
		disabledTypes.push( 'SUB' );
	}
	return disabledTypes;
} );

const disabledPaymentIntervals = computed<string[]>( () => {
	let disabledIntervals: string[] = [];
	if ( store.state[ NS_PAYMENT ].values.type === 'SUB' ) {
		disabledIntervals = props.paymentIntervals
			.filter( ( x: number ) => Number( x ) > 0 )
			.map( ( x: number ) => String( x ) );
	}
	return disabledIntervals;
} );

const amountErrorMessage = computed<String>( () => {
	const messages: { [ key: number ]: string; } = {
		[ AmountValidity.AMOUNT_VALID ]: '',
		[ AmountValidity.AMOUNT_TOO_LOW ]: t( 'donation_form_payment_amount_error' ),
		[ AmountValidity.AMOUNT_TOO_HIGH ]: t( 'donation_form_payment_amount_too_high' ),
	};
	return messages[ store.getters[ NS_PAYMENT + '/amountValidity' ] ];
} );

</script>
