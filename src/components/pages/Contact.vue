<template>
	<div class="contact-form">
		<h1>{{ $t( 'contact_form_title' ) }}</h1>
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
					:show-error="formData.topic.validity === Validity.INVALID"
					:error-message="$t( 'contact_form_topic_error' )"
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

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Helper } from '@src/store/util';
import { Validity } from '@src/view_models/Validity';
import { ContactFormValidation } from '@src/view_models/Validation';
import { trackFormSubmission } from '@src/util/tracking';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import EmailField from '@src/components/shared/form_fields/EmailField.vue';
import SelectField from '@src/components/shared/form_fields/SelectField.vue';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSection from '@src/components/shared/form_elements/FormSection.vue';
import { useI18n } from 'vue-i18n';

interface ContactData {
	contact_categories: Record<string, string>;
	firstname?: string;
	lastname?: string;
	donationNumber?: string;
	email?: string;
	category?: string;
	subject?: string;
	messageBody?: string;
	errors?: string[];
}

interface FormItem {
	name: string;
	value: string;
	pattern: string;
	optionalField: boolean;
	validity: Validity;
}

interface FormData {
	firstname: FormItem;
	lastname: FormItem;
	donationNumber: FormItem;
	email: FormItem;
	topic: FormItem;
	subject: FormItem;
	comment: FormItem;
}

interface Props {
	contactData: ContactData;
	validationPatterns: ContactFormValidation;
}

const props = defineProps<Props>();
const { t } = useI18n();

const form = ref<HTMLFormElement>( null );
const formData = reactive<FormData>( {
	firstname: {
		name: 'name',
		value: props.contactData.firstname ? props.contactData.firstname : '',
		pattern: props.validationPatterns.firstname,
		optionalField: true,
		validity: Validity.VALID,
	},
	lastname: {
		name: 'lastname',
		value: props.contactData.lastname ? props.contactData.lastname : '',
		pattern: props.validationPatterns.lastname,
		optionalField: true,
		validity: Validity.VALID,
	},
	donationNumber: {
		name: 'donationNumber',
		value: props.contactData.donationNumber ? props.contactData.donationNumber : '',
		pattern: props.validationPatterns.donationNumber,
		optionalField: true,
		validity: Validity.VALID,
	},
	email: {
		name: 'email',
		value: props.contactData.email ? props.contactData.email : '',
		pattern: props.validationPatterns.email,
		optionalField: false,
		validity: Validity.INCOMPLETE,
	},
	topic: {
		name: 'topic',
		value: props.contactData.category ? t( props.contactData.category ) as string : '',
		pattern: props.validationPatterns.topic,
		optionalField: false,
		validity: Validity.INCOMPLETE,
	},
	subject: {
		name: 'subject',
		value: props.contactData.subject ? props.contactData.subject : '',
		pattern: props.validationPatterns.subject,
		optionalField: false,
		validity: Validity.INCOMPLETE,
	},
	comment: {
		name: 'comment',
		value: props.contactData.messageBody ? props.contactData.messageBody : '',
		pattern: props.validationPatterns.comment,
		optionalField: false,
		validity: Validity.INCOMPLETE,
	},
} );

const submit = (): void => {
	let isValid = true;
	Object.keys( formData ).forEach( ( fieldName: string ) => {
		let field = formData[ fieldName ];
		field.validity = Helper.inputIsValid( field.value, field.pattern, field.optionalField );
		if ( field.validity !== Validity.VALID ) {
			isValid = false;
		}
	} );
	if ( isValid ) {
		trackFormSubmission( form.value );
		form.value.submit();
	}
};

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
