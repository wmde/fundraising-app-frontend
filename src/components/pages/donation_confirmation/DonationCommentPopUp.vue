<template>
	<form class="donation-comment" name="donation-comment" v-on:submit.prevent="postComment" method="post" ref="commentForm">
		<input type="hidden" name="donationId" :value="donation.id"/>
		<input type="hidden" name="updateToken" :value="donation.updateToken">
		<div v-if="commentHasBeenSubmitted">
			<p v-html="$t( serverResponse )"></p>
			<FormButton
				button-type="button"
				:is-outlined="true"
				@click="$emit( 'close' )"
			>
				{{ $t( 'back_to_donation_summary' ) }}
			</FormButton>
		</div>
		<div v-else>
			<p>{{ $t( 'donation_comment_popup_explanation' ) }}</p>

			<TextField
				input-type="textarea"
				v-model="comment"
				name="comment"
				input-id="comment"
				placeholder=""
				:label="$t( 'donation_comment_popup_label' )"
				:error-message="$t( 'donation_comment_popup_error' )"
				:show-error="commentErrored"
				:autofocus="true"
			/>

			<CheckboxField
				v-if="showPublishAuthor"
				input-id="withName"
				name="withName"
				v-model="commentHasPublicAuthorName"
			>
				<span v-html="$t( 'donation_comment_popup_is_anon' )"></span>
			</CheckboxField>

			<CheckboxField
				input-id="isPublic"
				name="isPublic"
				v-model="commentIsPublic"
			>
				{{ $t( 'donation_comment_popup_is_public' ) }}
			</CheckboxField>

			<FormSummary :show-border="false">
				<template #summary-buttons>
					<FormButton
						id="previous-btn"
						:is-outlined="true"
						@click="$emit( 'close' )"
					>
						{{ $t( 'donation_comment_popup_cancel' ) }}
					</FormButton>
					<FormButton
						id="submit-btn"
						button-type="submit"
					>
						{{ $t( 'donation_comment_popup_submit' ) }}
					</FormButton>
				</template>
			</FormSummary>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { addressTypeFromName, AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Donation } from '@src/view_models/Donation';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';

interface Props {
	donation: Donation;
	addressType: string;
	postCommentUrl: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'disable-comment-link' ] );

const commentForm = ref<HTMLFormElement>( null );
const comment = ref<string>( '' );
const commentIsPublic = ref<boolean>( false );
const commentHasPublicAuthorName = ref<boolean>( false );
const commentErrored = ref<boolean>( false );
const commentHasBeenSubmitted = ref<boolean>( false );
const serverResponse = ref<string>( '' );

const showPublishAuthor = computed<boolean>( () => addressTypeFromName( props.addressType ) !== AddressTypeModel.ANON );

const postComment = (): void => {
	trackFormSubmission( commentForm.value );
	const jsonForm = new FormData( commentForm.value );
	axios.post( props.postCommentUrl, jsonForm ).then( ( validationResult: AxiosResponse<any> ) => {
		if ( validationResult.data.status === 'OK' ) {
			commentErrored.value = false;
			commentHasBeenSubmitted.value = true;
			serverResponse.value = validationResult.data.message;
			emit( 'disable-comment-link' );
		} else {
			commentErrored.value = true;
		}
	} );
};

onMounted( trackDynamicForm );

</script>

<style lang="scss">
@use '@src/scss/settings/units';
@use 'sass:map';

.donation-comment {
	p {
		margin-bottom: map.get( units.$spacing, 'small' );
	}
}
</style>
