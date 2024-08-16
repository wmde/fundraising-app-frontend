<template>
	<fieldset class="payment-bank-data-section">
		<ScrollTarget target-id="payment-form-iban-scroll-target"/>
		<legend class="title is-size-5">{{ $t( 'donation_form_payment_bankdata_title' ) }}</legend>
		<div v-bind:class="['form-input', { 'is-invalid': bankDataIsInvalid }]">
			<label for="iban" class="form-field-label">{{ $t( labels.iban ) }}</label>
			<div class="form-field form-field-text">
				<div class="control text-form-input">
					<AccountNumberField
						:id="'iban'"
						:placeholder="$t( 'donation_form_payment_bankdata_account_iban_placeholder' )"
						:account-id="accountNumber"
						:data-track-content="getTrackingCode !== ''"
						:data-content-piece="getTrackingCode"
						@validate="validate"
						@input="setAccountId"
					/>
				</div>
			</div>
		</div>

		<TextField
			v-show="isBankFieldEnabled"
			:label="$t( labels.bic )"
			:placeholder="labels.bicPlaceholder != '' ? $t( labels.bicPlaceholder ) : ''"
			v-model="bankIdentifier"
			name="bic"
			input-id="bic"
			:show-error="bankDataIsInvalid"
			:error-message="''"
			@field-changed="validate"
		/>

		<div id="bank-name-info">
			<span v-show="bankInfoValidated" class="help">
				<span id="bank-name-legacy">
					<span id="bank-name-iban">{{ bankName }}</span><span v-show="showBankId"> ({{ bankIdentifier }})</span>
				</span>
			</span>
			<span v-if="bankInfoValidatedButInfoMissing" id="bank-name-not-available" class="help">
				{{ $t( 'donation_form_payment_bankdata_bank_bic_placeholder_full' ) }}
			</span>
			<span v-if="bankDataIsInvalid" class="help is-danger">{{ $t( 'donation_form_payment_bankdata_error' ) }}</span>
		</div>
	</fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BankAccountData, BankAccountRequest } from '@src/view_models/BankAccount';
import { action } from '@src/store/util';
import { mapGetters } from 'vuex';
import AccountNumberField from '@src/components/shared/AccountNumberField.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

export default defineComponent( {
	name: 'PaymentBankData',
	components: {
		ScrollTarget,
		TextField,
		AccountNumberField,
	},
	data: function (): BankAccountData {
		return {
			accountNumber: this.$store.getters[ 'bankdata/accountNumber' ],
			bankCode: this.$store.getters[ 'bankdata/bankCode' ],
		};
	},
	props: {
		validateBankDataUrl: String,
		validateLegacyBankDataUrl: String,
	},
	computed: {
		getTrackingCode(): string {
			if ( this.looksLikeIban() ) {
				return 'IBAN';
			} else if ( this.looksLikeBankAccountNumber() ) {
				return 'Classic';
			}
			return '';
		},
		bankInfoValidated(): boolean {
			if ( !this.$store.getters[ 'bankdata/bankDataIsValid' ] ) {
				return false;
			}
			if ( this.bankIdentifier !== '' ) {
				return true;
			}
			if ( this.$store.getters[ 'bankdata/bankCode' ] !== '' ) {
				return true;
			}
			return false;
		},
		bankInfoValidatedButInfoMissing(): boolean {
			return this.$store.getters[ 'bankdata/bankDataIsValid' ] &&
					this.bankIdentifier === '' &&
					this.$store.getters[ 'bankdata/bankCode' ] === '';
		},
		showBankId(): boolean {
			return this.bankIdentifier !== '' && this.looksLikeIban();
		},
		isBankFieldEnabled(): boolean {
			return this.looksLikeBankAccountNumber();
		},
		bankIdentifier: {
			get: function (): string {
				if ( this.looksLikeGermanIban() ) {
					return this.$store.getters[ 'bankdata/bankCode' ];
				}
				return this.$data.bankCode;
			},
			set: function ( bankCode: string ) {
				this.$data.bankCode = bankCode;
			},
		},
		labels() {
			if ( this.looksLikeIban() ) {
				return {
					iban: 'donation_form_payment_bankdata_account_iban_label',
					bic: 'donation_form_payment_bankdata_bank_bic_label',
					bicPlaceholder: 'donation_form_payment_bankdata_bank_bic_placeholder2',
				};
			} else if ( this.looksLikeBankAccountNumber() ) {
				return {
					iban: 'donation_form_payment_bankdata_account_legacy_label',
					bic: 'donation_form_payment_bankdata_bank_legacy_label',
					bicPlaceholder: 'donation_form_payment_bankdata_bank_legacy_placeholder',
				};
			}
			return {
				iban: 'donation_form_payment_bankdata_account_default_label',
				bic: 'donation_form_payment_bankdata_bank_default_label',
				bicPlaceholder: '',
			};
		},
		...mapGetters( 'bankdata', [
			'bankDataIsInvalid',
			'bankName',
		] ),
	},
	methods: {
		validate() {
			if ( !this.isAccountIdEmpty() && !this.looksLikeValidAccountNumber() ) {
				this.$store.dispatch( ( action( 'bankdata', 'markBankDataAsInvalid' ) ) );
				return;
			}
			if ( this.isAccountIdEmpty() || ( !this.looksLikeIban() && this.isBankIdEmpty() ) ) {
				this.$store.dispatch( action( 'bankdata', 'markBankDataAsIncomplete' ) );
				return;
			}
			if ( this.looksLikeIban() ) {
				this.$store.dispatch(
					action( 'bankdata', 'setBankData' ),
					{
						validationUrl: this.validateBankDataUrl,
						requestParams: { iban: this.$data.accountNumber.toUpperCase() },
					} as BankAccountRequest
				);
			} else {
				this.$store.dispatch(
					action( 'bankdata', 'setBankData' ),
						{
							validationUrl: this.validateLegacyBankDataUrl,
							requestParams: { accountNumber: this.$data.accountNumber, bankCode: this.$data.bankCode },
						} as BankAccountRequest
				);
			}
		},
		setAccountId: function ( accountNumber: string ) {
			this.$data.accountNumber = accountNumber;
		},
		isAccountIdEmpty: function () {
			return this.$data.accountNumber === '';
		},
		isBankIdEmpty: function () {
			return this.bankId === '';
		},
		looksLikeIban: function () {
			return /^[A-Z]{2}[A-Z0-9\s]+$/i.test( this.$data.accountNumber );
		},
		looksLikeBankAccountNumber: function () {
			return /^\d+$/.test( this.$data.accountNumber );
		},
		looksLikeGermanIban() {
			return /^DE[0-9\s]+$/i.test( this.$data.accountNumber );
		},
		looksLikeValidAccountNumber() {
			return this.looksLikeIban() || this.looksLikeBankAccountNumber();
		},
	},
} );
</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use '@src/scss/settings/forms';
@use 'sass:map';

.payment-bank-data-section {
  margin-bottom: 1.5rem;
}
</style>
