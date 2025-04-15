<template>
	<form class="donation-comment" name="donation-comment" v-on:submit.prevent="postComment" method="post" ref="commentForm">
		<input type="hidden" name="donationId" :value="donation.id"/>
		<input type="hidden" name="updateToken" :value="donation.updateToken">
		<div v-if="commentHasBeenSubmitted">
			<p class="donation-comment-server-response" v-html="$t( serverResponse )"></p>
			<FormButton
				button-type="button"
				class="donation-comment-return-button"
				:is-outlined="true"
				@click="$emit( 'close' )"
			>
				{{ $t( 'back_to_donation_summary' ) }}
			</FormButton>
		</div>
		<div v-else>
			<p>{{ $t( 'donation_comment_popup_explanation' ) }}</p>
			<ScrollTarget target-id="comment-scroll-target"/>

			<ErrorSummary
				:is-visible="commentErrored"
				:items="[
					{
						validity: commentErrored ? Validity.INVALID : Validity.VALID,
						message: $t( commentError ),
						focusElement: 'comment',
						scrollElement: 'comment-scroll-target'
					},
				]"
			/>

			<TextField
				input-type="textarea"
				v-model="comment"
				name="comment"
				input-id="comment"
				placeholder=""
				:label="$t( 'donation_comment_popup_label' )"
				:error-message="$t( commentError )"
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
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import { trackDynamicForm, trackFormSubmission } from '@src/util/tracking';
import { addressTypeFromName, AddressTypeModel } from '@src/view_models/AddressTypeModel';
import { Donation } from '@src/view_models/Donation';
import FormButton from '@src/components/shared/form_elements/FormButton.vue';
import FormSummary from '@src/components/shared/FormSummary.vue';
import TextField from '@src/components/shared/form_fields/TextField.vue';
import CheckboxField from '@src/components/shared/form_fields/CheckboxField.vue';
import { CommentResource } from '@src/api/CommentResource';
import ErrorSummary from '@src/components/shared/validation_summary/ErrorSummary.vue';
import { Validity } from '@src/view_models/Validity';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

enum CommentErrorTypes {
	Empty,
	Server,
}

interface Props {
	donation: Donation;
	addressType: string;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'disable-comment-link', 'close' ] );
const commentResource = inject<CommentResource>( 'commentResource' );

const commentForm = ref<HTMLFormElement>( null );
const comment = ref<string>( '' );
const commentIsPublic = ref<boolean>( false );
const commentHasPublicAuthorName = ref<boolean>( false );
const commentErrored = ref<boolean>( false );
const commentErrorType = ref<CommentErrorTypes>( CommentErrorTypes.Empty );
const commentHasBeenSubmitted = ref<boolean>( false );
const serverResponse = ref<string>( '' );
const serverError = ref<string>( '' );

const showPublishAuthor = computed<boolean>( () => addressTypeFromName( props.addressType ) !== AddressTypeModel.ANON );

const postComment = async (): Promise<void> => {
	trackFormSubmission( commentForm.value );
	commentErrored.value = false;

	if ( comment.value === '' ) {
		commentErrorType.value = CommentErrorTypes.Empty;
		await nextTick();
		commentErrored.value = true;
		return;
	}

	commentResource.post( {
		donationId: props.donation.id,
		updateToken: props.donation.updateToken,
		comment: comment.value,
		withName: commentHasPublicAuthorName.value,
		isPublic: commentIsPublic.value,
	} ).then( ( message: string ) => {
		commentErrored.value = false;
		commentHasBeenSubmitted.value = true;
		serverResponse.value = message;
		emit( 'disable-comment-link' );
	} ).catch( ( message: string ) => {
		commentErrorType.value = CommentErrorTypes.Server;
		commentErrored.value = true;
		serverError.value = message;
	} );
};

onMounted( trackDynamicForm );

const commentError = computed<string>( () => {
	if ( commentErrorType.value === CommentErrorTypes.Empty ) {
		return 'donation_comment_popup_empty_error';
	}
	return serverError.value;
} );

watch( comment, ( newComment: string ) => {
	if ( commentErrored.value && newComment !== '' ) {
		commentErrored.value = false;
	}
} );

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
