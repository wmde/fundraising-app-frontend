<template>
	<div class="contact-form">
		<h1 class="title">{{ $t( 'contact_form_title' ) }}</h1>
		<div class="contact-form-errors" v-if="contactData.errors">
			<p class="help is-danger">{{ $t('contact_form_error') }}</p>
			<span class="help is-danger" v-for="error in contactData.errors">{{ $t( error ) }}</span>
		</div>
		<form method="post" action="/contact/get-in-touch" v-on:submit.prevent="submit" id="laika-contact" ref="form">
			<FormSection>
				<TextField
					name="firstname"
					input-id="firstname"
					v-model="formData.firstname.value"
					:label="$t( 'contact_form_firstname_label' )"
					:label-help-text="$t('contact_form_optional')"
					:placeholder="$t( 'form_for_example', { example: $t( 'contact_form_firstname_placeholder' ) } )"
					:show-error="formData.firstname.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_firstname_error' )"
				/>

				<TextField
					name="lastname"
					input-id="lastname"
					v-model="formData.lastname.value"
					:label="$t( 'contact_form_lastname_label' )"
					:label-help-text="$t('contact_form_optional')"
					:placeholder="$t( 'form_for_example', { example: $t( 'contact_form_lastname_placeholder' ) } )"
					:show-error="formData.lastname.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_lastname_error' )"
				/>

				<TextField
					name="donationNumber"
					input-id="donationNumber"
					v-model="formData.donationNumber.value"
					:label="$t( 'contact_form_donation_number_label' )"
					:label-help-text="$t('contact_form_optional')"
					:placeholder="$t( 'form_for_example', { example: $t( 'contact_form_donation_number_placeholder' ) } )"
					:show-error="formData.donationNumber.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_donation_number_error' )"
				/>
			</FormSection>

			<FormSection>

				<EmailField
					v-model="formData.email.value"
					:show-error="formData.email.validity === Validity.INVALID"
				/>

				<SelectField
					v-model="formData.topic.value"
					name="category"
					:label="$t( 'contact_form_topic_placeholder' )"
					:options="[
						{ label: $t( 'contact_form_topic_placeholder' ), value: '' },
						...Object.values( contactData.contact_categories ).map( ( value: string ) => ( { label: value, value: value } ) )
					]"
				/>

				<TextField
					name="subject"
					input-id="subject"
					v-model="formData.subject.value"
					:label="$t( 'contact_form_subject_label' )"
					:placeholder="$t( 'form_for_example', { example: $t( 'contact_form_subject_placeholder' ) } )"
					:show-error="formData.subject.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_subject_error' )"
				/>

				<TextField
					name="messageBody"
					input-type="textarea"
					input-id="messageBody"
					v-model="formData.comment.value"
					:label="$t( 'contact_form_body_label' )"
					placeholder=""
					:show-error="formData.comment.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_body_error' )"
				/>

				<div class="contact-form-button">
					<FormButton
						id="submit-btn"
						button-type="submit"
					>
						{{ $t('contact_form_submit_button') }}
					</FormButton>
				</div>
			</FormSection>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FormData } from '@src/view_models/Contact';
import { Helper } from '@src/store/util';
import { Validity } from '@src/view_models/Validity';
import { ContactFormValidation } from '@src/view_models/Validation';
import { trackFormSubmission } from '@src/util/tracking';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';
import FunButton from '@src/components/shared/legacy_form_inputs/FunButton.vue';
import FunSelect from '@src/components/shared/legacy_form_inputs/FunSelect.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';

export default defineComponent( {
	name: 'Contact',
	components: { FormSection, FormSummary, FormButton, SelectField, EmailField, TextField, FunSelect, FunButton, TextInput },
	data: function (): { formData: FormData } {
		return {
			formData: {
				firstname: {
					name: 'name',
					value: this.$props.contactData.firstname ? this.$props.contactData.firstname : '',
					pattern: this.$props.validationPatterns.firstName,
					optionalField: true,
					validity: Validity.VALID,
				},
				lastname: {
					name: 'lastname',
					value: this.$props.contactData.lastname ? this.$props.contactData.lastname : '',
					pattern: this.$props.validationPatterns.lastName,
					optionalField: true,
					validity: Validity.VALID,
				},
				donationNumber: {
					name: 'donationNumber',
					value: this.$props.contactData.donationNumber ? this.$props.contactData.donationNumber : '',
					pattern: this.$props.validationPatterns.donationNumber,
					optionalField: true,
					validity: Validity.VALID,
				},
				email: {
					name: 'email',
					value: this.$props.contactData.email ? this.$props.contactData.email : '',
					pattern: this.$props.validationPatterns.email,
					optionalField: false,
					validity: Validity.INCOMPLETE,
				},
				topic: {
					name: 'topic',
					value: this.$props.contactData.category ? this.$i18n.t( this.$props.contactData.category ) as string : '',
					pattern: this.$props.validationPatterns.topic,
					optionalField: false,
					validity: Validity.INCOMPLETE,
				},
				subject: {
					name: 'subject',
					value: this.$props.contactData.subject ? this.$props.contactData.subject : '',
					pattern: this.$props.validationPatterns.subject,
					optionalField: false,
					validity: Validity.INCOMPLETE,
				},
				comment: {
					name: 'comment',
					value: this.$props.contactData.messageBody ? this.$props.contactData.messageBody : '',
					pattern: this.$props.validationPatterns.comment,
					optionalField: false,
					validity: Validity.INCOMPLETE,
				},
			},
		};
	},
	props: {
		contactData: Object,
		validationPatterns: Object as () => ContactFormValidation,
	},
	computed: {
		Validity: {
			get() {
				return Validity;
			},
		},
	},
	methods: {
		submit() {
			let isValid = true;
			Object.keys( this.$data.formData ).forEach( ( fieldName: string ) => {
				let field = this.$data.formData[ fieldName ];
				field.validity = Helper.inputIsValid( field.value, field.pattern, field.optionalField );
				if ( field.validity !== Validity.VALID ) {
					isValid = false;
				}
			} );
			if ( isValid ) {
				const form = this.$refs.form as HTMLFormElement;
				trackFormSubmission( form );
				form.submit();
			}
		},
	},
} );
</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.contact-form {

	&-errors {
		margin-bottom: map.get( units.$spacing, 'large' );
	}

	.form-section:not( :last-child ) {
		margin-bottom: map.get( units.$spacing, 'xx-large' );
	}
}
</style>
