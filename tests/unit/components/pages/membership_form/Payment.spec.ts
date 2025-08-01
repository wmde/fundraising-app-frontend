import { mount, VueWrapper } from '@vue/test-utils';
import Payment from '@src/components/pages/membership_form/Payment.vue';
import { createStore } from '@src/store/membership_store';
import { action } from '@src/store/util';
import AmountField from '@src/components/shared/form_fields/AmountField.vue';
import { nextTick } from 'vue';
import { Store } from 'vuex';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import type { GenericValuePayload } from '@src/view_models/MembershipFee';
import { AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { FakeBankValidationResource } from '@test/unit/TestDoubles/FakeBankValidationResource';
import IbanFields from '@src/components/shared/IbanFields.vue';

describe( 'Payment.vue', () => {
	let store: Store<any>;

	const getWrapper = (): VueWrapper<any> => {
		store = createStore();
		return mount( Payment, {
			props: {
				validateFeeUrl: 'https://example.com/amount-check',
				paymentAmounts: [ 500, 1000, 10000 ],
				paymentIntervals: [ 1, 3, 6, 12 ],
				paymentTypes: [ 'BEZ', 'UEB' ],
				validateBankDataUrl: 'https://example.com/amount-check',
				validateLegacyBankDataUrl: 'https://example.com/amount-check',
			},
			global: {
				plugins: [ store ],
				provide: {
					'paymentPageRef': { focus: () => {} },
					bankValidationResource: new FakeBankValidationResource(),
				},
			},
		} );
	};

	it( 'sends amount to store when amount model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();
		const expectedPayload: GenericValuePayload = {
			selectedValue: '1500',
			validateFeeUrl: 'https://example.com/amount-check',
		};

		wrapper.findComponent( AmountField ).vm.$emit( 'update:modelValue', expectedPayload.selectedValue );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( 'membership_fee', 'setFee' ), expectedPayload );
	} );

	it( 'shows bank data when payment type is selected and removes it when unselected', async () => {
		const wrapper = getWrapper();
		expect( wrapper.findComponent( IbanFields ).exists() ).toBeFalsy();

		await wrapper.find( '[name="paymentType"][value="BEZ"]' ).trigger( 'change' );

		expect( wrapper.findComponent( IbanFields ).exists() ).toBeTruthy();

		await wrapper.find( '[name="paymentType"][value="UEB"]' ).trigger( 'change' );

		expect( wrapper.findComponent( IbanFields ).exists() ).toBeFalsy();
	} );

	it( 'sends interval to store when interval model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();
		const expectedPayload: GenericValuePayload = {
			selectedValue: '6',
			validateFeeUrl: 'https://example.com/amount-check',
		};

		wrapper.findAllComponents( RadioField )[ 0 ].vm.$emit( 'update:modelValue', expectedPayload.selectedValue );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( 'membership_fee', 'setInterval' ), expectedPayload );
	} );

	it( 'sends payment type to store when payment model updates', async () => {
		const wrapper = getWrapper();
		store.dispatch = jest.fn();
		const expectedPayload: GenericValuePayload = {
			selectedValue: 'PPL',
			validateFeeUrl: 'https://example.com/amount-check',
		};

		wrapper.findAllComponents( RadioField )[ 1 ].vm.$emit( 'update:modelValue', expectedPayload.selectedValue );
		await nextTick();

		expect( store.dispatch ).toBeCalledWith( action( 'membership_fee', 'setType' ), expectedPayload );
	} );

	it( 'unsets selected fee when it is below the allowed minimum amount', async () => {
		const wrapper = getWrapper();
		const lowSelectableFeeValue = '500';

		await wrapper.findComponent( AmountField ).setValue( lowSelectableFeeValue );

		// selects first input element of the AmountField
		const lowFeeInputElement = wrapper.findComponent( AmountField ).find<HTMLInputElement>( 'input' );
		expect( lowFeeInputElement.element ).toBeChecked();

		// address type changes / interval changes
		await store.dispatch( action( 'membership_address', 'setAddressType' ), AddressTypeModel.COMPANY );
		await store.dispatch( action( 'membership_fee', 'setInterval' ), {
			selectedValue: '12',
			validateFeeUrl: 'https://example.com/amount-check',
		} );
		await nextTick();

		expect( lowFeeInputElement.element ).not.toBeChecked();
		expect( lowFeeInputElement.element ).toBeDisabled();
	} );

	it( 'Does not show fee error when field is empty and interval changes', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '[name="interval"][value="12"]' ).trigger( 'click' );

		expect( wrapper.find( '.form-field-amount .is-danger' ).exists() ).toBeFalsy();
	} );

	it( 'Does not show fee error when field is filled and amount is above minimum value', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="amount"][value="10000"]' ).trigger( 'click' );
		await wrapper.find( '[name="interval"][value="12"]' ).trigger( 'click' );

		expect( wrapper.find( '.form-field-amount .is-danger' ).exists() ).toBeFalsy();
	} );

	it( 'Shows fee error when field is filled and amount is below minimum value', async () => {
		const wrapper = getWrapper();

		await wrapper.find( 'input[name="amount"][value="500"]' ).trigger( 'click' );
		await wrapper.find( '[name="interval"][value="12"]' ).trigger( 'click' );

		expect( wrapper.find( '.form-field-amount .is-danger' ).exists() ).toBeFalsy();
	} );
} );
